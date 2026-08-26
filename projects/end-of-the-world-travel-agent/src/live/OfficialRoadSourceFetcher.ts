import type { OfficialRoadPublication } from "./OfficialRoadPublicationAdapter.js";
import type { LiveVerificationSource } from "./LiveVerificationSourceRegistry.js";

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type OfficialRoadSourceFetchResult = {
  source: LiveVerificationSource;
  publications: OfficialRoadPublication[];
  fetchedAt: string;
  warnings: string[];
};

export type FetchOfficialRoadSourceOptions = {
  fetchImpl?: FetchLike;
  fetchedAt?: Date;
  maxCandidates?: number;
};

const LINK_PATTERN = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
const ARTICLE_DATE_PATTERNS = [
  /<time\b[^>]*datetime=["']([^"']+)["'][^>]*>/i,
  /property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i,
  /name=["']date["'][^>]*content=["']([^"']+)["']/i
];

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(html: string): string {
  return decodeHtml(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).trim();
}

function extractTitle(html: string): string {
  const og = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
  if (og) return decodeHtml(og).trim();
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripHtml(title) : "Official road publication";
}

function extractPublishedAt(html: string): string | null {
  for (const pattern of ARTICLE_DATE_PATTERNS) {
    const value = html.match(pattern)?.[1];
    if (value && !Number.isNaN(new Date(value).getTime())) return new Date(value).toISOString();
  }
  return null;
}

function isCandidateLink(href: string, label: string): boolean {
  const haystack = `${href} ${label}`.toLowerCase();
  return /y[-\s]?905|puerto\s+navarino|ruta|vialidad|nieve|hielo|transit|cierre|camino/.test(haystack);
}

function resolveUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function discoverCandidateUrls(indexHtml: string, baseUrl: string, maxCandidates: number): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(indexHtml)) !== null) {
    const href = match[1];
    const label = stripHtml(match[2]);
    if (!isCandidateLink(href, label)) continue;
    const resolved = resolveUrl(baseUrl, href);
    if (!resolved || seen.has(resolved)) continue;
    seen.add(resolved);
    urls.push(resolved);
    if (urls.length >= maxCandidates) break;
  }

  return urls;
}

/**
 * Fetches an official publication channel and normalizes recent candidate pages.
 * This layer performs acquisition only: it never decides whether Ruta Y-905 is
 * open, closed or restricted. State extraction belongs to
 * `OfficialRoadPublicationAdapter`, and freshness belongs to
 * `RoadConditionVerifier`.
 */
export async function fetchOfficialRoadSource(
  source: LiveVerificationSource,
  options: FetchOfficialRoadSourceOptions = {}
): Promise<OfficialRoadSourceFetchResult> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const fetchedAt = options.fetchedAt ?? new Date();
  const maxCandidates = options.maxCandidates ?? 8;
  const warnings: string[] = [];

  if (!fetchImpl) throw new Error("No fetch implementation is available.");

  const indexResponse = await fetchImpl(source.url, {
    headers: { "user-agent": "Austral-Beacon-Travel-Assistant/0.1 (+source-monitor)" }
  });

  if (!indexResponse.ok) {
    return {
      source,
      publications: [],
      fetchedAt: fetchedAt.toISOString(),
      warnings: [`Source index request failed with HTTP ${indexResponse.status}.`]
    };
  }

  const indexHtml = await indexResponse.text();
  const candidateUrls = discoverCandidateUrls(indexHtml, source.url, maxCandidates);

  if (candidateUrls.length === 0) {
    warnings.push("No road-condition candidate publication links were discovered on the source index.");
  }

  const publications: OfficialRoadPublication[] = [];

  for (const url of candidateUrls) {
    try {
      const response = await fetchImpl(url, {
        headers: { "user-agent": "Austral-Beacon-Travel-Assistant/0.1 (+source-monitor)" }
      });
      if (!response.ok) {
        warnings.push(`Candidate request failed with HTTP ${response.status}: ${url}`);
        continue;
      }

      const html = await response.text();
      const publishedAt = extractPublishedAt(html);
      if (!publishedAt) {
        warnings.push(`Candidate has no machine-detectable publication date and was skipped: ${url}`);
        continue;
      }

      const text = stripHtml(html);
      if (!text) {
        warnings.push(`Candidate contained no usable text and was skipped: ${url}`);
        continue;
      }

      publications.push({
        sourceId: source.source_id,
        sourceUrl: url,
        producer: source.producer,
        publishedAt,
        title: extractTitle(html),
        text
      });
    } catch (error) {
      warnings.push(`Candidate fetch failed: ${url} (${error instanceof Error ? error.message : "unknown error"})`);
    }
  }

  publications.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return {
    source,
    publications,
    fetchedAt: fetchedAt.toISOString(),
    warnings
  };
}

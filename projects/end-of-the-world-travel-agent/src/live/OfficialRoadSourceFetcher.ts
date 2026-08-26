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
const STRONG_ROAD_PATTERN = /y[-\s]?905|ruta|vialidad|camino|carretera|transit|cierre|nieve|hielo|calzada/i;
const SPANISH_DATE_PATTERN = /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+(20\d{2})\b/i;

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12
};

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
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    if (!/property=["']og:title["']/i.test(tag)) continue;
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (content) return decodeHtml(content).trim();
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripHtml(title) : "Official road publication";
}

function normalizeExplicitDate(value: string): string | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function dateOnlyToIso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // Conservative local-date fallback for the Magallanes source pages used in this batch.
  // Midnight avoids inventing a later publication time when the page exposes only a date.
  const value = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00-04:00`;
  return normalizeExplicitDate(value);
}

function extractPublishedAt(html: string, url: string): string | null {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    const identifiesDate =
      /property=["']article:published_time["']/i.test(tag) ||
      /name=["'](?:date|publish(?:ed)?date)["']/i.test(tag) ||
      /itemprop=["']datePublished["']/i.test(tag);
    if (!identifiesDate) continue;
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (content) {
      const normalized = normalizeExplicitDate(content);
      if (normalized) return normalized;
    }
  }

  const timeTags = html.match(/<time\b[^>]*>/gi) ?? [];
  for (const tag of timeTags) {
    const datetime = tag.match(/datetime=["']([^"']+)["']/i)?.[1];
    if (datetime) {
      const normalized = normalizeExplicitDate(datetime);
      if (normalized) return normalized;
    }
  }

  const visibleText = stripHtml(html);
  const spanish = visibleText.match(SPANISH_DATE_PATTERN);
  if (spanish) {
    const day = Number(spanish[1]);
    const month = MONTHS[spanish[2].toLowerCase()];
    const year = Number(spanish[3]);
    const normalized = dateOnlyToIso(year, month, day);
    if (normalized) return normalized;
  }

  const urlDate = url.match(/\/(20\d{2})\/(\d{1,2})\/(\d{1,2})(?:\/|$)/);
  if (urlDate) {
    return dateOnlyToIso(Number(urlDate[1]), Number(urlDate[2]), Number(urlDate[3]));
  }

  return null;
}

function isCandidateLink(href: string, label: string): boolean {
  const normalizedHref = decodeHtml(href).toLowerCase();
  const normalizedLabel = stripHtml(label).toLowerCase();

  // Discovery stays broader than state extraction, but requires an actual road-condition
  // signal in the URL or anchor label. Place names alone are not enough because official
  // home pages contain many unrelated Puerto Williams publications.
  return STRONG_ROAD_PATTERN.test(normalizedHref) || STRONG_ROAD_PATTERN.test(normalizedLabel);
}

function resolveUrl(base: string, href: string): string | null {
  try {
    const baseUrl = new URL(base);
    const resolved = new URL(href, baseUrl);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
    if (resolved.hostname !== baseUrl.hostname) return null;
    return resolved.toString();
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
    const label = match[2];
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
 * Fetches an official publication channel and normalizes candidate pages.
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
      const publishedAt = extractPublishedAt(html, url);
      if (!publishedAt) {
        warnings.push(`Candidate has no detectable publication date and was skipped: ${url}`);
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

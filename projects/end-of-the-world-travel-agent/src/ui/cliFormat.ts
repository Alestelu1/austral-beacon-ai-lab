const DEFAULT_MAX_URL_LENGTH = 72;

/**
 * Formats a URL for narrow terminal output while preserving enough context to
 * identify the source. The canonical URL remains unchanged in the answer data;
 * this function only affects CLI presentation.
 */
export function formatCliUrl(
  url: string,
  maxLength = DEFAULT_MAX_URL_LENGTH
): string {
  if (url.length <= maxLength) return url;
  if (maxLength < 24) return `${url.slice(0, Math.max(1, maxLength - 1))}…`;

  try {
    const parsed = new URL(url);
    const prefix = `${parsed.protocol}//${parsed.host}`;
    const suffixSource = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    const roomForSuffix = maxLength - prefix.length - 2;

    if (roomForSuffix >= 10) {
      const suffix = suffixSource.slice(-roomForSuffix);
      return `${prefix}/…${suffix.replace(/^\//, "")}`;
    }
  } catch {
    // Fall through to generic middle truncation for non-standard URLs.
  }

  const headLength = Math.ceil((maxLength - 1) * 0.6);
  const tailLength = maxLength - 1 - headLength;
  return `${url.slice(0, headLength)}…${url.slice(-tailLength)}`;
}

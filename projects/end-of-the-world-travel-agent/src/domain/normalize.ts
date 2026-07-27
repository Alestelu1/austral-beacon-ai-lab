/**
 * Normalizes a string for case-insensitive, diacritic-insensitive comparison.
 * Converts to NFD, strips combining marks, lowercases, and trims.
 */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

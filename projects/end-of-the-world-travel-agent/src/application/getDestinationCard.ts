import type { DestinationCardAnswer } from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import type { DestinationCardRepository } from "../ports/DestinationCardRepository.js";

const STALE_SOURCE_THRESHOLD_DAYS = 180;

function daysSince(isoDate: string): number {
  const then = new Date(isoDate + "T00:00:00Z");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDestinationCard(
  identifier: string,
  repository: DestinationCardRepository
): DestinationCardAnswer {
  // Empty/whitespace identifier
  if (!identifier || identifier.trim().length === 0) {
    return {
      status: "unsupported",
      intent: "destination-info",
      summary: "El identificador de destino proporcionado es inválido.",
      confidence: "none",
      warnings: [],
      sources: [],
      suggestedInternalLinks: [],
    };
  }

  const normalizedKey = normalize(identifier);
  const card = repository.findByNormalizedKey(normalizedKey);

  // Not found
  if (!card) {
    return {
      status: "unsupported",
      intent: "destination-info",
      summary: "El destino consultado no está disponible en la base local.",
      confidence: "none",
      warnings: [],
      sources: [],
      suggestedInternalLinks: [],
    };
  }

  // Derive confidence from source statuses
  const hasProvisional = card.sources.some((s) => s.status === "provisional");
  const confidence = hasProvisional ? "medium" : "high";

  // Build warnings
  const warnings: string[] = [...card.warnings];

  if (hasProvisional) {
    warnings.push("Algunas fuentes tienen estado provisional. La información requiere confirmación con fuente primaria.");
  }

  // Check for stale sources
  for (const source of card.sources) {
    const age = daysSince(source.verifiedAt);
    if (age > STALE_SOURCE_THRESHOLD_DAYS) {
      warnings.push(`Fuente desactualizada: "${source.title}" — última verificación: ${source.verifiedAt}.`);
    }
  }

  return {
    status: "supported",
    intent: "destination-info",
    summary: card.summary,
    confidence,
    warnings,
    sources: card.sources,
    suggestedInternalLinks: card.suggestedInternalLinks,
    verifiedAt: card.verifiedAt,
    card,
  };
}

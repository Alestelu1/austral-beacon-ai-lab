import type { AntarcticAccessAnswer, AntarcticAccessRecord } from "../domain/types.js";

/**
 * Builds a structured Antarctic-access answer from a curated, source-backed
 * access record.
 *
 * Pure function. It preserves the explicit category of each pathway
 * (gateway-policy vs commercial-product vs state-science vs
 * planned-infrastructure) so callers never collapse gateway status into a
 * commercial service, a published product into current availability, or a
 * state/scientific capability into a public tourist route. It carries the
 * Puerto Williams clarification, warnings and sources unchanged and invents
 * nothing beyond the record.
 */
export function answerAntarcticAccess(record: AntarcticAccessRecord): AntarcticAccessAnswer {
  const confidence: AntarcticAccessAnswer["confidence"] = record.sources.some(
    (source) => source.status === "provisional"
  )
    ? "medium"
    : "high";

  return {
    status: "supported",
    intent: "antarctic-access",
    summary: record.summary,
    pathways: record.pathways,
    puertoWilliamsClarification: record.puertoWilliamsClarification,
    confidence,
    warnings: record.warnings,
    sources: record.sources,
    suggestedInternalLinks: record.suggestedInternalLinks,
    verifiedAt: record.verifiedAt
  };
}

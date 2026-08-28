import type { PlaceRelationshipRecord, RelationshipAnswer } from "../domain/types.js";

/**
 * Builds a structured relationship answer from a curated, source-backed
 * relationship record.
 *
 * Pure function. Keeps the stable administrative relation and geographic
 * distinction separate, preserves the distinct referents of an ambiguous name
 * so callers never collapse commune/cape/island/park into one entity, and
 * carries warnings and source metadata unchanged. It invents nothing beyond the
 * record.
 */
export function answerPlaceRelationship(record: PlaceRelationshipRecord): RelationshipAnswer {
  const confidence: RelationshipAnswer["confidence"] = record.sources.some(
    (source) => source.status === "provisional"
  )
    ? "medium"
    : "high";

  const summary = `${record.administrativeRelation} ${record.geographicDistinction}`;

  return {
    status: "supported",
    intent: "relationship",
    summary,
    administrativeRelation: record.administrativeRelation,
    geographicDistinction: record.geographicDistinction,
    distinctReferents: record.distinctReferents,
    confidence,
    warnings: record.warnings,
    sources: record.sources,
    suggestedInternalLinks: record.suggestedInternalLinks,
    verifiedAt: record.verifiedAt
  };
}

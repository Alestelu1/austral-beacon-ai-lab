import type { PlaceRelationshipRecord, RelationshipAnswer } from "../domain/types.js";
import { buildVillaUkikaRelationship } from "../knowledge/villaUkikaProjection.js";

/**
 * Builds a structured relationship answer from a curated, source-backed
 * relationship record.
 *
 * Incremental canonical migration rule:
 * Villa Ukika is now projected at runtime from the canonical knowledge-base.
 * The legacy JSON may still be passed by the existing router, but is ignored as
 * a served source of truth for this relationship. Other relationships keep their
 * existing behaviour until they receive their own canonical projection.
 */
export function answerPlaceRelationship(record: PlaceRelationshipRecord): RelationshipAnswer {
  const effectiveRecord =
    record.id === "villa-ukika-puerto-williams"
      ? buildVillaUkikaRelationship()
      : record;

  const confidence: RelationshipAnswer["confidence"] = effectiveRecord.sources.some(
    (source) => source.status === "provisional"
  )
    ? "medium"
    : "high";

  const summary = `${effectiveRecord.administrativeRelation} ${effectiveRecord.geographicDistinction}`;

  return {
    status: "supported",
    intent: "relationship",
    summary,
    administrativeRelation: effectiveRecord.administrativeRelation,
    geographicDistinction: effectiveRecord.geographicDistinction,
    distinctReferents: effectiveRecord.distinctReferents,
    confidence,
    warnings: effectiveRecord.warnings,
    sources: effectiveRecord.sources,
    suggestedInternalLinks: effectiveRecord.suggestedInternalLinks,
    verifiedAt: effectiveRecord.verifiedAt
  };
}

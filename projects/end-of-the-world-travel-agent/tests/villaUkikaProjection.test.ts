import { describe, expect, it } from "vitest";
import {
  buildVillaUkikaRelationship,
  isVillaUkikaClaimProjectable,
  VILLA_UKIKA_ENTITY_ID
} from "../src/knowledge/villaUkikaProjection.js";
import { answerPlaceRelationship } from "../src/application/answerPlaceRelationship.js";
import type { PlaceRelationshipRecord } from "../src/domain/types.js";

const ALLOWED = [
  "villa-ukika-identity-001",
  "villa-ukika-community-002",
  "villa-ukika-culture-003",
  "villa-ukika-geometry-004"
];

describe("Villa Ukika travel projection v1", () => {
  it("projects only explicitly allowed canonical claims", () => {
    for (const id of ALLOWED) expect(isVillaUkikaClaimProjectable(id)).toBe(true);
    expect(isVillaUkikaClaimProjectable("unknown-claim")).toBe(false);
  });

  it("builds a living-community relationship distinct from Puerto Williams", () => {
    const record = buildVillaUkikaRelationship();
    expect(VILLA_UKIKA_ENTITY_ID).toBe("villa-ukika");
    expect(record.subject).toBe("Villa Ukika");
    expect(record.object).toBe("Puerto Williams");
    expect(record.distinctReferents.map((item) => item.kind)).toContain("community-context");
    expect(record.geographicDistinction.toLowerCase()).toContain("distinct");
  });

  it("does not expose coordinates or turn visitor access into a stable fact", () => {
    const serialized = JSON.stringify(buildVillaUkikaRelationship()).toLowerCase();
    expect(serialized).not.toContain("latitude");
    expect(serialized).not.toContain("longitude");
    expect(serialized).toContain("requiere verificación actual");
  });

  it("preserves the community-framing safeguards", () => {
    const record = buildVillaUkikaRelationship();
    const text = `${record.administrativeRelation} ${record.warnings.join(" ")}`.toLowerCase();
    expect(text).toContain("comunidad yagán viva");
    expect(text).toContain("últimos descendientes");
    expect(text).toContain("no como atracción turística");
  });
});

describe("Villa Ukika runtime migration", () => {
  it("ignores legacy relationship prose and serves the canonical projection", () => {
    const fakeLegacy: PlaceRelationshipRecord = {
      id: "villa-ukika-puerto-williams",
      subject: "LEGACY SUBJECT",
      object: "LEGACY OBJECT",
      administrativeRelation: "LEGACY DATA SHOULD NOT BE SERVED",
      geographicDistinction: "LEGACY GEOGRAPHY",
      distinctReferents: [],
      warnings: [],
      sources: [],
      suggestedInternalLinks: [],
      verifiedAt: "2000-01-01"
    };

    const answer = answerPlaceRelationship(fakeLegacy);
    expect(answer.summary).not.toContain("LEGACY");
    expect(answer.summary).toContain("Villa Ukika");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.verifiedAt).not.toBe("2000-01-01");
  });
});

import { describe, expect, it } from "vitest";
import { verifyY905RoadCondition, type RoadConditionObservation } from "../src/live/RoadConditionVerifier.js";

const checkedAt = new Date("2026-08-26T12:00:00Z");

function observation(overrides: Partial<RoadConditionObservation> = {}): RoadConditionObservation {
  return {
    sourceId: "dpp-antartica",
    sourceUrl: "https://dppantartica.dpp.gob.cl/example",
    producer: "Delegación Presidencial Provincial de la Antártica Chilena",
    observedAt: "2026-08-26T09:00:00Z",
    publishedAt: "2026-08-26T10:00:00Z",
    routeId: "ruta_y905",
    routeState: "open",
    evidenceText: "La autoridad informa explícitamente condición transitable de la Ruta Y-905.",
    territorialScope: ["ruta_y905", "puerto_williams", "puerto_navarino"],
    ...overrides
  };
}

describe("verifyY905RoadCondition", () => {
  it("returns verified_open only from fresh explicit official observation", () => {
    const result = verifyY905RoadCondition([observation()], { checkedAt });
    expect(result.status).toBe("verified_open");
    expect(result.source?.sourceId).toBe("dpp-antartica");
    expect(result.evidenceAgeHours).toBe(2);
  });

  it("returns verified_closed for an explicit fresh closure", () => {
    const result = verifyY905RoadCondition([observation({ routeState: "closed" })], { checkedAt });
    expect(result.status).toBe("verified_closed");
  });

  it("returns restricted for a fresh explicit restriction", () => {
    const result = verifyY905RoadCondition([observation({ routeState: "restricted" })], { checkedAt });
    expect(result.status).toBe("restricted");
  });

  it("does not treat an ambiguous observation as proof of current state", () => {
    const result = verifyY905RoadCondition([observation({ routeState: "unknown" })], { checkedAt });
    expect(result.status).toBe("not_verified");
    expect(result.reason).toContain("does not explicitly establish");
  });

  it("rejects stale evidence even if it once said the road was open", () => {
    const result = verifyY905RoadCondition([
      observation({ publishedAt: "2026-08-24T10:00:00Z", routeState: "open" })
    ], { checkedAt, maxEvidenceAgeHours: 24 });

    expect(result.status).toBe("not_verified");
    expect(result.source).toBeNull();
  });

  it("rejects future-dated evidence", () => {
    const result = verifyY905RoadCondition([
      observation({ publishedAt: "2026-08-27T10:00:00Z" })
    ], { checkedAt });
    expect(result.status).toBe("not_verified");
  });

  it("uses the most recent eligible official observation", () => {
    const result = verifyY905RoadCondition([
      observation({ publishedAt: "2026-08-26T08:00:00Z", routeState: "open" }),
      observation({ publishedAt: "2026-08-26T11:00:00Z", routeState: "closed" })
    ], { checkedAt });

    expect(result.status).toBe("verified_closed");
    expect(result.evidenceAgeHours).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import {
  buildStraitProjectionFacts,
  isClaimProjectable,
  STRAIT_ENTITY_ID
} from "../src/knowledge/straitProjection.js";

// Claim ids from the canonical entity, grouped by contract disposition.
// strait-jurisdiction-chile is now an ALLOWED public_core Chilean context claim.
const ALLOWED = ["strait-length-330-nm", "strait-jurisdiction-chile"];
const CONDITIONAL_NOT_IN_V1 = [
  "first-narrows-length",
  "second-narrows-length",
  "paso-tortuoso-length"
];
const BLOCKED = [
  "strait-navigation-open-all-flags",
  "strait-navigation-interest-areas",
  "first-narrows-current-tide",
  "paso-tortuoso-traffic-control"
];

describe("Strait projection v1 — contract filtering", () => {
  it("exposes only the contract-allowed claim(s)", () => {
    const facts = buildStraitProjectionFacts();
    const claimIds = facts.map((f) => f.claimId);
    expect(claimIds).toEqual(ALLOWED);
  });

  it("marks allowed claims as projectable", () => {
    for (const id of ALLOWED) expect(isClaimProjectable(id)).toBe(true);
  });

  it("BLOCKED claims can never enter the projection", () => {
    for (const id of BLOCKED) {
      expect(isClaimProjectable(id)).toBe(false);
      expect(buildStraitProjectionFacts().some((f) => f.claimId === id)).toBe(false);
    }
  });

  it("conditional claims (jurisdiction, narrows, paso-tortuoso lengths) are NOT in v1", () => {
    for (const id of CONDITIONAL_NOT_IN_V1) {
      expect(isClaimProjectable(id)).toBe(false);
      expect(buildStraitProjectionFacts().some((f) => f.claimId === id)).toBe(false);
    }
  });
});

describe("Strait projection v1 — provenance preservation", () => {
  it("preserves canonical entity_id, claim_id and source_ids on every fact", () => {
    const facts = buildStraitProjectionFacts();
    expect(facts.length).toBeGreaterThan(0);
    for (const f of facts) {
      expect(f.entityId).toBe(STRAIT_ENTITY_ID);
      expect(f.claimId).toBeTruthy();
      expect(f.sourceIds.length).toBeGreaterThan(0);
      // v1 only projects DIRECTEMAR-sourced stable length/mouths fact.
      expect(f.sourceIds).toContain("directemar-generalidades-estrecho-magallanes");
      expect(f.sensitivity).toBe("public_core");
    }
  });

  it("does not leak operational navigation content into projected text", () => {
    const text = buildStraitProjectionFacts().map((f) => f.text).join(" ").toLowerCase();
    for (const term of ["corriente", "marea", "nudos", "control de tráfico", "pilotaje", "tráfico"]) {
      expect(text).not.toContain(term);
    }
  });

  it("does not leak treaty/sovereignty content into projected text", () => {
    const text = buildStraitProjectionFacts().map((f) => f.text).join(" ").toLowerCase();
    for (const term of ["tratado", "soberanía", "soberania", "banderas"]) {
      expect(text).not.toContain(term);
    }
  });
});

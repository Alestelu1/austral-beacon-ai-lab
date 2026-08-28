import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { RelationshipAnswer } from "../src/domain/types.js";

const RELATIONSHIP_VARIATIONS = [
  "What is the relationship between Puerto Williams and Cape Horn?",
  "Is Puerto Williams in Cape Horn?",
  "Is Puerto Williams the same as Cabo de Hornos?",
  "¿Qué relación hay entre Puerto Williams y Cabo de Hornos?",
  "¿Puerto Williams está en Cabo de Hornos?"
];

function asRelationship(question: string): RelationshipAnswer {
  const answer = answerTravelQuestion(question);
  if (!("distinctReferents" in answer)) {
    throw new Error(`Expected relationship answer for: ${question}`);
  }
  return answer;
}

describe("Flow 2 — Puerto Williams / Cabo de Hornos relationship", () => {
  it.each(RELATIONSHIP_VARIATIONS)("recognizes variation: %s", (question) => {
    const answer = answerTravelQuestion(question);
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("relationship");
  });

  it("explains the administrative relationship (commune membership)", () => {
    const answer = asRelationship("¿Qué relación hay entre Puerto Williams y Cabo de Hornos?");
    const admin = answer.administrativeRelation.toLowerCase();
    expect(admin).toContain("comuna");
    expect(admin).toContain("cabo de hornos");
    expect(admin).toContain("puerto williams");
  });

  it("explains the geographic distinction (Isla Navarino vs the cape/island)", () => {
    const answer = asRelationship("What is the relationship between Puerto Williams and Cape Horn?");
    const geo = answer.geographicDistinction.toLowerCase();
    expect(geo).toContain("isla navarino");
    expect(geo).toContain("wollaston");
  });

  it("does not imply Puerto Williams is located at Cape Horn itself", () => {
    const answer = asRelationship("Is Puerto Williams in Cape Horn?");
    const geo = answer.geographicDistinction.toLowerCase();
    // Must explicitly deny co-location with the cape / Hornos island.
    expect(geo).toContain("no est");
  });

  it("keeps commune, cape, island and park as distinct referents (no entity collapse)", () => {
    const answer = asRelationship("Is Puerto Williams the same as Cabo de Hornos?");
    const kinds = answer.distinctReferents.map((r) => r.kind);
    expect(kinds).toContain("commune");
    expect(kinds).toContain("cape");
    expect(kinds).toContain("island");
    expect(kinds).toContain("national-park");
    expect(kinds).toContain("city");
    // At least five distinct referents means the name is not collapsed to one entity.
    expect(new Set(kinds).size).toBeGreaterThanOrEqual(5);
  });

  it("carries verified source metadata", () => {
    const answer = asRelationship("¿Qué relación hay entre Puerto Williams y Cabo de Hornos?");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.sources.every((s) => s.status === "verified")).toBe(true);
    for (const source of answer.sources) {
      expect(source.title).toBeTruthy();
      expect(source.publisher).toBeTruthy();
      expect(source.url).toBeTruthy();
      expect(source.verifiedAt).toBeTruthy();
    }
    expect(answer.confidence).toBe("high");
  });

  it("includes a warning that current access to the cape/island/park requires verification", () => {
    const answer = asRelationship("¿Puerto Williams está en Cabo de Hornos?");
    const text = answer.warnings.join(" ").toLowerCase();
    expect(answer.warnings.length).toBeGreaterThan(0);
    expect(text).toContain("conaf");
  });

  it("does not infer transport/access from geographic proximity", () => {
    const answer = asRelationship("¿Qué relación hay entre Puerto Williams y Cabo de Hornos?");
    // Accent-insensitive comparison of the warnings.
    const text = answer.warnings
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    expect(text).toContain("no implica cercania fisica ni acceso directo");
  });

  it("flows through the unified entry point preserving the relationship intent", async () => {
    const answer = await answerViaAssistant("Is Puerto Williams the same as Cabo de Hornos?");
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("relationship");
  });
});

describe("Flow 2 — does not disturb existing flows", () => {
  it("still returns the destination card for a plain Cabo de Hornos info question", () => {
    const answer = answerTravelQuestion("Información de Cabo de Hornos");
    expect(answer.intent).toBe("destination-info");
  });

  it("still returns connectivity for a Punta Arenas → Puerto Williams travel question", () => {
    const answer = answerTravelQuestion("¿Cómo viajar de Punta Arenas a Puerto Williams?");
    expect(answer.intent).toBe("connectivity");
  });
});

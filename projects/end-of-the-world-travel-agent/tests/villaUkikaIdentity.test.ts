import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { RelationshipAnswer } from "../src/domain/types.js";

const VILLA_UKIKA_QUERIES = [
  "¿Qué es Villa Ukika?",
  "What is Villa Ukika?",
  "¿Qué relación tiene Villa Ukika con Puerto Williams?",
  "Is Villa Ukika the same as Puerto Williams?"
];

function asRelationship(question: string): RelationshipAnswer {
  const answer = answerTravelQuestion(question);
  if (!("distinctReferents" in answer)) {
    throw new Error(`Expected relationship answer for: ${question}`);
  }
  return answer;
}

function normText(answer: RelationshipAnswer): string {
  return [
    answer.summary,
    answer.administrativeRelation,
    answer.geographicDistinction,
    ...answer.warnings,
    ...answer.distinctReferents.map((r) => `${r.name} ${r.description}`)
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

describe("Villa Ukika — identity and relationship queries (Spanish + English)", () => {
  it.each(VILLA_UKIKA_QUERIES)("recognizes as a relationship answer: %s", (q) => {
    const answer = answerTravelQuestion(q);
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("relationship");
  });

  it("flows through the unified entry point preserving relationship intent", async () => {
    const answer = await answerViaAssistant("¿Qué es Villa Ukika?");
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("relationship");
  });

  it("describes Villa Ukika as a living/contemporary Yagán community context", () => {
    const text = normText(asRelationship("¿Qué es Villa Ukika?"));
    expect(text).toContain("comunidad yagan viva");
    expect(text).toMatch(/continuidad cultural/);
    expect(text).toContain("comunidad indigena yaghan de bahia mejillones");
  });

  it("keeps Villa Ukika explicitly distinct from Puerto Williams", () => {
    const answer = asRelationship("Is Villa Ukika the same as Puerto Williams?");
    const text = normText(answer);
    expect(text).toContain("puerto williams");
    expect(text).toContain("distinto de puerto williams");
    // Both referents present: the city and the community context.
    const kinds = answer.distinctReferents.map((r) => r.name.toLowerCase());
    expect(kinds.some((n) => n.includes("puerto williams"))).toBe(true);
    expect(kinds.some((n) => n.includes("villa ukika"))).toBe(true);
  });
});

describe("Villa Ukika — mandatory safeguards", () => {
  it("only references 'últimos descendientes' as an explicit prohibition, never affirmatively", () => {
    const text = normText(asRelationship("¿Qué es Villa Ukika?"));
    // The phrase must appear only inside a negation/prohibition ("no ... ni ... 'ultimos descendientes'").
    if (text.includes("ultimos descendientes")) {
      expect(text).toMatch(/no\b[^.]*ultimos descendientes|ni\b[^.]*ultimos descendientes/);
    }
    // Never used as an affirmative present-day description of the community.
    expect(text).not.toMatch(/villa ukika[^.]*son (los|las) ultimos descendientes/);
    expect(text).not.toContain("last descendants");
  });

  it("does NOT present Villa Ukika merely as a tourist attraction / static ethnographic site", () => {
    // The only occurrences of tourism/ethnographic framing must be negations (safeguards).
    const answer = asRelationship("¿Qué es Villa Ukika?");
    const text = normText(answer);
    expect(text).toContain("no debe presentarse como una atraccion turistica");
    expect(text).toMatch(/no como una atraccion turistica|no debe presentarse como una atraccion turistica/);
  });

  it("does NOT invent population figures", () => {
    const text = normText(asRelationship("¿Qué es Villa Ukika?"));
    expect(text).not.toMatch(/\d+\s*(habitantes|personas|pobladores)/);
    expect(text).not.toMatch(/poblacion de \d+/);
  });

  it("does NOT invent coordinates and keeps geometry pending; distance is provisional", () => {
    const answer = asRelationship("¿Qué relación tiene Villa Ukika con Puerto Williams?");
    // No lat/long decimal pairs in user-facing text.
    const raw = JSON.stringify(answer);
    expect(raw).not.toMatch(/-?\d{1,2}\.\d{3,}/);
    const text = normText(answer);
    expect(text).toContain("pendiente");
    expect(text).toMatch(/provisional/);
  });

  it("treats visitor access as dynamic and culturally sensitive (no affirmative year-round claim)", () => {
    const text = normText(asRelationship("¿Qué es Villa Ukika?"));
    expect(text).toMatch(/dinamico y culturalmente sensible|culturalmente apropiada/);
    // Any mention of "todo el año" must be a negation (no affirmative year-round access claim).
    if (text.includes("todo el ano")) {
      expect(text).toMatch(/no se asume[^.]*todo el ano|ni[^.]*todo el ano/);
    }
    expect(text).not.toMatch(/se puede visitar[^.]*todo el ano|abierta todo el ano/);
  });

  it("carries only verified Chilean institutional sources", () => {
    const answer = asRelationship("¿Qué es Villa Ukika?");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.sources.every((s) => s.status === "verified")).toBe(true);
    const publishers = answer.sources.map((s) => s.publisher.toLowerCase()).join(" ");
    expect(publishers).toContain("patrimonio cultural");
    expect(answer.confidence).toBe("high");
  });
});

describe("Villa Ukika — existing flows preserved", () => {
  it("Puerto Williams destination-info still resolves", () => {
    const a = answerTravelQuestion("¿Qué es Puerto Williams?");
    expect(a.intent).toBe("destination-info");
  });

  it("Puerto Toro destination-info still resolves", () => {
    const a = answerTravelQuestion("¿Qué es Puerto Toro?");
    expect(a.intent).toBe("destination-info");
  });

  it("Puerto Williams / Cabo de Hornos relationship still resolves", () => {
    const a = answerTravelQuestion("¿Qué relación hay entre Puerto Williams y Cabo de Hornos?");
    expect(a.intent).toBe("relationship");
  });

  it("Punta Arenas → Puerto Williams connectivity still resolves", () => {
    const a = answerTravelQuestion("¿Cómo viajar de Punta Arenas a Puerto Williams?");
    expect(a.intent).toBe("connectivity");
  });

  it("Antarctic access still resolves", () => {
    const a = answerTravelQuestion("How can I reach Antarctica from Chile?");
    expect(a.intent).toBe("antarctic-access");
  });
});

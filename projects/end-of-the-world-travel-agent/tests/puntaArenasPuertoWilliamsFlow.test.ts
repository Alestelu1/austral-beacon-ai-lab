import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { TravelAnswer } from "../src/domain/types.js";

const PUNTA_ARENAS_VARIATIONS = [
  "How do I travel from Punta Arenas to Puerto Williams?",
  "How can I get from Punta Arenas to Puerto Williams?",
  "¿Cómo viajar de Punta Arenas a Puerto Williams?",
  "What are the ways to reach Puerto Williams from Punta Arenas?",
  "¿Cómo llegar de Punta Arenas a Puerto Williams?"
];

describe("Flow 1 — Punta Arenas → Puerto Williams (deterministic connectivity)", () => {
  it.each(PUNTA_ARENAS_VARIATIONS)("recognizes variation: %s", (question) => {
    const answer = answerTravelQuestion(question) as TravelAnswer;

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect("stages" in answer).toBe(true);
    expect(answer.stages.length).toBeGreaterThan(0);
  });

  it("returns the Punta Arenas-scoped route, distinct from the Santiago route", () => {
    const answer = answerTravelQuestion(
      "¿Cómo viajar de Punta Arenas a Puerto Williams?"
    ) as TravelAnswer;

    // Every documented stage starts at Punta Arenas (single-leg, not Santiago-origin).
    expect(answer.stages.every((stage) => stage.from === "Punta Arenas")).toBe(true);
    expect(answer.stages.some((stage) => stage.from === "Santiago")).toBe(false);
    expect(answer.summary.toLowerCase()).toContain("punta arenas");
  });

  it("exposes verified transport modes (air and sea) as stable route identity", () => {
    const answer = answerTravelQuestion(
      "How do I travel from Punta Arenas to Puerto Williams?"
    ) as TravelAnswer;

    const modes = answer.stages.map((stage) => stage.mode);
    expect(modes).toContain("air");
    expect(modes).toContain("sea");
  });

  it("marks all operational details as dynamic (schedules/fares/availability need verification)", () => {
    const answer = answerTravelQuestion(
      "How can I get from Punta Arenas to Puerto Williams?"
    ) as TravelAnswer;

    expect(answer.stages.every((stage) => stage.stability === "dynamic")).toBe(true);
  });

  it("carries source metadata and at least one verified Chilean source", () => {
    const answer = answerTravelQuestion(
      "What are the ways to reach Puerto Williams from Punta Arenas?"
    ) as TravelAnswer;

    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.sources.some((source) => source.status === "verified")).toBe(true);
    for (const source of answer.sources) {
      expect(source.title).toBeTruthy();
      expect(source.publisher).toBeTruthy();
      expect(source.url).toBeTruthy();
      expect(source.verifiedAt).toBeTruthy();
    }
  });

  it("includes warnings requiring current verification", () => {
    const answer = answerTravelQuestion(
      "¿Cómo viajar de Punta Arenas a Puerto Williams?"
    ) as TravelAnswer;

    expect(answer.warnings.length).toBeGreaterThan(0);
  });

  it("does not infer an operational service from infrastructure alone", () => {
    const answer = answerTravelQuestion(
      "How do I travel from Punta Arenas to Puerto Williams?"
    ) as TravelAnswer;

    const text = [answer.summary, ...answer.warnings, ...answer.stages.map((s) => s.note)]
      .join(" ")
      .toLowerCase();

    // A published operator route is stated, but never as guaranteed current availability.
    expect(text).toContain("no garantiza disponibilidad");
  });

  it("flows through the unified entry point as a deterministic connectivity answer", async () => {
    const answer = (await answerViaAssistant(
      "¿Cómo viajar de Punta Arenas a Puerto Williams?"
    )) as TravelAnswer;

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages.every((stage) => stage.from === "Punta Arenas")).toBe(true);
  });
});

describe("Flow 1 — Santiago route remains distinct", () => {
  it("still returns the two-stage Santiago route for Santiago questions", () => {
    const answer = answerTravelQuestion(
      "¿Cómo llegar desde Santiago a Puerto Williams?"
    ) as TravelAnswer;

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages).toHaveLength(2);
    expect(answer.stages[0]?.from).toBe("Santiago");
    expect(answer.stages[0]?.to).toBe("Punta Arenas");
  });
});

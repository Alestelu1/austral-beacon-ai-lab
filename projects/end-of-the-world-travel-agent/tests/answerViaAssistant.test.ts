import { describe, expect, it } from "vitest";
import { answerViaAssistant, toUnifiedAnswer } from "../src/application/answerViaAssistant.js";
import type { DestinationCardAnswer, TravelAnswer } from "../src/domain/types.js";
import type { KnowledgeAnswer } from "../src/application/answerKnowledgeQuestion.js";

describe("answerViaAssistant — unified default entry point", () => {
  it("passes deterministic connectivity answers through unchanged", async () => {
    const answer = (await answerViaAssistant(
      "¿Cómo llegar desde Santiago a Puerto Williams?"
    )) as TravelAnswer;

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages.length).toBeGreaterThan(0);
    expect(answer.sources.length).toBeGreaterThan(0);
  });

  it("passes deterministic destination-info answers through unchanged", async () => {
    const answer = (await answerViaAssistant("¿Qué es Puerto Williams?")) as DestinationCardAnswer;

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("destination-info");
    expect(answer.confidence).toBe("high");
    expect(answer.card?.name).toBe("Puerto Williams");
  });

  it("maps stable knowledge retrieval to a supported knowledge answer", async () => {
    const answer = await answerViaAssistant(
      "¿Qué ruta conecta Puerto Williams con Puerto Navarino?"
    );

    expect(answer.intent).toBe("knowledge");
    if (answer.intent !== "knowledge") throw new Error("Expected knowledge answer");
    expect(answer.status).toBe("supported");
    expect(answer.route).toBe("stable_rag");
    expect(answer.knowledgeStatus).toBe("retrieved");
    expect(answer.matchedSignals).toEqual([]);
  });

  it("maps a no-evidence stable result to the unsupported/unknown fallback", async () => {
    const answer = (await answerViaAssistant("¿Cuánto cuesta un café?")) as TravelAnswer;

    expect(answer.status).toBe("unsupported");
    expect(answer.intent).toBe("unknown");
  });
});

describe("toUnifiedAnswer — pure mapping", () => {
  it("returns the inner answer for deterministic results", () => {
    const inner: TravelAnswer = {
      status: "supported",
      intent: "connectivity",
      summary: "x",
      stages: [],
      warnings: [],
      sources: []
    };

    const result = toUnifiedAnswer({ kind: "deterministic_travel", answer: inner });
    expect(result).toBe(inner);
  });

  it("maps no_evidence knowledge answers to unsupported/unknown", () => {
    const knowledge: KnowledgeAnswer = {
      status: "no_evidence",
      route: "stable_rag",
      summary: "sin evidencia",
      hits: [],
      routingReason: "",
      matchedSignals: [],
      verificationPlans: [],
      liveExecutions: []
    };

    const result = toUnifiedAnswer({ kind: "knowledge", answer: knowledge });
    expect(result.status).toBe("unsupported");
    expect(result.intent).toBe("unknown");
  });

  it("keeps live_verification_required as an unsupported knowledge answer with signals", () => {
    const knowledge: KnowledgeAnswer = {
      status: "live_verification_required",
      route: "live_verification",
      summary: "requiere verificación actual",
      hits: [],
      routingReason: "",
      matchedSignals: ["road_condition"],
      verificationPlans: [],
      liveExecutions: []
    };

    const result = toUnifiedAnswer({ kind: "knowledge", answer: knowledge });
    expect(result.intent).toBe("knowledge");
    if (result.intent !== "knowledge") throw new Error("Expected knowledge answer");
    expect(result.status).toBe("unsupported");
    expect(result.route).toBe("live_verification");
    expect(result.knowledgeStatus).toBe("live_verification_required");
    expect(result.matchedSignals).toContain("road_condition");
  });
});

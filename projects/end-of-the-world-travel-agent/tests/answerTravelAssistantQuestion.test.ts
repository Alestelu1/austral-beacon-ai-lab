import { describe, expect, it } from "vitest";
import corpus from "../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import { answerTravelAssistantQuestion } from "../src/application/answerTravelAssistantQuestion.js";
import { GoldenCorpusRetriever, type GoldenCorpus } from "../src/retrieval/GoldenCorpusRetriever.js";
import { RoutedRetrievalService } from "../src/retrieval/RoutedRetrievalService.js";

const knowledgeService = new RoutedRetrievalService(
  new GoldenCorpusRetriever(corpus as GoldenCorpus)
);

describe("answerTravelAssistantQuestion", () => {
  it("preserves existing deterministic destination answers", async () => {
    const result = await answerTravelAssistantQuestion("¿Qué es Puerto Williams?", knowledgeService);

    expect(result.kind).toBe("deterministic_travel");
    if (result.kind !== "deterministic_travel") throw new Error("Expected deterministic travel answer");
    expect(result.answer.status).toBe("supported");
    expect(result.answer.intent).toBe("destination-info");
  });

  it("falls through to audited knowledge retrieval for stable unsupported questions", async () => {
    const result = await answerTravelAssistantQuestion(
      "¿Qué ruta conecta Puerto Williams con Puerto Navarino?",
      knowledgeService
    );

    expect(result.kind).toBe("knowledge");
    if (result.kind !== "knowledge") throw new Error("Expected knowledge answer");
    expect(result.answer.status).toBe("retrieved");
    expect(result.answer.route).toBe("stable_rag");
    expect(result.answer.hits.some((hit) => hit.chunk.chunk_id === "pw-y905-005")).toBe(true);
  });

  it("routes current road-state questions to live verification without corpus hits", async () => {
    const result = await answerTravelAssistantQuestion(
      "¿Está abierta la Ruta Y-905 hoy?",
      knowledgeService
    );

    expect(result.kind).toBe("knowledge");
    if (result.kind !== "knowledge") throw new Error("Expected knowledge answer");
    expect(result.answer.status).toBe("live_verification_required");
    expect(result.answer.route).toBe("live_verification");
    expect(result.answer.hits).toEqual([]);
  });

  it("does not invent evidence for stable questions outside the corpus", async () => {
    const result = await answerTravelAssistantQuestion(
      "¿Cuál es la historia del edificio municipal de Puerto Williams?",
      knowledgeService
    );

    expect(result.kind).toBe("knowledge");
    if (result.kind !== "knowledge") throw new Error("Expected knowledge answer");
    expect(["no_evidence", "retrieved"]).toContain(result.answer.status);
    if (result.answer.status === "retrieved") {
      expect(result.answer.hits.every((hit) => hit.score > 0)).toBe(true);
    }
  });
});

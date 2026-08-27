import { describe, expect, it } from "vitest";
import type { EmbeddingProvider, EmbeddingVector } from "../src/retrieval/EmbeddingProvider.js";
import { createSemanticTravelAssistant } from "../src/application/createSemanticTravelAssistant.js";

class KeywordEmbeddingProvider implements EmbeddingProvider {
  readonly id = "test:keyword";

  private vector(text: string): EmbeddingVector {
    const normalized = text.toLowerCase();
    return [
      normalized.includes("y-905") || normalized.includes("puerto navarino") ? 1 : 0,
      normalized.includes("hoy") || normalized.includes("today") ? 1 : 0,
      normalized.includes("puerto williams") ? 1 : 0
    ];
  }

  async embedQuery(text: string): Promise<EmbeddingVector> {
    return this.vector(text);
  }

  async embedDocuments(texts: string[]): Promise<EmbeddingVector[]> {
    return texts.map((text) => this.vector(text));
  }
}

describe("createSemanticTravelAssistant", () => {
  it("creates a routed semantic assistant over embedding-ready chunks", async () => {
    const assistant = await createSemanticTravelAssistant(new KeywordEmbeddingProvider());

    expect(assistant.providerId).toBe("test:keyword");
    expect(assistant.indexedChunkCount).toBe(12);
  });

  it("retrieves stable knowledge through the semantic path", async () => {
    const assistant = await createSemanticTravelAssistant(new KeywordEmbeddingProvider());
    const result = await assistant.answer("¿Qué carretera conecta Puerto Williams con Puerto Navarino?");

    expect(result.kind).toBe("knowledge");
    if (result.kind !== "knowledge") throw new Error("Expected knowledge answer");
    expect(result.answer.status).toBe("retrieved");
    expect(result.answer.route).toBe("stable_rag");
    expect(result.answer.hits.length).toBeGreaterThan(0);
  });

  it("blocks live operational questions before embedding retrieval", async () => {
    const assistant = await createSemanticTravelAssistant(new KeywordEmbeddingProvider());
    const result = await assistant.answer("¿Está abierta la Ruta Y-905 hoy?");

    expect(result.kind).toBe("knowledge");
    if (result.kind !== "knowledge") throw new Error("Expected knowledge answer");
    expect(result.answer.status).toBe("live_verification_required");
    expect(result.answer.hits).toEqual([]);
  });
});

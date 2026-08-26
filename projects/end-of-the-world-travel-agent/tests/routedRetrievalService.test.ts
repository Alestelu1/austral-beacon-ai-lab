import { describe, expect, it } from "vitest";
import type { Retriever } from "../src/retrieval/Retriever.js";
import { RoutedRetrievalService } from "../src/retrieval/RoutedRetrievalService.js";

const stableRetriever: Retriever = {
  search: async (query: string) => [
    {
      chunk: {
        chunk_id: "stable-test-001",
        entity_id: "puerto_williams",
        class: "stable_semantic",
        embedding_ready: true,
        text: `Stable answer for ${query}`
      },
      score: 1
    }
  ]
};

describe("RoutedRetrievalService", () => {
  it("uses the stable retriever for stable knowledge questions", async () => {
    const service = new RoutedRetrievalService(stableRetriever);
    const result = await service.search("¿Dónde está Puerto Williams?");

    expect(result.routing.route).toBe("stable_rag");
    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].chunk.chunk_id).toBe("stable-test-001");
  });

  it("blocks vector retrieval for live operational questions", async () => {
    const service = new RoutedRetrievalService(stableRetriever);
    const result = await service.search("¿Está abierta la Ruta Y-905 hoy?");

    expect(result.routing.route).toBe("live_verification");
    expect(result.hits).toEqual([]);
  });

  it("routes current transport availability away from embeddings", async () => {
    const service = new RoutedRetrievalService(stableRetriever);
    const result = await service.search("¿Hay vuelos disponibles mañana desde Puerto Williams?");

    expect(result.routing.route).toBe("live_verification");
    expect(result.routing.matchedSignals.length).toBeGreaterThan(0);
    expect(result.hits).toEqual([]);
  });
});

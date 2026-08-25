import { describe, expect, it } from "vitest";
import goldenCorpus from "../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import type { EmbeddingProvider } from "../src/retrieval/EmbeddingProvider.js";
import { SemanticRetriever } from "../src/retrieval/SemanticRetriever.js";

class KeywordEmbeddingProvider implements EmbeddingProvider {
  readonly id = "test-keyword-v1";
  private readonly terms = ["toro", "navarino", "antarctic", "yagan", "museum", "hospital"];

  async embedQuery(text: string): Promise<number[]> {
    return this.embed(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return texts.map((text) => this.embed(text));
  }

  private embed(text: string): number[] {
    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return this.terms.map((term) => normalized.includes(term) ? 1 : 0);
  }
}

describe("SemanticRetriever", () => {
  it("indexes only embedding-ready chunks", async () => {
    const retriever = await SemanticRetriever.create(goldenCorpus, new KeywordEmbeddingProvider());
    expect(retriever.indexedChunkCount).toBe(12);
  });

  it("retrieves the settlement distinction for Puerto Toro", async () => {
    const retriever = await SemanticRetriever.create(goldenCorpus, new KeywordEmbeddingProvider());
    const hits = await retriever.search("Is Puerto Toro the same place as Puerto Williams?", 3);
    expect(hits.map((hit) => hit.chunk.chunk_id)).toContain("pw-settlement-distinction-002");
  });

  it("never indexes dynamic schedule/service-state chunks", async () => {
    const retriever = await SemanticRetriever.create(goldenCorpus, new KeywordEmbeddingProvider());
    const hits = await retriever.search("current ferry schedule and fuel stock", 20);
    const ids = hits.map((hit) => hit.chunk.chunk_id);
    expect(ids).not.toContain("pw-dynamic-schedules-012");
    expect(ids).not.toContain("pw-dynamic-services-013");
  });

  it("labels semantic hits with provider metadata", async () => {
    const retriever = await SemanticRetriever.create(goldenCorpus, new KeywordEmbeddingProvider());
    const [hit] = await retriever.search("Yagan community", 1);
    expect(hit?.metadata).toMatchObject({
      retrieval_mode: "semantic",
      embedding_provider: "test-keyword-v1"
    });
  });
});

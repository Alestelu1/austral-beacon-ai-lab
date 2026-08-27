import { describe, expect, it } from "vitest";
import type { Retriever, RetrievalHit } from "../src/retrieval/Retriever.js";

class StubRetriever implements Retriever {
  search(query: string, topK = 3): RetrievalHit[] {
    if (!query.trim() || topK <= 0) return [];
    return [
      {
        chunk: {
          chunk_id: "stub-001",
          entity_id: "stub",
          class: "stable_semantic",
          embedding_ready: true,
          text: "stub"
        },
        score: 1,
        metadata: { provider: "stub" }
      }
    ].slice(0, topK);
  }
}

class AsyncStubRetriever implements Retriever {
  async search(query: string, topK = 3): Promise<RetrievalHit[]> {
    if (!query.trim() || topK <= 0) return [];
    return [
      {
        chunk: {
          chunk_id: "async-stub-001",
          entity_id: "stub",
          class: "stable_semantic",
          embedding_ready: true,
          text: "async stub"
        },
        score: 0.9,
        metadata: { provider: "async-stub" }
      }
    ].slice(0, topK);
  }
}

describe("Retriever contract", () => {
  it("allows synchronous retriever implementations", async () => {
    const retriever: Retriever = new StubRetriever();
    const hits = await retriever.search("Puerto Williams", 1);

    expect(hits).toHaveLength(1);
    expect(hits[0]?.chunk.chunk_id).toBe("stub-001");
    expect(hits[0]?.score).toBeGreaterThan(0);
  });

  it("allows asynchronous retriever implementations", async () => {
    const retriever: Retriever = new AsyncStubRetriever();
    const hits = await retriever.search("Puerto Williams", 1);

    expect(hits).toHaveLength(1);
    expect(hits[0]?.chunk.chunk_id).toBe("async-stub-001");
  });

  it("returns no results for zero topK", async () => {
    const retriever: Retriever = new StubRetriever();
    expect(await retriever.search("Puerto Williams", 0)).toEqual([]);
  });
});

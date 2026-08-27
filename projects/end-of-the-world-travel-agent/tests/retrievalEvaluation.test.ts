import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GoldenCorpusRetriever, type GoldenCorpus } from "../src/retrieval/GoldenCorpusRetriever.js";
import { evaluateRetriever, type RetrievalEvalSet } from "../src/retrieval/evaluateRetriever.js";

async function loadJson<T>(relativeFromRepoRoot: string): Promise<T> {
  const filePath = path.resolve(process.cwd(), "../..", relativeFromRepoRoot);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

describe("Puerto Williams retrieval evaluation baseline", () => {
  it("measures Recall@1, Recall@3 and MRR against the audited eval set", async () => {
    const corpus = await loadJson<GoldenCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");
    const evalSet = await loadJson<RetrievalEvalSet>("data/retrieval/retrieval-eval-puerto-williams-v1.json");
    const retriever = new GoldenCorpusRetriever(corpus);

    const result = await evaluateRetriever(retriever, evalSet, 3);

    expect(result.total_cases).toBe(evalSet.cases.length);
    expect(result.recall_at_1).toBeGreaterThanOrEqual(0.5);
    expect(result.recall_at_3).toBeGreaterThanOrEqual(0.8);
    expect(result.mrr).toBeGreaterThanOrEqual(0.65);
  });

  it("never retrieves chunks explicitly excluded from embeddings", async () => {
    const corpus = await loadJson<GoldenCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");
    const evalSet = await loadJson<RetrievalEvalSet>("data/retrieval/retrieval-eval-puerto-williams-v1.json");
    const retriever = new GoldenCorpusRetriever(corpus);
    const result = await evaluateRetriever(retriever, evalSet, 3);

    const retrievedIds = new Set(result.cases.flatMap((testCase) => testCase.retrieved_chunk_ids));
    const excludedIds = corpus.chunks.filter((chunk) => !chunk.embedding_ready).map((chunk) => chunk.chunk_id);

    for (const excludedId of excludedIds) {
      expect(retrievedIds.has(excludedId)).toBe(false);
    }
  });
});

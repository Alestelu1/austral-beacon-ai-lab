import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { GoldenCorpus } from "../src/retrieval/GoldenCorpusRetriever.js";
import type { RetrievalEvalSet } from "../src/retrieval/evaluateRetriever.js";

async function loadJson<T>(relativeFromRepoRoot: string): Promise<T> {
  const filePath = path.resolve(process.cwd(), "../..", relativeFromRepoRoot);
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

describe("Puerto Williams retrieval benchmark v2", () => {
  it("references only embedding-ready chunks from the audited corpus", async () => {
    const corpus = await loadJson<GoldenCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");
    const evalSet = await loadJson<RetrievalEvalSet>("data/retrieval/retrieval-eval-puerto-williams-v2.json");
    const readyIds = new Set(corpus.chunks.filter((chunk) => chunk.embedding_ready).map((chunk) => chunk.chunk_id));

    expect(evalSet.cases).toHaveLength(39);
    for (const testCase of evalSet.cases) {
      expect(testCase.expected_chunk_ids.length).toBeGreaterThan(0);
      for (const expectedId of testCase.expected_chunk_ids) {
        expect(readyIds.has(expectedId), `${testCase.id} expects non-ready chunk ${expectedId}`).toBe(true);
      }
    }
  });

  it("covers every embedding-ready chunk with multiple query formulations", async () => {
    const corpus = await loadJson<GoldenCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");
    const evalSet = await loadJson<RetrievalEvalSet>("data/retrieval/retrieval-eval-puerto-williams-v2.json");
    const counts = new Map<string, number>();

    for (const testCase of evalSet.cases) {
      for (const expectedId of testCase.expected_chunk_ids) {
        counts.set(expectedId, (counts.get(expectedId) ?? 0) + 1);
      }
    }

    for (const chunk of corpus.chunks.filter((item) => item.embedding_ready)) {
      expect(counts.get(chunk.chunk_id) ?? 0).toBeGreaterThanOrEqual(3);
    }
  });
});

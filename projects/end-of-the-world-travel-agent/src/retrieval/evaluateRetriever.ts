import type { Retriever } from "./Retriever.js";

export type RetrievalEvalCase = {
  id: string;
  query: string;
  expected_chunk_ids: string[];
};

export type RetrievalEvalSet = {
  eval_id: string;
  corpus_id: string;
  cases: RetrievalEvalCase[];
};

export type RetrievalEvalResult = {
  eval_id: string;
  total_cases: number;
  recall_at_1: number;
  recall_at_3: number;
  mrr: number;
  cases: Array<{
    id: string;
    query: string;
    expected_chunk_ids: string[];
    retrieved_chunk_ids: string[];
    first_relevant_rank: number | null;
  }>;
};

function hitAtK(retrieved: string[], expected: Set<string>, k: number): number {
  return retrieved.slice(0, k).some((id) => expected.has(id)) ? 1 : 0;
}

export async function evaluateRetriever(
  retriever: Pick<Retriever, "search">,
  evalSet: RetrievalEvalSet,
  topK = 3
): Promise<RetrievalEvalResult> {
  const cases = await Promise.all(evalSet.cases.map(async (testCase) => {
    const hits = await retriever.search(testCase.query, topK);
    const retrievedChunkIds = hits.map((hit) => hit.chunk.chunk_id);
    const expected = new Set(testCase.expected_chunk_ids);
    const firstRelevantIndex = retrievedChunkIds.findIndex((id) => expected.has(id));

    return {
      id: testCase.id,
      query: testCase.query,
      expected_chunk_ids: testCase.expected_chunk_ids,
      retrieved_chunk_ids: retrievedChunkIds,
      first_relevant_rank: firstRelevantIndex >= 0 ? firstRelevantIndex + 1 : null
    };
  }));

  const total = cases.length;
  const recallAt1 = total === 0 ? 0 : cases.reduce((sum, testCase) => {
    return sum + hitAtK(testCase.retrieved_chunk_ids, new Set(testCase.expected_chunk_ids), 1);
  }, 0) / total;

  const recallAt3 = total === 0 ? 0 : cases.reduce((sum, testCase) => {
    return sum + hitAtK(testCase.retrieved_chunk_ids, new Set(testCase.expected_chunk_ids), 3);
  }, 0) / total;

  const mrr = total === 0 ? 0 : cases.reduce((sum, testCase) => {
    return sum + (testCase.first_relevant_rank ? 1 / testCase.first_relevant_rank : 0);
  }, 0) / total;

  return {
    eval_id: evalSet.eval_id,
    total_cases: total,
    recall_at_1: recallAt1,
    recall_at_3: recallAt3,
    mrr,
    cases
  };
}

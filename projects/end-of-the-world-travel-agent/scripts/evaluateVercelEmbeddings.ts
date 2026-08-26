import { readFile } from "node:fs/promises";
import path from "node:path";
import { SemanticRetriever } from "../src/retrieval/SemanticRetriever.js";
import { VercelGatewayEmbeddingProvider } from "../src/retrieval/VercelGatewayEmbeddingProvider.js";
import { evaluateRetriever, type RetrievalEvalSet } from "../src/retrieval/evaluateRetriever.js";
import type { SemanticCorpus } from "../src/retrieval/SemanticRetriever.js";

async function loadJson<T>(relativeFromRepoRoot: string): Promise<T> {
  const filePath = path.resolve(process.cwd(), "../..", relativeFromRepoRoot);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function main(): Promise<void> {
  const corpus = await loadJson<SemanticCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");
  const evalSet = await loadJson<RetrievalEvalSet>("data/retrieval/retrieval-eval-puerto-williams-v1.json");

  const provider = new VercelGatewayEmbeddingProvider({
    model: process.env.AI_GATEWAY_EMBEDDING_MODEL ?? "google/gemini-embedding-2"
  });

  console.log(`Embedding provider: ${provider.id}`);
  console.log(`Embedding-ready chunks: ${corpus.chunks.filter((chunk) => chunk.embedding_ready).length}`);

  const retriever = await SemanticRetriever.create(corpus, provider);
  const result = await evaluateRetriever(retriever, evalSet, 3);

  console.log("\nPuerto Williams semantic retrieval benchmark");
  console.log(`Cases:      ${result.total_cases}`);
  console.log(`Recall@1:   ${result.recall_at_1.toFixed(3)}`);
  console.log(`Recall@3:   ${result.recall_at_3.toFixed(3)}`);
  console.log(`MRR:        ${result.mrr.toFixed(3)}`);

  console.log("\nPer-case results:");
  for (const testCase of result.cases) {
    console.log(`- ${testCase.id}`);
    console.log(`  query: ${testCase.query}`);
    console.log(`  expected: ${testCase.expected_chunk_ids.join(", ")}`);
    console.log(`  retrieved: ${testCase.retrieved_chunk_ids.join(", ") || "<none>"}`);
    console.log(`  first relevant rank: ${testCase.first_relevant_rank ?? "not found"}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Semantic benchmark failed: ${message}`);
  process.exitCode = 1;
});

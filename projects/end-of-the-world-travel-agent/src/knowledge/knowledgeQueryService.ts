import { createKnowledgeRepository } from "./knowledgeRepository.js";
import { resolveConnectivityQuery } from "./connectivityQuery.js";
import type { ConnectivityResult, KnowledgeRepository } from "./knowledgeTypes.js";

// Internal opt-in service. No registration in CLI, API, UI, retriever or provider code.
export function createKnowledgeQueryService(repository: KnowledgeRepository = createKnowledgeRepository()) {
  return {
    answerConnectivityQuestion(query: unknown): ConnectivityResult {
      if (typeof query !== "string" || !query.trim() || query.length > 2000) {
        return { answerType: "unsupported", mode: "experimental/deterministic/no-live/no-LLM", reason: "unsupported_query" };
      }
      try {
        return resolveConnectivityQuery(query, repository.load());
      } catch (error) {
        // Never expose filesystem paths, parser details or untrusted content in an answer.
        const reason = error instanceof Error && error.message === "Unsupported query intent"
          ? "unsupported_query" : "knowledge_unavailable";
        return { answerType: "unsupported", mode: "experimental/deterministic/no-live/no-LLM", reason };
      }
    }
  };
}

export function answerConnectivityQuestion(query: unknown): ConnectivityResult {
  return createKnowledgeQueryService().answerConnectivityQuestion(query);
}

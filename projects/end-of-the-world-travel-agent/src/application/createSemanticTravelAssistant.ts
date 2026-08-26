import corpus from "../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import { GeminiEmbeddingProvider } from "../retrieval/GeminiEmbeddingProvider.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";
import { SemanticRetriever, type SemanticCorpus } from "../retrieval/SemanticRetriever.js";
import type { EmbeddingProvider } from "../retrieval/EmbeddingProvider.js";
import { answerTravelAssistantQuestion, type TravelAssistantAnswer } from "./answerTravelAssistantQuestion.js";

export type SemanticTravelAssistant = {
  answer(question: string, topK?: number): Promise<TravelAssistantAnswer>;
  providerId: string;
  indexedChunkCount: number;
};

/**
 * Creates the production-shaped Travel Assistant knowledge path from the
 * audited Puerto Williams golden corpus and an injected embedding provider.
 * Provider injection keeps the application testable and avoids coupling the
 * orchestration layer directly to a vendor.
 */
export async function createSemanticTravelAssistant(
  provider: EmbeddingProvider,
  semanticCorpus: SemanticCorpus = corpus as SemanticCorpus
): Promise<SemanticTravelAssistant> {
  const semanticRetriever = await SemanticRetriever.create(semanticCorpus, provider);
  const routedRetrieval = new RoutedRetrievalService(semanticRetriever);

  return {
    providerId: provider.id,
    indexedChunkCount: semanticRetriever.indexedChunkCount,
    answer(question: string, topK = 3) {
      return answerTravelAssistantQuestion(question, routedRetrieval, topK);
    }
  };
}

export async function createGeminiTravelAssistantFromEnv(): Promise<SemanticTravelAssistant> {
  const provider = new GeminiEmbeddingProvider();
  return createSemanticTravelAssistant(provider);
}

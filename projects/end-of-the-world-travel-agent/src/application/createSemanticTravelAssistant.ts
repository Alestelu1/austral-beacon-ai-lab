import corpus from "../../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import { GeminiEmbeddingProvider } from "../retrieval/GeminiEmbeddingProvider.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";
import { SemanticRetriever, type SemanticCorpus } from "../retrieval/SemanticRetriever.js";
import type { EmbeddingProvider } from "../retrieval/EmbeddingProvider.js";
import { DefaultLiveVerificationExecutor, type LiveVerificationExecutor } from "../live/LiveVerificationExecutor.js";
import { answerTravelAssistantQuestion, type TravelAssistantAnswer } from "./answerTravelAssistantQuestion.js";

export type SemanticTravelAssistant = {
  answer(question: string, topK?: number): Promise<TravelAssistantAnswer>;
  providerId: string;
  indexedChunkCount: number;
  liveVerificationEnabled: boolean;
};

export type CreateSemanticTravelAssistantOptions = {
  liveVerifier?: LiveVerificationExecutor;
};

/**
 * Creates the production-shaped Travel Assistant knowledge path from the
 * audited Puerto Williams golden corpus and an injected embedding provider.
 * Provider and live-verifier injection keep the application testable and avoid
 * coupling orchestration directly to a vendor or network implementation.
 */
export async function createSemanticTravelAssistant(
  provider: EmbeddingProvider,
  semanticCorpus: SemanticCorpus = corpus as SemanticCorpus,
  options: CreateSemanticTravelAssistantOptions = {}
): Promise<SemanticTravelAssistant> {
  const semanticRetriever = await SemanticRetriever.create(semanticCorpus, provider);
  const routedRetrieval = new RoutedRetrievalService(semanticRetriever);
  const liveVerifier = options.liveVerifier;

  return {
    providerId: provider.id,
    indexedChunkCount: semanticRetriever.indexedChunkCount,
    liveVerificationEnabled: Boolean(liveVerifier),
    answer(question: string, topK = 3) {
      return answerTravelAssistantQuestion(question, routedRetrieval, topK, liveVerifier);
    }
  };
}

export async function createGeminiTravelAssistantFromEnv(): Promise<SemanticTravelAssistant> {
  const provider = new GeminiEmbeddingProvider();
  const liveVerifier = new DefaultLiveVerificationExecutor();
  return createSemanticTravelAssistant(provider, corpus as SemanticCorpus, { liveVerifier });
}

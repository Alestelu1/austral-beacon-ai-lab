import type { DestinationCardAnswer, TravelAnswer } from "../domain/types.js";
import { answerTravelQuestion } from "./answerTravelQuestion.js";
import { answerKnowledgeQuestion, type KnowledgeAnswer } from "./answerKnowledgeQuestion.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";

export type TravelAssistantAnswer =
  | {
      kind: "deterministic_travel";
      answer: TravelAnswer | DestinationCardAnswer;
    }
  | {
      kind: "knowledge";
      answer: KnowledgeAnswer;
    };

/**
 * Application-level orchestration for the Travel Assistant.
 *
 * Existing deterministic travel and destination-card answers keep priority so
 * current product behaviour is not broken. Questions that the deterministic
 * layer cannot support are delegated to the routed knowledge layer, which can
 * either retrieve audited stable knowledge or explicitly require live
 * verification for dynamic operational questions.
 */
export async function answerTravelAssistantQuestion(
  question: string,
  knowledgeService: RoutedRetrievalService,
  topK = 3
): Promise<TravelAssistantAnswer> {
  const deterministic = answerTravelQuestion(question);

  if (deterministic.status === "supported") {
    return {
      kind: "deterministic_travel",
      answer: deterministic
    };
  }

  const knowledge = await answerKnowledgeQuestion(question, knowledgeService, topK);
  return {
    kind: "knowledge",
    answer: knowledge
  };
}

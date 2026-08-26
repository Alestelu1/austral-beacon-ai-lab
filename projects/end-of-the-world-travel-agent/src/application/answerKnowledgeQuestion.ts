import type { RetrievalHit } from "../retrieval/Retriever.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";

export type KnowledgeAnswerRoute = "stable_rag" | "live_verification";

export type KnowledgeAnswer = {
  status: "retrieved" | "live_verification_required" | "no_evidence";
  route: KnowledgeAnswerRoute;
  summary: string;
  hits: RetrievalHit[];
  routingReason: string;
  matchedSignals: string[];
};

export async function answerKnowledgeQuestion(
  question: string,
  retrievalService: RoutedRetrievalService,
  topK = 3
): Promise<KnowledgeAnswer> {
  const result = await retrievalService.search(question, topK);

  if (result.routing.route === "live_verification") {
    return {
      status: "live_verification_required",
      route: "live_verification",
      summary: "Esta consulta requiere verificación actual antes de responder; no se usó el corpus embebido como fuente operativa.",
      hits: [],
      routingReason: result.routing.reason,
      matchedSignals: result.routing.matchedSignals
    };
  }

  if (result.hits.length === 0) {
    return {
      status: "no_evidence",
      route: "stable_rag",
      summary: "El corpus estable no contiene evidencia suficiente para responder esta consulta.",
      hits: [],
      routingReason: result.routing.reason,
      matchedSignals: result.routing.matchedSignals
    };
  }

  return {
    status: "retrieved",
    route: "stable_rag",
    summary: "Se recuperó evidencia estable del corpus auditado. La generación de una respuesta final debe conservar el alcance y las salvaguardas de los chunks recuperados.",
    hits: result.hits,
    routingReason: result.routing.reason,
    matchedSignals: result.routing.matchedSignals
  };
}

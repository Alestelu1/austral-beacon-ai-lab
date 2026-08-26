import type { RetrievalHit } from "../retrieval/Retriever.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";
import { planLiveVerification, type LiveVerificationPlan } from "../live/LiveVerificationSourceRegistry.js";
import type { LiveVerificationExecution, LiveVerificationExecutor } from "../live/LiveVerificationExecutor.js";

export type KnowledgeAnswerRoute = "stable_rag" | "live_verification";

export type KnowledgeAnswer = {
  status:
    | "retrieved"
    | "live_verification_required"
    | "live_verified"
    | "live_not_verified"
    | "no_evidence";
  route: KnowledgeAnswerRoute;
  summary: string;
  hits: RetrievalHit[];
  routingReason: string;
  matchedSignals: string[];
  verificationPlans: LiveVerificationPlan[];
  liveExecutions: LiveVerificationExecution[];
};

export async function answerKnowledgeQuestion(
  question: string,
  retrievalService: RoutedRetrievalService,
  topK = 3,
  liveVerifier?: LiveVerificationExecutor
): Promise<KnowledgeAnswer> {
  const result = await retrievalService.search(question, topK);

  if (result.routing.route === "live_verification") {
    const verificationPlans = planLiveVerification(result.routing.matchedSignals);

    if (!liveVerifier) {
      return {
        status: "live_verification_required",
        route: "live_verification",
        summary: "Esta consulta requiere verificación actual antes de responder; no se usó el corpus embebido como fuente operativa.",
        hits: [],
        routingReason: result.routing.reason,
        matchedSignals: result.routing.matchedSignals,
        verificationPlans,
        liveExecutions: []
      };
    }

    const liveExecutions = await liveVerifier.execute(result.routing.matchedSignals);
    const verified = liveExecutions.find((execution) => execution.status === "verified");

    if (verified) {
      return {
        status: "live_verified",
        route: "live_verification",
        summary: verified.summary,
        hits: [],
        routingReason: result.routing.reason,
        matchedSignals: result.routing.matchedSignals,
        verificationPlans,
        liveExecutions
      };
    }

    return {
      status: "live_not_verified",
      route: "live_verification",
      summary: "No se encontró evidencia oficial suficientemente reciente y explícita para confirmar el estado operativo solicitado.",
      hits: [],
      routingReason: result.routing.reason,
      matchedSignals: result.routing.matchedSignals,
      verificationPlans,
      liveExecutions
    };
  }

  if (result.hits.length === 0) {
    return {
      status: "no_evidence",
      route: "stable_rag",
      summary: "El corpus estable no contiene evidencia suficiente para responder esta consulta.",
      hits: [],
      routingReason: result.routing.reason,
      matchedSignals: result.routing.matchedSignals,
      verificationPlans: [],
      liveExecutions: []
    };
  }

  return {
    status: "retrieved",
    route: "stable_rag",
    summary: "Se recuperó evidencia estable del corpus auditado. La generación de una respuesta final debe conservar el alcance y las salvaguardas de los chunks recuperados.",
    hits: result.hits,
    routingReason: result.routing.reason,
    matchedSignals: result.routing.matchedSignals,
    verificationPlans: [],
    liveExecutions: []
  };
}

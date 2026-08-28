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
        summary: "Esta consulta depende de información que cambia día a día (horarios, salidas, disponibilidad o estado actual), por lo que debe confirmarse con la fuente oficial correspondiente antes de viajar. No entregamos este dato desde información almacenada, para no dar una respuesta desactualizada.",
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
      summary: "No pudimos confirmar el estado actual con una fuente oficial reciente, así que no afirmamos que esté disponible ni operativo en este momento. Se trata de información que cambia con frecuencia y debe verificarse directamente con la fuente oficial correspondiente antes de viajar.",
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
      summary: "Todavía no tenemos información verificada para responder esta consulta. Preferimos indicarlo antes que ofrecer una respuesta sin respaldo.",
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
    summary: "Encontramos información verificada relacionada con tu consulta. Los datos que cambian con frecuencia (horarios, tarifas o disponibilidad) deben confirmarse siempre con la fuente oficial correspondiente antes de viajar.",
    hits: result.hits,
    routingReason: result.routing.reason,
    matchedSignals: result.routing.matchedSignals,
    verificationPlans: [],
    liveExecutions: []
  };
}

import type { UnifiedTravelAnswer } from "../projects/end-of-the-world-travel-agent/src/application/answerViaAssistant.js";

/**
 * Narrow, audited English preview for Build 13.
 * This is NOT a generic translator. Preserve verified sources and never
 * invent current services. Unsupported intents are not presented as translated.
 */
export type PreviewLocale = "es" | "en";
type Answer = UnifiedTravelAnswer;

const pwSummary =
  "Puerto Williams is located on Navarino Island, in the commune of Cabo de Hornos, Magallanes and Chilean Antarctica Region, Chile. In 2019, Chile's National Statistics Institute classified Puerto Williams as a city under its updated geographical criteria. In 2021, Puerto Williams received the Best Tourism Villages recognition from the World Tourism Organization.";
const routeSummary =
  "To travel from Punta Arenas to Puerto Williams, two published options are available to check: flights listed by Aerovías DAP and maritime services listed by TABSA. Before planning your trip, confirm operating days, schedules, fares and availability directly with each operator.";
const routeWarning =
  "Services may change due to operational and weather conditions. Confirm current information before buying tickets or travelling.";

export function localizePreviewAnswer(answer: Answer, locale: PreviewLocale): Answer {
  if (locale === "es") return answer;
  if (answer.status === "supported" && answer.intent === "destination-info" && "card" in answer && answer.card?.id === "puerto-williams") {
    return {
      ...answer,
      summary: pwSummary,
      // The underlying canonical card stays in the original source language and
      // is not exposed as a translated card to API clients.
      card: undefined,
      warnings: [
        "Current transport schedules, fares and availability require confirmation with official sources or operators.",
        "Exact coordinates are not published until an authoritative location is verified.",
        "Visits involving living Indigenous communities cannot be inferred from geographical proximity."
      ],
    };
  }
  if (answer.status === "supported" && answer.intent === "connectivity" &&
      answer.sources.some(s => s.publisher === "Aerovías DAP") &&
      answer.sources.some(s => s.publisher.includes("TABSA"))) {
    return {
      ...answer,
      summary: routeSummary,
      warnings: [routeWarning],
      stages: answer.stages.map(stage => ({
        ...stage,
        note: "Check current flight and maritime services with DAP and TABSA. No real-time schedules, journey times, prices or seats are confirmed."
      }))
    };
  }
  // Fallback stays explicit, rather than serving Spanish content marked as English.
  return {
    status: "unsupported",
    intent: "unknown",
    summary: "This question is not yet covered by the English preview. Try asking about Puerto Williams or travelling from Punta Arenas to Puerto Williams. No live schedules, prices or availability are confirmed.",
    stages: [],
    warnings: [],
    sources: [],
  };
}

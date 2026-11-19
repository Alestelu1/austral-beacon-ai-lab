import type { WebAnswer, TravelAnswer, DestinationCardAnswer, ExtendedAnswer } from "./types.js";
import { renderConnectivity } from "./renderConnectivity.js";
import { renderDestination } from "./renderDestination.js";
import { renderUnsupported } from "./renderUnsupported.js";
import { renderExtended } from "./renderExtended.js";

/** Render every public UnifiedTravelAnswer intent; never discard a supported answer. */
export function renderAnswer(answer: WebAnswer): string {
  const extended = answer.intent === "relationship" ||
    answer.intent === "antarctic-access" ||
    answer.intent === "strait-info" ||
    answer.intent === "knowledge";

  // Extended answers carry useful uncertainty and verification warnings even when unsupported.
  if (extended) return renderExtended(answer as ExtendedAnswer);

  if (answer.status === "unsupported") {
    return renderUnsupported(answer as TravelAnswer | DestinationCardAnswer);
  }
  if (answer.intent === "connectivity") return renderConnectivity(answer as TravelAnswer);
  if (answer.intent === "destination-info") return renderDestination(answer as DestinationCardAnswer);
  return renderUnsupported({ ...answer, status: "unsupported" } as TravelAnswer);
}

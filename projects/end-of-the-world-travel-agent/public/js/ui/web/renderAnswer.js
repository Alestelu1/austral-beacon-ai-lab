import { renderConnectivity } from "./renderConnectivity.js";
import { renderDestination } from "./renderDestination.js";
import { renderUnsupported } from "./renderUnsupported.js";
/**
 * Dispatcher that routes an answer to the appropriate renderer
 * based on its status and intent.
 *
 * - status "unsupported" → renderUnsupported
 * - intent "connectivity" + status "supported" → renderConnectivity
 * - intent "destination-info" + status "supported" → renderDestination
 *
 * Pure function — no DOM access, no side effects.
 */
export function renderAnswer(answer) {
    if (answer.status === "unsupported") {
        return renderUnsupported(answer);
    }
    if (answer.intent === "connectivity") {
        return renderConnectivity(answer);
    }
    if (answer.intent === "destination-info") {
        return renderDestination(answer);
    }
    return renderUnsupported(answer);
}

import type { TravelAnswer, DestinationCardAnswer } from "./types.js";

/**
 * Escapes special HTML characters to prevent injection.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Renders an unsupported answer as a semantic HTML string.
 *
 * Accepts answers with status "unsupported".
 * Shows "destino no disponible" for intent "destination-info",
 * "consulta no reconocida" for intent "unknown".
 * Does not invent suggestions or alternative data.
 *
 * Pure function — no DOM access, no side effects.
 */
export function renderUnsupported(
  answer: TravelAnswer | DestinationCardAnswer
): string {
  if (answer.status !== "unsupported") {
    throw new Error(
      `renderUnsupported requires status "unsupported", ` +
        `but received status "${escapeHtml(answer.status)}".`
    );
  }

  let message: string;

  if (answer.intent === "destination-info") {
    message = "El destino consultado no está disponible en este momento.";
  } else if (answer.intent === "unknown") {
    message = "La consulta no fue reconocida. Intenta reformular tu pregunta.";
  } else {
    message = "No se pudo procesar la consulta.";
  }

  return (
    `<article class="answer-unsupported">` +
    `<section>` +
    `<p>${escapeHtml(message)}</p>` +
    `</section>` +
    `</article>`
  );
}

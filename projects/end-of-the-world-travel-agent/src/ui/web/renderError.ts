/**
 * Information about an HTTP or network error for rendering.
 */
export interface HttpErrorInfo {
  type: "network" | "http";
  status?: number;
  message?: string;
}

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
 * Renders an error as a semantic HTML string.
 *
 * - type "network" → connection failure message
 * - type "http" + status 400 → shows API error message
 * - type "http" + status 500 → generic internal error message
 * - other → unexpected error
 *
 * Messages in Spanish. No stack traces or internal details.
 * Pure function — no DOM access, no side effects.
 */
export function renderError(error: HttpErrorInfo): string {
  let message: string;

  if (error.type === "network") {
    message =
      "No se pudo contactar al servidor. Verifica que esté en ejecución.";
  } else if (error.status === 400 && error.message) {
    message = escapeHtml(error.message);
  } else if (error.status === 500) {
    message = "Error interno del servidor. Intenta nuevamente.";
  } else {
    message = "Ocurrió un error inesperado.";
  }

  return (
    `<article class="answer-error">` +
    `<section>` +
    `<p>${message}</p>` +
    `</section>` +
    `</article>`
  );
}

import type { TravelAnswer } from "./types.js";

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
 * Returns true if the URL uses http: or https: protocol.
 * Returns false for invalid URLs or other protocols.
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Renders a URL as a clickable link if safe, or as escaped text otherwise.
 */
function renderUrl(url: string): string {
  if (isSafeUrl(url)) {
    return `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`;
  }
  return escapeHtml(url);
}

/**
 * Renders a connectivity TravelAnswer as a semantic HTML string.
 *
 * Accepts only answers with status "supported" and intent "connectivity".
 * Pure function — no DOM access, no side effects.
 */
export function renderConnectivity(answer: TravelAnswer): string {
  if (answer.status !== "supported" || answer.intent !== "connectivity") {
    throw new Error(
      `renderConnectivity requires status "supported" and intent "connectivity", ` +
        `but received status "${answer.status}" and intent "${answer.intent}".`
    );
  }
  const sections: string[] = [];

  // Resumen
  sections.push(
    `<section class="answer-connectivity__summary">` +
      `<h3>Resumen</h3>` +
      `<p>${escapeHtml(answer.summary)}</p>` +
      `</section>`
  );

  // Etapas
  if (answer.stages.length > 0) {
    const stageItems = answer.stages
      .map(
        (stage) =>
          `<li class="route-stage">` +
          `<dl>` +
          `<dt>Origen</dt><dd>${escapeHtml(stage.from)}</dd>` +
          `<dt>Destino</dt><dd>${escapeHtml(stage.to)}</dd>` +
          `<dt>Modo</dt><dd>${escapeHtml(stage.mode)}</dd>` +
          `<dt>Nota</dt><dd>${escapeHtml(stage.note)}</dd>` +
          `</dl>` +
          `</li>`
      )
      .join("");

    sections.push(
      `<section class="answer-connectivity__stages">` +
        `<h3>Etapas</h3>` +
        `<ol>${stageItems}</ol>` +
        `</section>`
    );
  }

  // Advertencias
  if (answer.warnings.length > 0) {
    const warningItems = answer.warnings
      .map((w) => `<li>${escapeHtml(w)}</li>`)
      .join("");

    sections.push(
      `<section class="answer-connectivity__warnings">` +
        `<h3>Advertencias</h3>` +
        `<ul>${warningItems}</ul>` +
        `</section>`
    );
  }

  // Fuentes
  if (answer.sources.length > 0) {
    const sourceItems = answer.sources
      .map(
        (src) =>
          `<li class="source-item">` +
          `<dl>` +
          `<dt>Título</dt><dd>${escapeHtml(src.title)}</dd>` +
          `<dt>Editor</dt><dd>${escapeHtml(src.publisher)}</dd>` +
          `<dt>URL</dt><dd>${renderUrl(src.url)}</dd>` +
          `<dt>Verificado</dt><dd>${escapeHtml(src.verifiedAt)}</dd>` +
          `</dl>` +
          `</li>`
      )
      .join("");

    sections.push(
      `<section class="answer-connectivity__sources">` +
        `<h3>Fuentes</h3>` +
        `<ul>${sourceItems}</ul>` +
        `</section>`
    );
  }

  // Fecha de verificación general
  if (answer.verifiedAt) {
    sections.push(
      `<section class="answer-connectivity__verified-at">` +
        `<p><strong>Verificado:</strong> ${escapeHtml(answer.verifiedAt)}</p>` +
        `</section>`
    );
  }

  return (
    `<article class="answer-connectivity">` +
    sections.join("") +
    `</article>`
  );
}

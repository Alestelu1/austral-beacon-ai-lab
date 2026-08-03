import type { DestinationCardAnswer } from "./types.js";

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
 * Maps confidence level to a human-readable Spanish label.
 */
function confidenceLabel(confidence: string): string {
  switch (confidence) {
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "none":
      return "Sin datos";
    default:
      return escapeHtml(confidence);
  }
}

/**
 * Renders a supported DestinationCardAnswer as a semantic HTML string.
 *
 * Accepts only answers with status "supported" and intent "destination-info".
 * Pure function — no DOM access, no side effects.
 */
export function renderDestination(answer: DestinationCardAnswer): string {
  if (answer.status !== "supported") {
    throw new Error(
      `renderDestination requires status "supported", ` +
        `but received status "${answer.status}".`
    );
  }

  const sections: string[] = [];

  // Nombre del destino
  const name = answer.card?.name ?? "";
  if (name) {
    sections.push(`<h3 class="answer-destination__name">${escapeHtml(name)}</h3>`);
  }

  // Resumen
  sections.push(
    `<section class="answer-destination__summary">` +
      `<h4>Resumen</h4>` +
      `<p>${escapeHtml(answer.summary)}</p>` +
      `</section>`
  );

  // Contexto geográfico
  const geoContext = answer.card?.stableData?.geographicContext ?? "";
  if (geoContext) {
    sections.push(
      `<section class="answer-destination__geographic">` +
        `<h4>Contexto geográfico</h4>` +
        `<p>${escapeHtml(geoContext)}</p>` +
        `</section>`
    );
  }

  // Contexto cultural
  const culturalContext = answer.card?.stableData?.culturalContext ?? "";
  if (culturalContext) {
    sections.push(
      `<section class="answer-destination__cultural">` +
        `<h4>Contexto cultural</h4>` +
        `<p>${escapeHtml(culturalContext)}</p>` +
        `</section>`
    );
  }

  // Advertencias
  if (answer.warnings.length > 0) {
    const warningItems = answer.warnings
      .map((w) => `<li>${escapeHtml(w)}</li>`)
      .join("");

    sections.push(
      `<section class="answer-destination__warnings">` +
        `<h4>Advertencias</h4>` +
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
      `<section class="answer-destination__sources">` +
        `<h4>Fuentes</h4>` +
        `<ul>${sourceItems}</ul>` +
        `</section>`
    );
  }

  // Enlaces internos sugeridos
  if (answer.suggestedInternalLinks.length > 0) {
    const linkItems = answer.suggestedInternalLinks
      .map(
        (link) =>
          `<li><a href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a></li>`
      )
      .join("");

    sections.push(
      `<section class="answer-destination__links">` +
        `<h4>Enlaces sugeridos</h4>` +
        `<ul>${linkItems}</ul>` +
        `</section>`
    );
  }

  // Confianza
  sections.push(
    `<section class="answer-destination__confidence">` +
      `<p><strong>Confianza:</strong> <span class="confidence-${escapeHtml(answer.confidence)}">${confidenceLabel(answer.confidence)}</span></p>` +
      `</section>`
  );

  // Fecha de verificación general
  if (answer.verifiedAt) {
    sections.push(
      `<section class="answer-destination__verified-at">` +
        `<p><strong>Verificado:</strong> ${escapeHtml(answer.verifiedAt)}</p>` +
        `</section>`
    );
  }

  return (
    `<article class="answer-destination">` +
    sections.join("") +
    `</article>`
  );
}

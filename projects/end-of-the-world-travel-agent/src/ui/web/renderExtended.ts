import type { ExtendedAnswer } from "./types.js";

/** Render the newer API intents without silently showing a supported response as unsupported. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function section(title: string, content: string): string {
  return content ? `<section><h4>${title}</h4>${content}</section>` : "";
}
function paragraph(text?: string): string {
  return text ? `<p>${escapeHtml(text)}</p>` : "";
}
function list(items: string[]): string {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
}
function safeExternalUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
function sources(answer: ExtendedAnswer): string {
  if (!("sources" in answer) || !answer.sources?.length) return "";
  return section("Fuentes", `<ul>${answer.sources.map((source) => {
    const address = safeExternalUrl(source.url)
      ? `<a href="${escapeHtml(source.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(source.title)}</a>`
      : escapeHtml(source.title);
    return `<li>${address} — ${escapeHtml(source.publisher)} (${escapeHtml(source.verifiedAt)})</li>`;
  }).join("")}</ul>`);
}
function links(answer: ExtendedAnswer): string {
  if (!("suggestedInternalLinks" in answer) || !answer.suggestedInternalLinks?.length) return "";
  const allowed = answer.suggestedInternalLinks.filter((link) =>
    link.path.startsWith("/") && !link.path.startsWith("//") && !/[\\\u0000-\u001f]/.test(link.path)
  );
  return section("Explorar", `<ul>${allowed.map((link) =>
    `<li><a href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a></li>`
  ).join("")}</ul>`);
}
export function renderExtended(answer: ExtendedAnswer): string {
  let details = "";
  switch (answer.intent) {
    case "relationship":
      details += section("Relación administrativa", paragraph(answer.administrativeRelation));
      details += section("Distinción geográfica", paragraph(answer.geographicDistinction));
      details += section("Lugares diferenciados", list(answer.distinctReferents.map((place) =>
        `${place.name} (${place.kind}): ${place.description}`)));
      break;
    case "antarctic-access":
      details += section("Vías de acceso", list(answer.pathways.map((pathway) =>
        `${pathway.title} — ${pathway.origin}: ${pathway.description} [${pathway.category}]`)));
      details += section("Puerto Williams", paragraph(answer.puertoWilliamsClarification));
      break;
    case "strait-info":
      details += section("Datos verificados", list(answer.facts.map((fact) => fact.text)));
      break;
    case "knowledge":
      details += section("Estado de verificación",
        paragraph(answer.route === "live_verification"
          ? "Consulta operativa: requiere verificar la información vigente."
          : "Información documental; confirmar cualquier condición cambiante."));
      break;
  }
  const warnings = section("Advertencias", list(answer.warnings ?? []));
  const date = "verifiedAt" in answer ? paragraph(answer.verifiedAt ? `Verificado: ${answer.verifiedAt}` : "") : "";
  return `<article class="answer-extended answer-extended--${answer.intent}">` +
    section("Resumen", paragraph(answer.summary)) + details + warnings +
    sources(answer) + links(answer) + date + "</article>";
}

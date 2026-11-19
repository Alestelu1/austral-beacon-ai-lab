import { describe, expect, it } from "vitest";
import { renderAnswer } from "../src/ui/web/renderAnswer.js";
import type { ExtendedAnswer } from "../src/ui/web/types.js";

const base = {
  status: "supported" as const,
  summary: "Información verificable sobre el extremo sur de Chile",
  warnings: ["Confirmar los servicios actuales antes de viajar"],
  sources: [{ title: "Fuente oficial", publisher: "Organismo público",
    url: "https://example.org/source", verifiedAt: "2026-11-01" }],
  suggestedInternalLinks: [{ path: "/es/puerto-williams", label: "Guía Puerto Williams" }],
  verifiedAt: "2026-11-01",
};

describe("extended API answer rendering", () => {
  it("renders a relationship rather than unsupported", () => {
    const answer: ExtendedAnswer = { ...base, intent: "relationship",
      administrativeRelation: "Comuna de Cabo de Hornos",
      geographicDistinction: "Ciudad y cabo son entidades distintas",
      distinctReferents: [{ kind: "city", name: "Puerto Williams", description: "Ciudad" }] };
    const html = renderAnswer(answer);
    expect(html).toContain("Puerto Williams");
    expect(html).toContain("Comuna de Cabo de Hornos");
    expect(html).toContain("Ciudad y cabo son entidades distintas");
    expect(html).not.toContain("No se pudo procesar la consulta.");
  });

  it("distinguishes Antarctic pathways and preserves warnings", () => {
    const answer: ExtendedAnswer = { ...base, intent: "antarctic-access",
      pathways: [{ category: "commercial-product", origin: "Punta Arenas",
        title: "Producto publicado", description: "No acredita cupos actuales", sourceIds: ["source-1"] }],
      puertoWilliamsClarification: "Puerto Williams no equivale a una salida comercial confirmada" };
    const html = renderAnswer(answer);
    expect(html).toContain("Producto publicado");
    expect(html).toContain("No acredita cupos actuales");
    expect(html).toContain("Puerto Williams no equivale");
    expect(html).toContain(base.warnings[0]);
  });

  it("renders projected Strait facts with source link", () => {
    const answer: ExtendedAnswer = { ...base, intent: "strait-info",
      facts: [{ text: "Hecho geográfico documentado", claimId: "c1", sourceIds: ["s1"] }] };
    const html = renderAnswer(answer);
    expect(html).toContain("Hecho geográfico documentado");
    expect(html).toContain('href="https://example.org/source"');
  });

  it("shows live verification uncertainty even if answer is unsupported", () => {
    const answer: ExtendedAnswer = { ...base, status: "unsupported", intent: "knowledge",
      route: "live_verification", knowledgeStatus: "live_not_verified", matchedSignals: ["schedule"] };
    const html = renderAnswer(answer);
    expect(html).toContain("requiere verificar");
    expect(html).toContain("Confirmar los servicios");
  });

  it("escapes injected HTML and does not allow unsafe source or internal links", () => {
    const answer: ExtendedAnswer = { ...base, intent: "relationship",
      summary: '<img src=x onerror=alert(1)>',
      administrativeRelation: "sin datos", geographicDistinction: "sin datos", distinctReferents: [],
      sources: [{ title: "No click", publisher: "P", url: "javascript:alert(1)", verifiedAt: "2026" }],
      suggestedInternalLinks: [{ path: "//evil.example", label: "Evil" }, { path: "/es/bien", label: "Bien" }] };
    const html = renderAnswer(answer);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('href="//evil.example"');
    expect(html).toContain('href="/es/bien"');
  });
});

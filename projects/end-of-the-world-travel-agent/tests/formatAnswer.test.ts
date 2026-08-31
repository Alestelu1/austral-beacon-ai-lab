import { describe, expect, it } from "vitest";
import { formatAnswer } from "../src/ui/formatAnswer.js";
import type { DestinationCardAnswer, StraitInfoAnswer, TravelAnswer } from "../src/domain/types.js";

describe("formatAnswer — connectivity supported", () => {
  const answer: TravelAnswer = {
    status: "supported",
    intent: "connectivity",
    summary: "La conexión habitual desde Santiago hacia Puerto Williams se organiza en dos etapas.",
    stages: [
      {
        from: "Santiago",
        to: "Punta Arenas",
        mode: "air",
        stability: "dynamic",
        note: "Los horarios deben verificarse con proveedores oficiales.",
      },
      {
        from: "Punta Arenas",
        to: "Puerto Williams",
        mode: "air-or-sea",
        stability: "dynamic",
        note: "La operación puede variar por temporada.",
      },
    ],
    warnings: ["Confirma cada tramo con fuentes oficiales."],
    sources: [
      {
        title: "Fuente provisional de conectividad",
        publisher: "Austral Beacon Media",
        url: "https://www.endoftheworld.travel/",
        verifiedAt: "2026-07-25",
        status: "provisional",
      },
    ],
    verifiedAt: "2026-07-25",
  };

  it("includes summary, stages, warnings, sources and verifiedAt", () => {
    const output = formatAnswer(answer);

    expect(output).toContain("Conectividad");
    expect(output).toContain("La conexión habitual desde Santiago");
    expect(output).toContain("Santiago → Punta Arenas [aéreo]");
    expect(output).toContain("Punta Arenas → Puerto Williams [aéreo o marítimo]");
    expect(output).toContain("Confirma cada tramo con fuentes oficiales.");
    expect(output).toContain("Fuente provisional de conectividad");
    expect(output).toContain("Austral Beacon Media");
    expect(output).toContain("https://www.endoftheworld.travel/");
    expect(output).toContain("Verificado: 2026-07-25");
  });
});

describe("formatAnswer — destination-info supported", () => {
  const answer: DestinationCardAnswer = {
    status: "supported",
    intent: "destination-info",
    summary: "Punta Arenas es una ciudad situada junto al Estrecho de Magallanes.",
    confidence: "high",
    warnings: ["Los horarios pueden variar."],
    sources: [
      {
        title: "Reporte Comunal de Punta Arenas 2025",
        publisher: "Biblioteca del Congreso Nacional de Chile",
        url: "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?idcom=12101",
        verifiedAt: "2026-07-25",
        status: "verified",
      },
    ],
    suggestedInternalLinks: [
      { path: "/puerto-williams", label: "Puerto Williams" },
      { path: "/cabo-de-hornos", label: "Cabo de Hornos" },
    ],
    verifiedAt: "2026-07-25",
    card: {
      id: "punta-arenas",
      name: "Punta Arenas",
      region: "Magallanes y de la Antártica Chilena",
      comuna: "Punta Arenas",
      coordinates: { latitude: -53.1638, longitude: -70.9171 },
      summary: "Punta Arenas es una ciudad situada junto al Estrecho de Magallanes.",
      stableData: {
        geographicContext: "Se ubica en la ribera continental del Estrecho de Magallanes.",
        culturalContext: "La ciudad concentra patrimonio portuario y ganadero.",
      },
      warnings: ["Los horarios pueden variar."],
      sources: [
        {
          title: "Reporte Comunal de Punta Arenas 2025",
          publisher: "Biblioteca del Congreso Nacional de Chile",
          url: "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?idcom=12101",
          verifiedAt: "2026-07-25",
          status: "verified",
        },
      ],
      suggestedInternalLinks: [
        { path: "/puerto-williams", label: "Puerto Williams" },
        { path: "/cabo-de-hornos", label: "Cabo de Hornos" },
      ],
      verifiedAt: "2026-07-25",
    },
  };

  it("includes name, summary, contexts, warnings, sources, links, confidence and verifiedAt", () => {
    const output = formatAnswer(answer);

    expect(output).toContain("━━━ Punta Arenas ━━━");
    expect(output).toContain("Punta Arenas es una ciudad situada junto al Estrecho");
    expect(output).toContain("Contexto geográfico:");
    expect(output).toContain("ribera continental del Estrecho de Magallanes");
    expect(output).toContain("Contexto cultural:");
    expect(output).toContain("patrimonio portuario y ganadero");
    expect(output).toContain("Los horarios pueden variar.");
    expect(output).toContain("Reporte Comunal de Punta Arenas 2025");
    expect(output).toContain("Biblioteca del Congreso Nacional de Chile");
    expect(output).toContain("/puerto-williams");
    expect(output).toContain("Puerto Williams");
    expect(output).toContain("/cabo-de-hornos");
    expect(output).toContain("Confianza: high");
    expect(output).toContain("Verificado: 2026-07-25");
  });
});

describe("formatAnswer — Strait info supported", () => {
  const answer: StraitInfoAnswer = {
    status: "supported",
    intent: "strait-info",
    summary: "El Estrecho de Magallanes es un paso marítimo natural en el extremo sur de Chile, en la Región de Magallanes y de la Antártica Chilena.",
    facts: [
      {
        entityId: "strait-of-magellan",
        claimId: "strait-length-330-nm",
        text: "DIRECTEMAR define una longitud total de 330 millas náuticas.",
        sourceIds: ["directemar-generalidades-estrecho-magallanes"],
        sensitivity: "public_core",
        embeddingEligible: true,
      },
      {
        entityId: "strait-of-magellan",
        claimId: "strait-jurisdiction-chile",
        text: "DIRECTEMAR señala que el Estrecho se encuentra íntegramente bajo jurisdicción de Chile.",
        sourceIds: ["directemar-generalidades-estrecho-magallanes"],
        sensitivity: "public_core",
        embeddingEligible: true,
      },
    ],
    confidence: "high",
    warnings: ["La información operacional requiere verificación vigente."],
    sources: [
      {
        title: "DIRECTEMAR — Generalidades del Estrecho de Magallanes",
        publisher: "DIRECTEMAR",
        url: "https://www.directemar.cl/",
        verifiedAt: "2026-08-29",
        status: "verified",
      },
    ],
    suggestedInternalLinks: [],
    verifiedAt: "2026-08-29",
  };

  it("keeps the concise summary and renders projected facts in a separate block", () => {
    const output = formatAnswer(answer);
    expect(output).toContain(`Resumen: ${answer.summary}`);
    expect(output).toContain("Hechos verificados:");
    expect(output).toContain("330 millas náuticas");
    expect(output).toContain("jurisdicción de Chile");
    expect(output.indexOf("Hechos verificados:")).toBeGreaterThan(output.indexOf("Resumen:"));
  });
});

describe("formatAnswer — destination-info unsupported", () => {
  const answer: DestinationCardAnswer = {
    status: "unsupported",
    intent: "destination-info",
    summary: "El destino consultado no está disponible en la base local.",
    confidence: "none",
    warnings: [],
    sources: [],
    suggestedInternalLinks: [],
  };

  it("shows destination not available message", () => {
    const output = formatAnswer(answer);

    expect(output).toContain("destino consultado no está disponible");
  });
});

describe("formatAnswer — unknown unsupported", () => {
  const answer: TravelAnswer = {
    status: "unsupported",
    intent: "unknown",
    summary: "La base local todavía no contiene evidencia suficiente para responder esta consulta.",
    stages: [],
    warnings: ["No se generó una respuesta especulativa."],
    sources: [],
  };

  it("shows query not recognized message", () => {
    const output = formatAnswer(answer);

    expect(output).toContain("no contiene evidencia suficiente");
  });
});

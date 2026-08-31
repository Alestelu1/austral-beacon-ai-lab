import type { SourceReference, StraitInfoAnswer } from "../domain/types.js";
import {
  buildStraitProjectionFacts,
  straitProjectionSources
} from "../knowledge/straitProjection.js";

/**
 * Answers a stable identity/geographic question about the Strait of Magellan
 * using ONLY the Travel Projection v1 (contract-approved canonical claims).
 *
 * It never draws on operational (currents/tides/traffic-control/pilotage),
 * legal/treaty or sovereignty content — those are excluded at the projection
 * layer and, additionally, such questions are routed away before reaching here
 * by the detector in `answerTravelQuestion`.
 */
export function answerStraitInfo(): StraitInfoAnswer {
  const facts = buildStraitProjectionFacts();

  const summary =
    "El Estrecho de Magallanes es un paso marítimo natural en el extremo sur de Sudamérica. " +
    facts.map((f) => f.text).join(" ");

  // Preserve provenance: build user-facing sources from the canonical source ids
  // used by the projected facts. Institution names come from canonical sources.json.
  const canonicalSources = straitProjectionSources();
  const sources: SourceReference[] = canonicalSources.map((s) => ({
    title: "DIRECTEMAR — Generalidades del Estrecho de Magallanes",
    publisher: s.institution || "Dirección General del Territorio Marítimo y de Marina Mercante (DIRECTEMAR)",
    url: "https://www.directemar.cl/",
    verifiedAt: "2026-08-29",
    status: "verified"
  }));

  return {
    status: "supported",
    intent: "strait-info",
    summary,
    facts,
    confidence: "high",
    warnings: [
      "Esta respuesta cubre solo contexto geográfico estable del Estrecho de Magallanes. La información operacional de navegación (corrientes, mareas, control de tráfico, pilotaje) no se entrega desde esta base estable y debe verificarse con DIRECTEMAR vigente antes de cualquier uso náutico o de viaje actual."
    ],
    sources,
    suggestedInternalLinks: [],
    verifiedAt: "2026-08-29"
  };
}

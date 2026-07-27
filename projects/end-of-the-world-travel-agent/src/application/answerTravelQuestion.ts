import { resolve } from "node:path";
import routeData from "../../data/routes/santiago-puerto-williams.json" with { type: "json" };
import type { DestinationCardAnswer, RouteRecord, TravelAnswer } from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import { LocalJsonDestinationCardRepository } from "../adapters/LocalJsonDestinationCardRepository.js";
import { getDestinationCard } from "./getDestinationCard.js";

const route = routeData as RouteRecord;

// Singleton: se instancia una vez al cargar el módulo
const destinationRepository = new LocalJsonDestinationCardRepository(
  resolve(import.meta.dirname, "../../data/destinations")
);

// --- Constantes de detección ---

const DESTINATION_INFO_INDICATORS = [
  "que es", "que son",
  "cuentame", "cuenteme",
  "informacion",
  "donde esta", "donde queda",
  "hablame", "hableme",
  "sobre",
  "acerca de",
  "describir", "descripcion",
];

const KNOWN_DESTINATIONS: Array<{ pattern: string; identifier: string }> = [
  { pattern: "punta arenas", identifier: "punta arenas" },
  { pattern: "puerto williams", identifier: "puerto williams" },
  { pattern: "cabo de hornos", identifier: "cabo de hornos" },
];

// --- Funciones de detección ---

function hasInfoIndicator(normalized: string): boolean {
  return DESTINATION_INFO_INDICATORS.some((ind) => normalized.includes(ind));
}

function extractDestinationName(normalized: string): string | null {
  // 1. Buscar coincidencia en destinos conocidos
  const known = KNOWN_DESTINATIONS.find((d) => normalized.includes(d.pattern));
  if (known) return known.identifier;

  // 2. Para destinos no conocidos: extraer segmento posterior al indicador
  for (const ind of DESTINATION_INFO_INDICATORS) {
    const idx = normalized.indexOf(ind);
    if (idx !== -1) {
      const afterIndicator = normalized.slice(idx + ind.length).trim();
      const cleaned = afterIndicator.replace(/[?¿!¡.,;:]/g, "").trim();
      if (cleaned.length > 0) return cleaned;
    }
  }

  return null;
}

// --- Detección de conectividad (existente) ---

function isSupportedConnectivityQuestion(normalized: string): boolean {
  const mentionsOrigin = normalized.includes("santiago");
  const mentionsDestination = normalized.includes("puerto williams");
  const mentionsTravel = ["llegar", "viajar", "ir", "ruta", "conexion", "como llegar", "how to get", "travel", "route"].some((term) => normalized.includes(term));

  return mentionsOrigin && mentionsDestination && mentionsTravel;
}

export function answerTravelQuestion(question: string): TravelAnswer | DestinationCardAnswer {
  const normalized = normalize(question);

  // 1. Prioridad: connectivity
  if (isSupportedConnectivityQuestion(normalized)) {
    return {
      status: "supported",
      intent: "connectivity",
      summary: route.summary,
      stages: route.stages,
      warnings: route.warnings,
      sources: route.sources,
      recommendedPage: route.recommendedPage,
      verifiedAt: route.verifiedAt
    };
  }

  // 2. destination-info (dos pasos)
  if (hasInfoIndicator(normalized)) {
    const destinationName = extractDestinationName(normalized);
    if (destinationName) {
      return getDestinationCard(destinationName, destinationRepository);
    }
  }

  // 3. Fallback: unknown
  return {
    status: "unsupported",
    intent: "unknown",
    summary: "La base local todavía no contiene evidencia suficiente para responder esta consulta.",
    stages: [],
    warnings: ["No se generó una respuesta especulativa."],
    sources: []
  };
}

import { resolve } from "node:path";
import routeData from "../../data/routes/santiago-puerto-williams.json" with { type: "json" };
import puntaArenasRouteData from "../../data/routes/punta-arenas-puerto-williams.json" with { type: "json" };
import pwCaboRelationshipData from "../../data/relationships/puerto-williams-cabo-de-hornos.json" with { type: "json" };
import type {
  DestinationCardAnswer,
  PlaceRelationshipRecord,
  RelationshipAnswer,
  RouteRecord,
  TravelAnswer
} from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import { LocalJsonDestinationCardRepository } from "../adapters/LocalJsonDestinationCardRepository.js";
import { getDestinationCard } from "./getDestinationCard.js";
import { answerPlaceRelationship } from "./answerPlaceRelationship.js";

const route = routeData as RouteRecord;
const puntaArenasRoute = puntaArenasRouteData as RouteRecord;
const pwCaboRelationship = pwCaboRelationshipData as PlaceRelationshipRecord;

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

const TRAVEL_TERMS = [
  "llegar", "viajar", "ir", "ruta", "conexion", "como llegar",
  "how to get", "how do i get", "how can i get", "travel", "route",
  "reach", "ways to reach", "get to", "get from",
];

function mentionsTravelIntent(normalized: string): boolean {
  return TRAVEL_TERMS.some((term) => normalized.includes(term));
}

function isSupportedConnectivityQuestion(normalized: string): boolean {
  const mentionsOrigin = normalized.includes("santiago");
  const mentionsDestination = normalized.includes("puerto williams");

  return mentionsOrigin && mentionsDestination && mentionsTravelIntent(normalized);
}

/**
 * Recognizes the Punta Arenas -> Puerto Williams connectivity question,
 * kept distinct from the Santiago -> Puerto Williams route.
 *
 * Gated on NOT mentioning Santiago so a Santiago query (which names Punta Arenas
 * as a waypoint) keeps its own route and identity.
 */
function isSupportedPuntaArenasConnectivityQuestion(normalized: string): boolean {
  const mentionsPuntaArenas = normalized.includes("punta arenas");
  const mentionsDestination = normalized.includes("puerto williams");
  const mentionsSantiago = normalized.includes("santiago");

  return mentionsPuntaArenas && mentionsDestination && !mentionsSantiago && mentionsTravelIntent(normalized);
}

function toConnectivityAnswer(source: RouteRecord): TravelAnswer {
  return {
    status: "supported",
    intent: "connectivity",
    summary: source.summary,
    stages: source.stages,
    warnings: source.warnings,
    sources: source.sources,
    recommendedPage: source.recommendedPage,
    verifiedAt: source.verifiedAt
  };
}

// --- Detección de relación entre lugares (Puerto Williams / Cabo de Hornos) ---

/**
 * Recognizes a question about the relationship between Puerto Williams and
 * Cabo de Hornos / Cape Horn (administrative and geographic), as opposed to a
 * travel/connectivity question. Matches when both places are named and the
 * question is not a connectivity query.
 */
function isPuertoWilliamsCaboRelationshipQuestion(normalized: string): boolean {
  const mentionsPuertoWilliams = normalized.includes("puerto williams");
  const mentionsCabo =
    normalized.includes("cabo de hornos") ||
    normalized.includes("cape horn") ||
    normalized.includes("isla hornos") ||
    normalized.includes("cabo hornos");

  if (!mentionsPuertoWilliams || !mentionsCabo) return false;

  // A travel/connectivity question is handled by the connectivity path, not here.
  if (mentionsTravelIntent(normalized)) return false;

  return true;
}

export function answerTravelQuestion(
  question: string
): TravelAnswer | DestinationCardAnswer | RelationshipAnswer {
  const normalized = normalize(question);

  // 1. Prioridad: connectivity (Santiago -> Puerto Williams)
  if (isSupportedConnectivityQuestion(normalized)) {
    return toConnectivityAnswer(route);
  }

  // 1b. Connectivity (Punta Arenas -> Puerto Williams), distinct from Santiago
  if (isSupportedPuntaArenasConnectivityQuestion(normalized)) {
    return toConnectivityAnswer(puntaArenasRoute);
  }

  // 1c. Relationship (Puerto Williams / Cabo de Hornos), before destination-info
  if (isPuertoWilliamsCaboRelationshipQuestion(normalized)) {
    return answerPlaceRelationship(pwCaboRelationship);
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

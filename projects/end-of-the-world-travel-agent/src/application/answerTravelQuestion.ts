import { resolve } from "node:path";
import routeData from "../../data/routes/santiago-puerto-williams.json" with { type: "json" };
import puntaArenasRouteData from "../../data/routes/punta-arenas-puerto-williams.json" with { type: "json" };
import pwCaboRelationshipData from "../../data/relationships/puerto-williams-cabo-de-hornos.json" with { type: "json" };
import antarcticAccessData from "../../data/relationships/antarctica-access-from-chile.json" with { type: "json" };
import villaUkikaRelationshipData from "../../data/relationships/villa-ukika-puerto-williams.json" with { type: "json" };
import type {
  AntarcticAccessAnswer,
  AntarcticAccessRecord,
  DestinationCardAnswer,
  PlaceRelationshipRecord,
  RelationshipAnswer,
  RouteRecord,
  StraitInfoAnswer,
  TravelAnswer
} from "../domain/types.js";
import { normalize } from "../domain/normalize.js";
import { LocalJsonDestinationCardRepository } from "../adapters/LocalJsonDestinationCardRepository.js";
import { getDestinationCard } from "./getDestinationCard.js";
import { answerPlaceRelationship } from "./answerPlaceRelationship.js";
import { answerAntarcticAccess } from "./answerAntarcticAccess.js";
import { answerStraitInfo } from "./answerStraitInfo.js";

const route = routeData as RouteRecord;
const puntaArenasRoute = puntaArenasRouteData as RouteRecord;
const pwCaboRelationship = pwCaboRelationshipData as PlaceRelationshipRecord;
const antarcticAccess = antarcticAccessData as AntarcticAccessRecord;
const villaUkikaRelationship = villaUkikaRelationshipData as PlaceRelationshipRecord;

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
  // English identity indicators
  "what is", "what are",
  "tell me about",
  "about",
  "information",
];

const KNOWN_DESTINATIONS: Array<{ pattern: string; identifier: string }> = [
  { pattern: "punta arenas", identifier: "punta arenas" },
  { pattern: "puerto williams", identifier: "puerto williams" },
  { pattern: "puerto toro", identifier: "puerto toro" },
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
  "llegar", "llegar a", "llego", "viajar", "viajar a", "viajo", "ir", "ir a",
  "ruta", "conexion", "como llegar",
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

// --- Detección de acceso a la Antártica desde Chile ---

/**
 * Recognizes a question about how to access Antarctica from Chile (or from
 * Punta Arenas / Puerto Williams). Matches when Antarctica is named together
 * with an access/travel intent or a "can I reach / se puede llegar" phrasing.
 */
function isAntarcticAccessQuestion(normalized: string): boolean {
  const mentionsAntarctica =
    normalized.includes("antartica") || normalized.includes("antarctica") || normalized.includes("antartida");

  if (!mentionsAntarctica) return false;

  const accessPhrases = [
    "se puede llegar",
    "se puede viajar",
    "can i reach",
    "can i get",
    "can we reach",
    "how do i get",
    "how can i travel",
    "how do i travel",
    "reach",
    "get to"
  ];

  const hasAccessPhrase = accessPhrases.some((phrase) => normalized.includes(phrase));

  return hasAccessPhrase || mentionsTravelIntent(normalized);
}

// --- Detección del Estrecho de Magallanes (proyección estable v1) ---

/**
 * Operational / legal / sovereignty signals for the Strait. If a Strait query
 * contains any of these, it must NOT be answered from the stable projection;
 * it falls through so it never receives static operational or legal content.
 */
const STRAIT_NON_STABLE_TERMS = [
  // operational navigation / dynamic
  "corriente", "corrientes", "marea", "mareas", "nudos", "current", "currents", "tide", "tides",
  "navegar", "navegacion", "navigation", "navegabilidad", "navigate", "sailing", "shipping",
  "control de trafico", "traffic control", "pilotaje", "pilotage", "radio", "vhf",
  "cruce", "crossing", "ferry", "transbordador", "calado", "calados", "faro", "faros", "baliza",
  "condiciones actuales", "estado actual", "hoy", "clima", "weather",
  // legal / sovereignty
  "soberania", "sovereignty", "tratado", "tratados", "treaty", "limite", "limites", "border",
  "jurisdiccion", "jurisdiction", "territorial", "geopolit", "estrategic", "strategic", "militar", "military"
];

function isStraitStableInfoQuestion(normalized: string): boolean {
  const mentionsStrait =
    normalized.includes("estrecho de magallanes") ||
    normalized.includes("strait of magellan") ||
    normalized.includes("estrecho magallanes") ||
    normalized.includes("magellan strait");

  if (!mentionsStrait) return false;

  // Never answer operational/legal/sovereignty Strait questions from the stable projection.
  if (STRAIT_NON_STABLE_TERMS.some((t) => normalized.includes(t))) return false;

  return true;
}

// --- Detección de Villa Ukika (contexto de comunidad yagán viva) ---

/**
 * Recognizes questions about Villa Ukika: its identity as a living Yagán
 * community context and its relationship with / distinction from Puerto Williams.
 * Answered deterministically via the source-backed relationship record, not as a
 * tourism destination card.
 */
function isVillaUkikaQuestion(normalized: string): boolean {
  return normalized.includes("villa ukika") || normalized.includes("ukika");
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
):
  | TravelAnswer
  | DestinationCardAnswer
  | RelationshipAnswer
  | AntarcticAccessAnswer
  | StraitInfoAnswer {
  const normalized = normalize(question);

  // 0. Prioridad máxima: acceso a la Antártica desde Chile
  //    (evita que "desde Punta Arenas/Puerto Williams" se enrute como conectividad local)
  if (isAntarcticAccessQuestion(normalized)) {
    return answerAntarcticAccess(antarcticAccess);
  }

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

  // 1d. Villa Ukika (living Yagán community context), before destination-info
  //     so it is answered as a community-context relationship, not a tourism card.
  if (isVillaUkikaQuestion(normalized)) {
    return answerPlaceRelationship(villaUkikaRelationship);
  }

  // 1e. Strait of Magellan — stable identity/geographic projection v1 only.
  //     Operational/legal/sovereignty Strait questions are excluded by the
  //     detector and fall through (never answered from the stable projection).
  if (isStraitStableInfoQuestion(normalized)) {
    return answerStraitInfo();
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

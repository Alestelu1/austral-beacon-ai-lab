import type { RoadConditionObservation, RoadOperationalState } from "./RoadConditionVerifier.js";

export type OfficialRoadPublication = {
  sourceId: string;
  sourceUrl: string;
  producer: string;
  publishedAt: string;
  observedAt?: string;
  title: string;
  text: string;
};

export type RoadPublicationAdaptation = {
  observation: RoadConditionObservation | null;
  routeMentioned: boolean;
  explicitStateFound: boolean;
  reason: string;
};

const Y905_PATTERN = /\b(?:ruta\s*)?y[-\s]?905\b/i;
const OTHER_NAMED_ROAD_PATTERN = /\b(?:ruta\s+[A-Z0-9-]+|camino\s+a\s+[A-ZÁÉÍÓÚÑ][\p{L}\s-]+|v[ií]a\s+[A-Z0-9-]+)\b/iu;
const ROUTE_COREFERENCE_PATTERN = /\b(?:la|esta|dicha)\s+ruta\b/i;

const STATE_PATTERNS: Array<{ state: Exclude<RoadOperationalState, "unknown">; pattern: RegExp }> = [
  {
    state: "closed",
    pattern: /\b(?:ruta|camino|v[ií]a)[^.]{0,120}\b(?:cerrad[ao]|cierre\s+(?:total|de\s+la\s+ruta)|no\s+transitable|tr[aá]nsito\s+suspendido|tr[aá]nsito\s+interrumpido)\b/i
  },
  {
    state: "restricted",
    pattern: /\b(?:ruta|camino|v[ií]a)[^.]{0,120}\b(?:tr[aá]nsito\s+restringido|restricci[oó]n\s+de\s+tr[aá]nsito|solo\s+veh[ií]culos|uso\s+de\s+cadenas\s+obligatorio|paso\s+controlado)\b/i
  },
  {
    state: "open",
    pattern: /\b(?:ruta|camino|v[ií]a)[^.]{0,160}\b(?:abiert[ao]|habilitad[ao]\s+al\s+tr[aá]nsito|transitable|se\s+puede\s+transitar\s+sin\s+problemas|ruta\s+despejada)\b/i
  }
];

function detectState(text: string): RoadOperationalState {
  for (const { state, pattern } of STATE_PATTERNS) {
    if (pattern.test(text)) return state;
  }
  return "unknown";
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\r?\n+/g, ". ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function findRouteScopedState(text: string): RoadOperationalState {
  const sentences = splitSentences(text);

  for (let index = 0; index < sentences.length; index += 1) {
    const sentence = sentences[index];
    if (!Y905_PATTERN.test(sentence)) continue;

    const sameSentenceState = detectState(sentence);
    if (sameSentenceState !== "unknown") return sameSentenceState;

    const nextSentence = sentences[index + 1];
    if (
      nextSentence &&
      ROUTE_COREFERENCE_PATTERN.test(nextSentence) &&
      !Y905_PATTERN.test(nextSentence) &&
      !OTHER_NAMED_ROAD_PATTERN.test(nextSentence)
    ) {
      const coreferenceState = detectState(nextSentence);
      if (coreferenceState !== "unknown") return coreferenceState;
    }
  }

  return "unknown";
}

/**
 * Converts already-fetched official publication text into a structured
 * observation for Ruta Y-905.
 *
 * The adapter is intentionally conservative. It does not treat generic weather
 * warnings, maintenance announcements, project descriptions or statements
 * about other roads as proof of Y-905 operational state. The publication must
 * explicitly mention Y-905 and contain an explicit route-state expression in
 * the same sentence, or an immediately following sentence that clearly refers
 * back to "la/esta/dicha ruta" without naming another road. Freshness is
 * evaluated later by `verifyY905RoadCondition`.
 */
export function adaptOfficialRoadPublication(
  publication: OfficialRoadPublication
): RoadPublicationAdaptation {
  const combined = `${publication.title}\n${publication.text}`.trim();
  const routeMentioned = Y905_PATTERN.test(combined);

  if (!routeMentioned) {
    return {
      observation: null,
      routeMentioned: false,
      explicitStateFound: false,
      reason: "Publication does not explicitly identify Ruta Y-905; no route-specific operational observation was created."
    };
  }

  const routeState = findRouteScopedState(combined);
  const explicitStateFound = routeState !== "unknown";

  const observation: RoadConditionObservation = {
    sourceId: publication.sourceId,
    sourceUrl: publication.sourceUrl,
    producer: publication.producer,
    observedAt: publication.observedAt ?? publication.publishedAt,
    publishedAt: publication.publishedAt,
    routeId: "ruta_y905",
    routeState,
    evidenceText: combined,
    territorialScope: ["ruta_y905", "isla_navarino", "puerto_williams", "puerto_navarino"]
  };

  return {
    observation,
    routeMentioned: true,
    explicitStateFound,
    reason: explicitStateFound
      ? "Publication explicitly identifies Ruta Y-905 and contains a route-scoped operational-state expression."
      : "Publication identifies Ruta Y-905 but does not explicitly establish open, closed or restricted state; observation remains unknown."
  };
}

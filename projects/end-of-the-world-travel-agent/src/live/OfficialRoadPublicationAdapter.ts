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

function findRouteScopedState(text: string): RoadOperationalState {
  const routeIndex = text.search(Y905_PATTERN);
  if (routeIndex < 0) return "unknown";

  const start = Math.max(0, routeIndex - 220);
  const end = Math.min(text.length, routeIndex + 420);
  const routeContext = text.slice(start, end);

  for (const { state, pattern } of STATE_PATTERNS) {
    if (pattern.test(routeContext)) return state;
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
 * the nearby textual context. Freshness is evaluated later by
 * `verifyY905RoadCondition`.
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

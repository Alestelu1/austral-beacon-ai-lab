export type RoadOperationalState = "open" | "closed" | "restricted" | "unknown";

export type RoadConditionObservation = {
  sourceId: string;
  sourceUrl: string;
  producer: string;
  observedAt: string;
  publishedAt: string;
  routeId: "ruta_y905";
  routeState: RoadOperationalState;
  evidenceText: string;
  territorialScope: string[];
};

export type RoadConditionVerificationStatus =
  | "verified_open"
  | "verified_closed"
  | "restricted"
  | "not_verified";

export type RoadConditionVerification = {
  status: RoadConditionVerificationStatus;
  routeId: "ruta_y905";
  checkedAt: string;
  evidenceAgeHours: number | null;
  source: Pick<RoadConditionObservation, "sourceId" | "sourceUrl" | "producer" | "publishedAt"> | null;
  evidenceText: string | null;
  reason: string;
};

export type VerifyRoadConditionOptions = {
  checkedAt?: Date;
  maxEvidenceAgeHours?: number;
};

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function ageHours(checkedAt: Date, publishedAt: Date): number {
  return (checkedAt.getTime() - publishedAt.getTime()) / 3_600_000;
}

/**
 * Evaluates already-structured observations from official sources.
 *
 * This verifier deliberately does not scrape or infer state from prose. A source
 * adapter must first produce an explicit `routeState` tied to Ruta Y-905. If the
 * evidence is missing, stale, future-dated or ambiguous, the result is
 * `not_verified` rather than an operational claim.
 */
export function verifyY905RoadCondition(
  observations: RoadConditionObservation[],
  options: VerifyRoadConditionOptions = {}
): RoadConditionVerification {
  const checkedAt = options.checkedAt ?? new Date();
  const maxEvidenceAgeHours = options.maxEvidenceAgeHours ?? 24;

  const eligible = observations
    .filter((observation) => observation.routeId === "ruta_y905")
    .map((observation) => ({ observation, published: parseDate(observation.publishedAt) }))
    .filter((entry): entry is { observation: RoadConditionObservation; published: Date } => entry.published !== null)
    .map((entry) => ({ ...entry, age: ageHours(checkedAt, entry.published) }))
    .filter((entry) => entry.age >= 0 && entry.age <= maxEvidenceAgeHours)
    .sort((a, b) => b.published.getTime() - a.published.getTime());

  if (eligible.length === 0) {
    return {
      status: "not_verified",
      routeId: "ruta_y905",
      checkedAt: checkedAt.toISOString(),
      evidenceAgeHours: null,
      source: null,
      evidenceText: null,
      reason: `No explicit official Ruta Y-905 operational observation was available within the ${maxEvidenceAgeHours}-hour freshness window.`
    };
  }

  const latest = eligible[0];
  const state = latest.observation.routeState;

  if (state === "unknown") {
    return {
      status: "not_verified",
      routeId: "ruta_y905",
      checkedAt: checkedAt.toISOString(),
      evidenceAgeHours: latest.age,
      source: latest.observation,
      evidenceText: latest.observation.evidenceText,
      reason: "The latest official observation does not explicitly establish an operational state for Ruta Y-905."
    };
  }

  const status: RoadConditionVerificationStatus =
    state === "open" ? "verified_open" : state === "closed" ? "verified_closed" : "restricted";

  return {
    status,
    routeId: "ruta_y905",
    checkedAt: checkedAt.toISOString(),
    evidenceAgeHours: latest.age,
    source: latest.observation,
    evidenceText: latest.observation.evidenceText,
    reason: "Operational state is based on the most recent explicit official observation within the configured freshness window."
  };
}

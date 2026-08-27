import { planLiveVerification } from "./LiveVerificationSourceRegistry.js";
import { fetchOfficialRoadSource, type FetchLike } from "./OfficialRoadSourceFetcher.js";
import { adaptOfficialRoadPublication } from "./OfficialRoadPublicationAdapter.js";
import {
  verifyY905RoadCondition,
  type RoadConditionObservation,
  type RoadConditionVerification
} from "./RoadConditionVerifier.js";

export type VerifyY905LiveOptions = {
  fetchImpl?: FetchLike;
  checkedAt?: Date;
  maxEvidenceAgeHours?: number;
  maxCandidatesPerSource?: number;
  requestTimeoutMs?: number;
};

export type Y905LiveVerificationResult = {
  verification: RoadConditionVerification;
  observations: RoadConditionObservation[];
  sourceCount: number;
  publicationCount: number;
  adaptedPublicationCount: number;
  warnings: string[];
};

/**
 * Executes the complete conservative live-verification pipeline for Ruta Y-905:
 * registry -> official-source acquisition -> route-scoped adaptation -> freshness verification.
 *
 * Source availability alone never establishes operational state. If current explicit
 * official evidence cannot be obtained, the final result remains `not_verified`.
 */
export async function verifyY905Live(
  options: VerifyY905LiveOptions = {}
): Promise<Y905LiveVerificationResult> {
  const checkedAt = options.checkedAt ?? new Date();
  const plans = planLiveVerification(["road_condition"]);
  const roadPlan = plans.find((plan) => plan.signal === "road_condition" && plan.status === "source_check_required");
  const warnings: string[] = [];
  const observations: RoadConditionObservation[] = [];
  let publicationCount = 0;
  let adaptedPublicationCount = 0;

  if (!roadPlan || roadPlan.sources.length === 0) {
    return {
      verification: verifyY905RoadCondition([], {
        checkedAt,
        maxEvidenceAgeHours: options.maxEvidenceAgeHours
      }),
      observations: [],
      sourceCount: 0,
      publicationCount: 0,
      adaptedPublicationCount: 0,
      warnings: ["No official live-verification sources are registered for road_condition."]
    };
  }

  for (const source of roadPlan.sources) {
    try {
      const fetched = await fetchOfficialRoadSource(source, {
        fetchImpl: options.fetchImpl,
        fetchedAt: checkedAt,
        maxCandidates: options.maxCandidatesPerSource,
        requestTimeoutMs: options.requestTimeoutMs
      });

      warnings.push(...fetched.warnings.map((warning) => `${source.source_id}: ${warning}`));
      publicationCount += fetched.publications.length;

      for (const publication of fetched.publications) {
        const adapted = adaptOfficialRoadPublication(publication);
        if (adapted.observation) {
          observations.push(adapted.observation);
          adaptedPublicationCount += 1;
        }
      }
    } catch (error) {
      warnings.push(
        `${source.source_id}: source acquisition failed (${error instanceof Error ? error.message : "unknown error"}).`
      );
    }
  }

  return {
    verification: verifyY905RoadCondition(observations, {
      checkedAt,
      maxEvidenceAgeHours: options.maxEvidenceAgeHours
    }),
    observations,
    sourceCount: roadPlan.sources.length,
    publicationCount,
    adaptedPublicationCount,
    warnings
  };
}

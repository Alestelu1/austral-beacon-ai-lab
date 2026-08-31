import contract from "../../../../knowledge-base/projections/travel/strait-of-magellan-v1.json" with { type: "json" };
import canonicalClaims from "../../../../knowledge-base/entities/geography/strait-of-magellan/claims.json" with { type: "json" };
import canonicalSources from "../../../../knowledge-base/entities/geography/strait-of-magellan/sources.json" with { type: "json" };
import canonicalChunks from "../../../../knowledge-base/entities/geography/strait-of-magellan/chunks.json" with { type: "json" };
import canonicalMetadata from "../../../../knowledge-base/entities/geography/strait-of-magellan/metadata.json" with { type: "json" };
import type { StraitProjectedFact } from "../domain/types.js";

/**
 * Strait of Magellan Travel Projection v1.
 *
 * This module is a projection/adapter over the canonical knowledge-base entity
 * `strait-of-magellan`. The canonical files are the only source of truth; this
 * module never introduces new facts. It applies the projection contract
 * (`knowledge-base/projections/travel/strait-of-magellan-v1.json`) to decide
 * which canonical claims may be exposed to the Travel Agent, and preserves the
 * canonical provenance chain (entity_id, claim_id, source_ids, sensitivity).
 *
 * Safety model (defense in depth):
 * 1. Only claim ids listed in the contract's `allowed_claims` are eligible.
 * 2. A hard blocklist rejects any claim id the contract marks `blocked_claims`
 *    or any conditionally-allowed claim (those require guards/human review and
 *    are NOT part of v1).
 * 3. Each eligible claim must resolve to a canonical claim whose sensitivity is
 *    `public_core` and whose source_ids all resolve in the canonical sources.
 * 4. Chunks flagged `blocked_consumers: ["travel-agent"]`, non-`public_core`
 *    sensitivity, or `embedding_eligible: false` are never used for projected text.
 * If any invariant is violated the builder throws, so a leak fails loudly.
 */

type CanonicalClaim = {
  id: string;
  claim: string;
  status?: string;
  stability?: string;
  sensitivity?: string;
  source_ids?: string[];
  source_id?: string;
};

type CanonicalChunk = {
  id: string;
  text: string;
  source_ids?: string[];
  sensitivity?: string;
  embedding_eligible?: boolean;
  blocked_consumers?: string[];
};

const CONSUMER = "travel-agent";
export const STRAIT_ENTITY_ID = "strait-of-magellan";
export const STRAIT_PROJECTION_ID = "travel-strait-of-magellan-v1";

const claimsData = canonicalClaims as { entity_id: string; claims: CanonicalClaim[] };
const sourcesData = canonicalSources as { sources: Array<{ id?: string; source_id?: string }> };
const chunksData = canonicalChunks as { chunks: CanonicalChunk[] };
const metadata = canonicalMetadata as { country?: string; region?: string };

/** Canonical stable Chilean geographic context (from canonical metadata). */
export const STRAIT_COUNTRY = metadata.country ?? "Chile";
export const STRAIT_REGION = metadata.region ?? "Región de Magallanes y de la Antártica Chilena";

/**
 * Per-claim matcher: which safe canonical chunk best expresses a given claim.
 * Keyed by canonical claim id so the length claim and the jurisdiction claim
 * each select their own public_core chunk (never an operational one).
 */
const CLAIM_CHUNK_MATCHER: Record<string, RegExp> = {
  "strait-length-330-nm": /330|millas n[aá]uticas|D[uú]ngenes|Evangelistas/i,
  "strait-jurisdiction-chile": /jurisdicci[oó]n de Chile|Patagonia chilena/i
};

/** Canonical source ids present in the entity's sources.json (both field variants). */
const canonicalSourceIds = new Set<string>(
  sourcesData.sources.flatMap((s) => [s.id, s.source_id].filter((v): v is string => Boolean(v)))
);

/** Claim ids the contract explicitly blocks — must never be projected. */
const blockedClaimIds = new Set<string>(
  (contract.blocked_claims ?? []).map((c: { claim_id: string }) => c.claim_id)
);

/** Conditionally-allowed claim ids are NOT part of v1 (require guards/review). */
const conditionallyAllowedClaimIds = new Set<string>(
  (contract.conditionally_allowed_claims ?? []).map((c: { claim_id: string }) => c.claim_id)
);

/** Claim ids the contract allows for v1. */
const allowedClaimIds: string[] = (contract.allowed_claims ?? []).map(
  (c: { claim_id: string }) => c.claim_id
);

function findCanonicalClaim(claimId: string): CanonicalClaim | undefined {
  return claimsData.claims.find((c) => c.id === claimId);
}

function claimSourceIds(claim: CanonicalClaim): string[] {
  if (claim.source_ids && claim.source_ids.length > 0) return claim.source_ids;
  if (claim.source_id) return [claim.source_id];
  return [];
}

/**
 * Finds a canonical chunk safe to use as projected text for a claim: it must
 * share at least one source id with the claim, be `public_core`, not be flagged
 * `blocked_consumers` for the travel agent, and not be embedding-ineligible.
 */
function findSafeChunkText(claim: CanonicalClaim): string | undefined {
  const claimSources = new Set(claimSourceIds(claim));
  const matcher = CLAIM_CHUNK_MATCHER[claim.id];
  if (!matcher) return undefined;
  const safe = chunksData.chunks.find((ch) => {
    if (ch.blocked_consumers?.includes(CONSUMER)) return false;
    if (ch.embedding_eligible === false) return false;
    if (ch.sensitivity && ch.sensitivity !== "public_core") return false;
    const chSources = ch.source_ids ?? [];
    const sharesSource = chSources.some((s) => claimSources.has(s));
    return sharesSource && matcher.test(ch.text);
  });
  return safe?.text;
}

/**
 * Builds the Strait Travel Projection v1 facts from canonical evidence.
 * Throws if a blocked/conditional claim would leak or provenance is broken.
 */
export function buildStraitProjectionFacts(): StraitProjectedFact[] {
  const facts: StraitProjectedFact[] = [];

  for (const claimId of allowedClaimIds) {
    // Invariant 1+2: never project a blocked or conditional-only claim.
    if (blockedClaimIds.has(claimId)) {
      throw new Error(`Strait projection: allowed claim "${claimId}" is also blocked by the contract.`);
    }
    if (conditionallyAllowedClaimIds.has(claimId)) {
      throw new Error(`Strait projection: claim "${claimId}" is conditional and not part of v1.`);
    }

    const claim = findCanonicalClaim(claimId);
    if (!claim) {
      throw new Error(`Strait projection: allowed claim "${claimId}" not found in canonical claims.`);
    }

    // Invariant 3: sensitivity must be public_core.
    if (claim.sensitivity && claim.sensitivity !== "public_core") {
      throw new Error(`Strait projection: claim "${claimId}" sensitivity "${claim.sensitivity}" is not public_core.`);
    }

    const sourceIds = claimSourceIds(claim);
    if (sourceIds.length === 0) {
      throw new Error(`Strait projection: claim "${claimId}" has no source ids (provenance required).`);
    }
    for (const sid of sourceIds) {
      if (!canonicalSourceIds.has(sid)) {
        throw new Error(`Strait projection: claim "${claimId}" references unknown source "${sid}".`);
      }
    }

    // Prefer safe canonical chunk text; fall back to the canonical claim text.
    const text = findSafeChunkText(claim) ?? claim.claim;

    facts.push({
      entityId: claimsData.entity_id ?? STRAIT_ENTITY_ID,
      claimId,
      text,
      sourceIds,
      sensitivity: claim.sensitivity ?? "public_core",
      embeddingEligible: true
    });
  }

  if (facts.length === 0) {
    throw new Error("Strait projection: produced zero facts; contract/canonical mismatch.");
  }
  return facts;
}

/**
 * Returns true if a canonical claim id is exposable under the v1 projection.
 * Used by tests to prove blocked/conditional claims cannot enter the projection.
 */
export function isClaimProjectable(claimId: string): boolean {
  if (blockedClaimIds.has(claimId)) return false;
  if (conditionallyAllowedClaimIds.has(claimId)) return false;
  return allowedClaimIds.includes(claimId);
}

/** Canonical sources referenced by the projected facts (for the answer contract). */
export function straitProjectionSources(): Array<{ id: string; institution: string }> {
  const used = new Set(buildStraitProjectionFacts().flatMap((f) => f.sourceIds));
  return sourcesData.sources
    .map((s) => ({ id: (s.id ?? s.source_id) as string, institution: (s as { institution?: string }).institution ?? "" }))
    .filter((s) => used.has(s.id));
}

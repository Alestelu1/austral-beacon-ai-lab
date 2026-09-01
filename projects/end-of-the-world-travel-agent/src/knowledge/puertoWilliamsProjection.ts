import contract from "../../../../knowledge-base/projections/travel/puerto-williams-v1.json" with { type: "json" };
import canonicalClaims from "../../../../knowledge-base/entities/places/puerto-williams/claims.json" with { type: "json" };
import canonicalSources from "../../../../knowledge-base/entities/places/puerto-williams/sources.json" with { type: "json" };
import canonicalChunks from "../../../../knowledge-base/entities/places/puerto-williams/chunks.json" with { type: "json" };
import canonicalMetadata from "../../../../knowledge-base/entities/places/puerto-williams/metadata.json" with { type: "json" };
import communeMetadata from "../../../../knowledge-base/entities/jurisdictions/comuna-cabo-de-hornos/metadata.json" with { type: "json" };
import regionMetadata from "../../../../knowledge-base/entities/jurisdictions/region-magallanes-antartica-chilena/metadata.json" with { type: "json" };
import type { DestinationCard, SourceReference } from "../domain/types.js";

export const PUERTO_WILLIAMS_ENTITY_ID = "puerto-williams";
export const PUERTO_WILLIAMS_PROJECTION_ID = "travel-puerto-williams-v1";

type CanonicalClaim = {
  id: string;
  statement?: string;
  claim?: string;
  status?: string;
  sensitivity?: string;
  source_ids?: string[];
};

type CanonicalSource = {
  id: string;
  institution: string;
  title: string;
  url: string;
  verified_at: string;
};

type CanonicalChunk = {
  id: string;
  text: string;
  claim_ids?: string[];
  source_ids?: string[];
  sensitivity?: string;
  embedding_eligible?: boolean;
  blocked_consumers?: string[];
};

const claimsData = canonicalClaims as { claims: CanonicalClaim[] };
const sourcesData = canonicalSources as { sources: CanonicalSource[] };
const chunksData = canonicalChunks as { chunks: CanonicalChunk[] };
const metadata = canonicalMetadata as {
  id: string;
  canonical_name: string;
  entity_type: string;
  status: string;
  sensitivity: string;
};
const commune = communeMetadata as { canonical_name: string };
const region = regionMetadata as { canonical_name: string };

const allowedClaimIds = (contract.allowed_claims ?? []).map((item: { claim_id: string }) => item.claim_id);
const canonicalSourceIds = new Set(sourcesData.sources.map((source) => source.id));

function findClaim(id: string): CanonicalClaim {
  const claim = claimsData.claims.find((item) => item.id === id);
  if (!claim) throw new Error(`Puerto Williams projection: canonical claim "${id}" was not found.`);
  if (claim.status !== "verified") throw new Error(`Puerto Williams projection: claim "${id}" is not verified.`);
  if (claim.sensitivity !== "public_core") {
    throw new Error(`Puerto Williams projection: claim "${id}" is not public_core.`);
  }
  if (!claim.source_ids?.length) throw new Error(`Puerto Williams projection: claim "${id}" has no provenance.`);
  for (const sourceId of claim.source_ids) {
    if (!canonicalSourceIds.has(sourceId)) {
      throw new Error(`Puerto Williams projection: claim "${id}" references unknown source "${sourceId}".`);
    }
  }
  return claim;
}

function claimText(claim: CanonicalClaim): string {
  // Atomic claim text is preferred so one multi-claim RAG chunk cannot broaden
  // the meaning of a projected fact. A safe canonical chunk is only a fallback.
  if (claim.statement) return claim.statement;
  if (claim.claim) return claim.claim;
  const safeChunk = chunksData.chunks.find((chunk) =>
    chunk.claim_ids?.includes(claim.id) &&
    chunk.sensitivity === "public_core" &&
    chunk.embedding_eligible !== false &&
    !chunk.blocked_consumers?.includes("travel-agent")
  );
  return safeChunk?.text ?? "";
}

function projectedSources(claims: CanonicalClaim[]): SourceReference[] {
  const used = new Set(claims.flatMap((claim) => claim.source_ids ?? []));
  return sourcesData.sources
    .filter((source) => used.has(source.id))
    .map((source) => ({
      title: source.title,
      publisher: source.institution,
      url: source.url,
      verifiedAt: source.verified_at,
      status: "verified" as const
    }));
}

export function buildPuertoWilliamsDestinationCard(): DestinationCard {
  if (metadata.id !== PUERTO_WILLIAMS_ENTITY_ID || metadata.status !== "canonical") {
    throw new Error("Puerto Williams projection: canonical metadata invariant failed.");
  }

  const claims = allowedClaimIds.map(findClaim);
  const byId = new Map(claims.map((claim) => [claim.id, claim]));
  const identity = byId.get("puerto-williams-claim-001");
  const geography = byId.get("puerto-williams-claim-002");
  const recognition = byId.get("puerto-williams-claim-003");
  const aerodrome = byId.get("puerto-williams-claim-004");
  if (!identity || !geography || !recognition || !aerodrome) {
    throw new Error("Puerto Williams projection: required v1 claims are incomplete.");
  }

  const sources = projectedSources(claims);
  const verifiedAt = sources.map((source) => source.verifiedAt).sort().at(-1) ?? "";

  return {
    id: metadata.id,
    name: metadata.canonical_name,
    region: region.canonical_name,
    comuna: commune.canonical_name.replace(/^Comuna de /, ""),
    summary: claimText(identity),
    stableData: {
      geographicContext: claimText(geography),
      culturalContext: `${claimText(recognition)} El contexto cultural yagán vivo se mantiene en entidades canónicas separadas; esta proyección no infiere población, genealogía ni representación comunitaria.`,
      accessInfrastructure: claimText(aerodrome)
    },
    warnings: [
      "Horarios, frecuencias, tarifas, cupos y condiciones operativas de transporte requieren verificación actual con fuentes oficiales u operadores responsables.",
      "La proyección no publica coordenadas hasta que exista geometría canónica con provenance autoritativa.",
      "El acceso o visita a contextos de comunidades indígenas vivas no debe inferirse desde relaciones territoriales estables."
    ],
    sources,
    suggestedInternalLinks: [
      { path: "/cabo-de-hornos", label: "Cabo de Hornos" }
    ],
    verifiedAt
  };
}

export function isPuertoWilliamsClaimProjectable(claimId: string): boolean {
  return allowedClaimIds.includes(claimId);
}

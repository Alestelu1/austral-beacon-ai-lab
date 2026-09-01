import contract from "../../../../knowledge-base/projections/travel/villa-ukika-v1.json" with { type: "json" };
import canonicalClaims from "../../../../knowledge-base/entities/communities/villa-ukika/claims.json" with { type: "json" };
import canonicalSources from "../../../../knowledge-base/entities/communities/villa-ukika/sources.json" with { type: "json" };
import canonicalRelationships from "../../../../knowledge-base/entities/communities/villa-ukika/relationships.json" with { type: "json" };
import canonicalMetadata from "../../../../knowledge-base/entities/communities/villa-ukika/metadata.json" with { type: "json" };
import type { PlaceRelationshipRecord, SourceReference } from "../domain/types.js";

export const VILLA_UKIKA_ENTITY_ID = "villa-ukika";
export const VILLA_UKIKA_PROJECTION_ID = "travel-villa-ukika-v1";

type CanonicalClaim = {
  id: string;
  claim: string;
  status: string;
  sensitivity: string;
  source_ids: string[];
};

type CanonicalSource = {
  id: string;
  institution: string;
  title: string;
  url?: string;
  verified_at: string;
};

type CanonicalRelationship = {
  predicate: string;
  target: string;
  status: string;
  source_ids: string[];
};

const claimsData = canonicalClaims as { claims: CanonicalClaim[] };
const sourcesData = canonicalSources as { sources: CanonicalSource[] };
const relationshipsData = canonicalRelationships as { relationships: CanonicalRelationship[] };
const metadata = canonicalMetadata as {
  id: string;
  canonical_name: string;
  status: string;
  sensitivity: string;
  geometry_status: string;
};

const allowedClaimIds = new Set(
  (contract.allowed_claims ?? []).map((item: { claim_id: string }) => item.claim_id)
);
const allowedRelationshipKeys = new Set(
  (contract.allowed_relationships ?? []).map(
    (item: { predicate: string; target: string }) => `${item.predicate}:${item.target}`
  )
);
const sourceIds = new Set(sourcesData.sources.map((source) => source.id));

function claim(id: string): CanonicalClaim {
  if (!allowedClaimIds.has(id)) throw new Error(`Villa Ukika projection: claim "${id}" is not allowed.`);
  const value = claimsData.claims.find((item) => item.id === id);
  if (!value) throw new Error(`Villa Ukika projection: canonical claim "${id}" was not found.`);
  if (value.sensitivity !== "public_core") throw new Error(`Villa Ukika projection: claim "${id}" is not public_core.`);
  if (!["verified", "governance_constraint"].includes(value.status)) {
    throw new Error(`Villa Ukika projection: claim "${id}" has unsupported status "${value.status}".`);
  }
  if (!value.source_ids.length) throw new Error(`Villa Ukika projection: claim "${id}" has no provenance.`);
  for (const sourceId of value.source_ids) {
    if (!sourceIds.has(sourceId)) throw new Error(`Villa Ukika projection: unknown source "${sourceId}".`);
  }
  return value;
}

function relationship(predicate: string, target: string): CanonicalRelationship {
  const key = `${predicate}:${target}`;
  if (!allowedRelationshipKeys.has(key)) throw new Error(`Villa Ukika projection: relationship "${key}" is not allowed.`);
  const value = relationshipsData.relationships.find(
    (item) => item.predicate === predicate && item.target === target
  );
  if (!value || value.status !== "verified") {
    throw new Error(`Villa Ukika projection: relationship "${key}" is not verified.`);
  }
  for (const sourceId of value.source_ids) {
    if (!sourceIds.has(sourceId)) throw new Error(`Villa Ukika projection: relationship "${key}" references unknown source "${sourceId}".`);
  }
  return value;
}

function publicSources(ids: string[]): SourceReference[] {
  const used = new Set(ids);
  return sourcesData.sources
    .filter((source) => used.has(source.id) && Boolean(source.url))
    .map((source) => ({
      title: source.title,
      publisher: source.institution,
      url: source.url as string,
      verifiedAt: source.verified_at,
      status: "verified" as const
    }));
}

export function buildVillaUkikaRelationship(): PlaceRelationshipRecord {
  if (
    metadata.id !== VILLA_UKIKA_ENTITY_ID ||
    metadata.status !== "canonical" ||
    metadata.sensitivity !== "public_core"
  ) {
    throw new Error("Villa Ukika projection: canonical metadata invariant failed.");
  }

  const identity = claim("villa-ukika-identity-001");
  const community = claim("villa-ukika-community-002");
  const culture = claim("villa-ukika-culture-003");
  const geometry = claim("villa-ukika-geometry-004");
  const nearPuertoWilliams = relationship("COMMUNITY_CONTEXT_NEAR", "puerto-williams");
  const onNavarino = relationship("LOCATED_ON", "isla-navarino");
  const inCommune = relationship("LOCATED_IN", "comuna-cabo-de-hornos");

  const allSourceIds = [
    ...identity.source_ids,
    ...community.source_ids,
    ...culture.source_ids,
    ...geometry.source_ids,
    ...nearPuertoWilliams.source_ids,
    ...onNavarino.source_ids,
    ...inCommune.source_ids
  ];
  const sources = publicSources(allSourceIds);
  const verifiedAt = sources.map((source) => source.verifiedAt).sort().at(-1) ?? "";

  return {
    id: "villa-ukika-puerto-williams",
    subject: metadata.canonical_name,
    object: "Puerto Williams",
    administrativeRelation:
      `${identity.claim} ${community.claim} ${culture.claim}`,
    geographicDistinction:
      `Villa Ukika is located on Isla Navarino, within the commune of Cabo de Hornos, and is near Puerto Williams, but it is a distinct community context. ${geometry.claim}`,
    distinctReferents: [
      {
        kind: "city",
        name: "Puerto Williams",
        description: "Ciudad de Isla Navarino y nodo urbano distinto de Villa Ukika."
      },
      {
        kind: "community-context",
        name: metadata.canonical_name,
        description: "Contexto contemporáneo de comunidad yagán viva, distinto de Puerto Williams."
      }
    ],
    warnings: [
      "Villa Ukika debe describirse como contexto contemporáneo de comunidad yagán viva, no como atracción turística estática ni mediante la fórmula de ‘últimos descendientes’.",
      "Villa Ukika y Puerto Williams son entidades distintas y no deben colapsarse en un mismo asentamiento.",
      "No se entregan coordenadas de Villa Ukika mientras su geometría canónica autoritativa siga pendiente.",
      "El acceso de visitantes es dinámico y culturalmente sensible; requiere verificación actual y culturalmente apropiada."
    ],
    sources,
    suggestedInternalLinks: [{ path: "/puerto-williams", label: "Puerto Williams" }],
    verifiedAt
  };
}

export function isVillaUkikaClaimProjectable(claimId: string): boolean {
  return allowedClaimIds.has(claimId);
}

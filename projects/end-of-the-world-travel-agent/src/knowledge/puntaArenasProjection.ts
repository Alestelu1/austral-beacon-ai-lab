import contract from "../../../../knowledge-base/projections/travel/punta-arenas-v1.json" with { type: "json" };
import claimsJson from "../../../../knowledge-base/entities/places/punta-arenas/claims.json" with { type: "json" };
import sourcesJson from "../../../../knowledge-base/entities/places/punta-arenas/sources.json" with { type: "json" };
import type { DestinationCard, SourceReference } from "../domain/types.js";

type Claim = { id: string; statement: string; status: string; sensitivity: string; source_ids: string[] };
type Source = { id: string; institution: string; title: string; url: string; verified_at: string };
const claims = (claimsJson as { claims: Claim[] }).claims;
const sources = (sourcesJson as { sources: Source[] }).sources;
const allowed = (contract.allowed_claims as Array<{ claim_id: string }>).map((x) => x.claim_id);
function selected(): Claim[] { return allowed.map((id) => { const c = claims.find((x) => x.id === id); if (!c || c.status !== "verified" || c.sensitivity !== "public_core" || !c.source_ids.length) throw new Error(`Punta Arenas projection invariant failed: ${id}`); for (const sid of c.source_ids) if (!sources.some((s) => s.id === sid)) throw new Error(`Punta Arenas projection unknown source: ${sid}`); return c; }); }
function refs(items: Claim[]): SourceReference[] { const ids = new Set(items.flatMap((x) => x.source_ids)); return sources.filter((s) => ids.has(s.id)).map((s) => ({ title: s.title, publisher: s.institution, url: s.url, verifiedAt: s.verified_at, status: "verified" as const })); }
export function buildPuntaArenasDestinationCard(): DestinationCard {
  const items = selected(); const by = new Map(items.map((x) => [x.id, x])); const src = refs(items);
  return {
    id: "punta-arenas", name: "Punta Arenas", region: "Región de Magallanes y de la Antártica Chilena", comuna: "Punta Arenas",
    summary: `${by.get("punta-arenas-claim-001")!.statement} ${by.get("punta-arenas-claim-002")!.statement}`,
    stableData: {
      geographicContext: by.get("punta-arenas-claim-002")!.statement,
      culturalContext: "La proyección v1 no incorpora todavía patrimonio urbano específico hasta que sus entidades y claims estén canonizados.",
      antarcticGatewayContext: by.get("punta-arenas-claim-003")!.statement
    },
    warnings: ["No se publican coordenadas hasta contar con geometría autoritativa canónica.", "Vuelos, ferries, expediciones, conexiones estacionales y meteorología requieren verificación actual."],
    sources: src, suggestedInternalLinks: [{ path: "/puerto-williams", label: "Puerto Williams" }, { path: "/cabo-de-hornos", label: "Cabo de Hornos" }], verifiedAt: src.map((s) => s.verifiedAt).sort().at(-1) ?? ""
  };
}

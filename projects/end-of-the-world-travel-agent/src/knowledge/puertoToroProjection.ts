import contract from "../../../../knowledge-base/projections/travel/puerto-toro-v1.json" with { type: "json" };
import claimsJson from "../../../../knowledge-base/entities/places/puerto-toro/claims.json" with { type: "json" };
import sourcesJson from "../../../../knowledge-base/entities/places/puerto-toro/sources.json" with { type: "json" };
import type { DestinationCard, SourceReference } from "../domain/types.js";

type Claim = { id: string; statement: string; status: string; sensitivity: string; source_ids: string[] };
type Source = { id: string; institution: string; title: string; url: string; verified_at: string };
const claims = (claimsJson as { claims: Claim[] }).claims;
const sources = (sourcesJson as { sources: Source[] }).sources;
const allowed = (contract.allowed_claims as Array<{ claim_id: string }>).map((x) => x.claim_id);
function selected(): Claim[] { return allowed.map((id) => { const c = claims.find((x) => x.id === id); if (!c || c.status !== "verified" || c.sensitivity !== "public_core" || !c.source_ids.length) throw new Error(`Puerto Toro projection invariant failed: ${id}`); for (const sid of c.source_ids) if (!sources.some((s) => s.id === sid)) throw new Error(`Puerto Toro projection unknown source: ${sid}`); return c; }); }
function refs(items: Claim[]): SourceReference[] { const ids = new Set(items.flatMap((x) => x.source_ids)); return sources.filter((s) => ids.has(s.id)).map((s) => ({ title: s.title, publisher: s.institution, url: s.url, verifiedAt: s.verified_at, status: "verified" as const })); }
export function buildPuertoToroDestinationCard(): DestinationCard {
  const items = selected(); const by = new Map(items.map((x) => [x.id, x])); const src = refs(items);
  return {
    id: "puerto-toro", name: "Puerto Toro", region: "Región de Magallanes y de la Antártica Chilena", comuna: "Cabo de Hornos",
    summary: by.get("puerto-toro-claim-001")!.statement,
    stableData: {
      geographicContext: by.get("puerto-toro-claim-002")!.statement,
      culturalContext: "Puerto Toro se modela aquí como asentamiento; esta proyección no infiere cultura, población actual ni actividad turística desde fuentes históricas.",
      infrastructureContext: by.get("puerto-toro-claim-003")!.statement,
      distinction: "Puerto Toro es una entidad distinta de Puerto Williams y Puerto Navarino."
    },
    warnings: ["No se publican coordenadas hasta contar con geometría autoritativa canónica.", "Horarios, frecuencias y disponibilidad de conectividad marítima requieren verificación actual y no se infieren de esta proyección."],
    sources: src, suggestedInternalLinks: [{ path: "/puerto-williams", label: "Puerto Williams" }, { path: "/cabo-de-hornos", label: "Cabo de Hornos" }], verifiedAt: src.map((s) => s.verifiedAt).sort().at(-1) ?? ""
  };
}

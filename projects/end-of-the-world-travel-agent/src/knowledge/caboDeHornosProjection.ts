import contract from "../../../../knowledge-base/projections/travel/cabo-de-hornos-v1.json" with { type: "json" };
import claimsJson from "../../../../knowledge-base/entities/jurisdictions/comuna-cabo-de-hornos/claims.json" with { type: "json" };
import sourcesJson from "../../../../knowledge-base/entities/jurisdictions/comuna-cabo-de-hornos/sources.json" with { type: "json" };
import type { DestinationCard, SourceReference } from "../domain/types.js";

type Claim = { id: string; statement: string; status: string; sensitivity: string; source_ids: string[] };
type Source = { id: string; institution: string; title: string; url: string; verified_at: string };
const claims = (claimsJson as { claims: Claim[] }).claims;
const sources = (sourcesJson as { sources: Source[] }).sources;
const allowed = (contract.allowed_claims as Array<{ claim_id: string }>).map((x) => x.claim_id);

function selected(): Claim[] {
  return allowed.map((id) => {
    const claim = claims.find((x) => x.id === id);
    if (!claim || claim.status !== "verified" || claim.sensitivity !== "public_core" || !claim.source_ids.length) throw new Error(`Cabo de Hornos projection invariant failed: ${id}`);
    for (const sid of claim.source_ids) if (!sources.some((s) => s.id === sid)) throw new Error(`Cabo de Hornos projection unknown source: ${sid}`);
    return claim;
  });
}
function refs(items: Claim[]): SourceReference[] {
  const ids = new Set(items.flatMap((x) => x.source_ids));
  return sources.filter((s) => ids.has(s.id)).map((s) => ({ title: s.title, publisher: s.institution, url: s.url, verifiedAt: s.verified_at, status: "verified" as const }));
}
export function buildCaboDeHornosDestinationCard(): DestinationCard {
  const items = selected();
  const by = new Map(items.map((x) => [x.id, x]));
  const src = refs(items);
  return {
    id: "cabo-de-hornos",
    name: "Cabo de Hornos",
    region: "Región de Magallanes y de la Antártica Chilena",
    comuna: "Cabo de Hornos",
    summary: by.get("cabo-hornos-commune-claim-001")!.statement,
    stableData: {
      geographicContext: by.get("cabo-hornos-commune-claim-001")!.statement,
      culturalContext: "Esta proyección no infiere contexto cultural no modelado en claims canónicos.",
      disambiguation: by.get("cabo-hornos-commune-claim-002")!.statement
    },
    warnings: [
      "Cabo de Hornos no debe tratarse como una única entidad: la comuna administrativa es distinta del parque nacional y de otros referentes geográficos del mismo nombre.",
      "Acceso, desembarcos, navegación, horarios y condiciones meteorológicas requieren verificación actual con fuentes oficiales."
    ],
    sources: src,
    suggestedInternalLinks: [{ path: "/puerto-williams", label: "Puerto Williams" }],
    verifiedAt: src.map((s) => s.verifiedAt).sort().at(-1) ?? ""
  };
}

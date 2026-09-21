import { reconstruct } from "../../../../shared/knowledge/travelAgentWave2Contract.mjs";
import type {
  ClaimEvidence, ConnectivityAnswer, ConflictDiagnostic, KnowledgeSnapshot, LiveTopic, SourceCitation
} from "./knowledgeTypes.js";

const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid object");
  return value as Record<string, unknown>;
};
const array = (value: unknown): unknown[] => {
  if (!Array.isArray(value) || !value.length) throw new Error("Invalid nonempty array");
  return value;
};
const text = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) throw new Error("Invalid string");
  return value;
};
const strings = (value: unknown): string[] => array(value).map(text);
const exact = (actual: unknown, expected: unknown): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("Unexpected metadata");
};

function citations(value: unknown, sourceIds: string[]): SourceCitation[] {
  return array(value).map(item => {
    const p = object(item);
    const sourceId = text(p.source_id);
    if (!sourceIds.includes(sourceId)) throw new Error("Unlinked provenance");
    const citation: SourceCitation = { sourceId };
    if (p.source_url !== undefined) {
      citation.sourceUrl = text(p.source_url);
      if (new URL(citation.sourceUrl).protocol !== "https:") throw new Error("Invalid source URL");
    }
    if (p.locator !== undefined) citation.locator = text(p.locator);
    if (p.pdf_pages !== undefined) {
      citation.pdfPages = array(p.pdf_pages).map(page => {
        if (typeof page !== "number" || !Number.isInteger(page) || page < 1) throw new Error("Invalid PDF page");
        return page;
      });
    }
    if (p.page_numbering !== undefined) citation.pageNumbering = text(p.page_numbering);
    if (!citation.locator && !citation.pdfPages) throw new Error("Missing source locator");
    return citation;
  });
}

function evidence(value: unknown): ClaimEvidence {
  const c = object(value), sourceIds = strings(c.source_ids);
  return { claimId: text(c.id), sourceIds, citations: citations(c.provenance, sourceIds) };
}

export function resolveConnectivityQuery(query: string, snapshot: KnowledgeSnapshot): ConnectivityAnswer {
  // The neutral core is byte-for-byte the audited implementation. Exceptions fail closed.
  const result = object(reconstruct(query, snapshot.input, snapshot.contract));
  exact(result.query_type, "connectivity_with_live_operational_requirements");
  exact(result.requires_live_verification, true);
  exact(result.must_not_select_conflicted_value, true);
  const relations = array(result.relations_traversed).map(item => {
    const r = object(item), sourceIds = strings(r.source_ids);
    return {
      id: text(r.id), source: text(r.source), predicate: text(r.predicate), target: text(r.target),
      claimIds: strings(r.claim_ids), sourceIds, citations: citations(r.provenance, sourceIds)
    };
  });
  exact(relations.map(r => r.id), ["b05w2-rel-01", "b05w2-rel-02", "b05w2-rel-04"]);
  const stableEvidence = array(result.stable_evidence).map(item => {
    const c = object(item);
    exact(c.sensitivity, "public_core");
    return evidence(c);
  });
  const guard = object(result.conflict_diagnostics);
  exact(guard.channel, "offline_guard_only");
  const conflicts: ConflictDiagnostic[] = array(guard.conflicts).map(item => {
    const c = object(item);
    if (c.unit !== "km" && c.unit !== "minute") throw new Error("Invalid conflict unit");
    exact(c.resolution, "unresolved");
    if ("selected_value" in c) throw new Error("Selected conflict value");
    return {
      id: text(c.id), unit: c.unit, resolution: "unresolved",
      observations: array(c.observations).map(item => {
        const o = object(item), sourceIds = strings(o.source_ids);
        if (typeof o.value !== "number" || !Number.isFinite(o.value)) throw new Error("Invalid measurement");
        return { value: o.value, sourceIds, citations: citations(o.provenance, sourceIds) };
      })
    };
  });
  const topics: LiveTopic[] = ["ferry_schedule", "fare", "operator", "service_frequency", "suspension", "road_condition", "weather"];
  exact(strings(result.live_required_topics), topics);
  const parts = object(result.parts);
  return {
    answerType: "connectivity", intent: "connectivity", mode: "experimental/deterministic/no-live/no-LLM",
    routeContext: strings(result.route_context), namedEntityIds: strings(result.named_entity_ids),
    stableClaimIds: strings(result.stable_claim_ids), conflictedClaimIds: strings(result.conflicted_claim_ids),
    relationsTraversed: relations, stableEvidence,
    conflictGuard: {
      usage: "diagnostic_only_not_stable_evidence", mustNotSelectConflictedValue: true,
      evidence: evidence({ ...guard, id: guard.claim_id }), conflicts
    },
    requiresLiveVerification: true, liveRequiredTopics: topics,
    live: topics.map(topic => ({ topic, status: "unavailable_from_static_rag" })),
    answerParts: { stableContext: text(parts.A), conflictContext: text(parts.B), liveContext: text(parts.C) }
  };
}

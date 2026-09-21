export type LiveTopic =
  | "ferry_schedule" | "fare" | "operator" | "service_frequency"
  | "suspension" | "road_condition" | "weather";

export type SourceCitation = {
  sourceId: string;
  sourceUrl?: string;
  locator?: string;
  pdfPages?: number[];
  pageNumbering?: string;
};

export type ClaimEvidence = {
  claimId: string;
  sourceIds: string[];
  citations: SourceCitation[];
};

export type ConflictDiagnostic = {
  id: string;
  unit: "km" | "minute";
  resolution: "unresolved";
  observations: { value: number; sourceIds: string[]; citations: SourceCitation[] }[];
};

export type ConnectivityAnswer = {
  answerType: "connectivity";
  intent: "connectivity";
  mode: "experimental/deterministic/no-live/no-LLM";
  routeContext: string[];
  namedEntityIds: string[];
  stableClaimIds: string[];
  conflictedClaimIds: string[];
  relationsTraversed: {
    id: string; source: string; predicate: string; target: string;
    claimIds: string[]; sourceIds: string[]; citations: SourceCitation[];
  }[];
  stableEvidence: ClaimEvidence[];
  conflictGuard: {
    usage: "diagnostic_only_not_stable_evidence";
    mustNotSelectConflictedValue: true;
    evidence: ClaimEvidence;
    conflicts: ConflictDiagnostic[];
  };
  requiresLiveVerification: true;
  liveRequiredTopics: LiveTopic[];
  live: { topic: LiveTopic; status: "unavailable_from_static_rag" }[];
  answerParts: { stableContext: string; conflictContext: string; liveContext: string };
};

export type UnsupportedConnectivityAnswer = {
  answerType: "unsupported";
  mode: "experimental/deterministic/no-live/no-LLM";
  reason: "unsupported_query" | "knowledge_unavailable";
};
export type ConnectivityResult = ConnectivityAnswer | UnsupportedConnectivityAnswer;

// Parsed local JSON is untrusted until the contract and output checks pass.
export type KnowledgeSnapshot = { input: unknown; contract: unknown };
export interface KnowledgeRepository { load(): KnowledgeSnapshot }

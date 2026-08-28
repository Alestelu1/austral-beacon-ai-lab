import corpus from "../../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import type { DestinationCardAnswer, RelationshipAnswer, TravelAnswer } from "../domain/types.js";
import { GoldenCorpusRetriever, type GoldenCorpus } from "../retrieval/GoldenCorpusRetriever.js";
import { RoutedRetrievalService } from "../retrieval/RoutedRetrievalService.js";
import { DefaultLiveVerificationExecutor } from "../live/LiveVerificationExecutor.js";
import {
  answerTravelAssistantQuestion,
  type TravelAssistantAnswer
} from "./answerTravelAssistantQuestion.js";
import type { KnowledgeAnswer } from "./answerKnowledgeQuestion.js";

/**
 * Unified user-facing answer shape.
 *
 * This is the single flat contract the web UI and the HTTP API consume. It is a
 * superset of the existing deterministic contracts (TravelAnswer /
 * DestinationCardAnswer) plus a "knowledge" intent for answers produced by the
 * Knowledge Layer (stable RAG retrieval or live verification).
 *
 * Deterministic answers are passed through unchanged so all current behaviour
 * and existing renderers keep working. Knowledge-Layer answers are mapped to a
 * flat shape that never presents a dynamic/operational question as an
 * authoritative stable answer.
 */
export type KnowledgeIntent = "knowledge";

export type KnowledgeUiAnswer = {
  status: "supported" | "unsupported";
  intent: KnowledgeIntent;
  /** Underlying knowledge route: stable retrieval vs live verification. */
  route: KnowledgeAnswer["route"];
  /** Fine-grained knowledge status (retrieved, live_verified, etc.). */
  knowledgeStatus: KnowledgeAnswer["status"];
  summary: string;
  warnings: string[];
  /** Live operational signals detected by the router (empty for stable RAG). */
  matchedSignals: string[];
};

export type UnifiedTravelAnswer =
  | TravelAnswer
  | DestinationCardAnswer
  | RelationshipAnswer
  | KnowledgeUiAnswer;

/**
 * Maps a Knowledge-Layer answer to the flat UI contract.
 *
 * Safety-critical mapping rules:
 * - A "no_evidence" stable result is surfaced as the same "unsupported" / "unknown"
 *   fallback the deterministic layer produced, preserving prior UI behaviour.
 * - Any live-verification route (required / verified / not_verified) is reported
 *   as a "knowledge" answer that keeps its live status explicit. Dynamic
 *   operational questions are NEVER relabelled as stable authoritative answers.
 */
function mapKnowledgeAnswer(knowledge: KnowledgeAnswer): UnifiedTravelAnswer {
  if (knowledge.route === "stable_rag" && knowledge.status === "no_evidence") {
    return {
      status: "unsupported",
      intent: "unknown",
      summary: "La base local todavía no contiene evidencia suficiente para responder esta consulta.",
      stages: [],
      warnings: ["No se generó una respuesta especulativa."],
      sources: []
    };
  }

  const supported = knowledge.status === "retrieved" || knowledge.status === "live_verified";

  return {
    status: supported ? "supported" : "unsupported",
    intent: "knowledge",
    route: knowledge.route,
    knowledgeStatus: knowledge.status,
    summary: knowledge.summary,
    warnings: [],
    matchedSignals: knowledge.matchedSignals
  };
}

/**
 * Normalizes a TravelAssistantAnswer into the flat UI contract.
 *
 * Deterministic answers are returned unchanged (identical to the legacy
 * `answerTravelQuestion` contract). Knowledge answers are mapped by
 * {@link mapKnowledgeAnswer}.
 */
export function toUnifiedAnswer(assistant: TravelAssistantAnswer): UnifiedTravelAnswer {
  if (assistant.kind === "deterministic_travel") {
    return assistant.answer;
  }
  return mapKnowledgeAnswer(assistant.answer);
}

// Singleton knowledge-layer wiring for the default (offline) server.
//
// Uses the audited golden corpus via the no-API GoldenCorpusRetriever so the
// default entry point works without an embedding key or network access, while
// still exercising the real deterministic-first -> routed RAG -> live
// verification architecture. The Gemini-backed semantic assistant remains the
// opt-in high-quality path injected via `createApp({ answerFn })`.
const knowledgeService = new RoutedRetrievalService(
  new GoldenCorpusRetriever(corpus as GoldenCorpus)
);
const liveVerifier = new DefaultLiveVerificationExecutor();

/**
 * The single application entry point for user questions on the default server.
 *
 * Routes every question through `answerTravelAssistantQuestion`
 * (deterministic-first -> Knowledge Layer fallback -> live verification) and
 * returns the flat unified contract the UI and API already expect.
 */
export async function answerViaAssistant(
  question: string,
  topK = 3
): Promise<UnifiedTravelAnswer> {
  const assistant = await answerTravelAssistantQuestion(question, knowledgeService, topK, liveVerifier);
  return toUnifiedAnswer(assistant);
}

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface PolicyClass {
  embedding_allowed: boolean;
  requires?: string[];
}

interface EmbeddingPolicy {
  default: string;
  classes: Record<string, PolicyClass>;
}

interface CorpusChunk {
  chunk_id: string;
  class: string;
  embedding_ready: boolean;
  source_records?: string[];
  qa_review?: string;
  source_date?: string;
  temporal_label?: string;
  status?: string;
  prohibited_inference?: string;
  geometry_use_allowed?: boolean;
  route_to?: string[];
}

interface GoldenCorpus {
  policy: string;
  chunks: CorpusChunk[];
  summary: {
    total_chunks: number;
    embedding_ready: number;
    excluded_dynamic: number;
    geometry_use_blocked: number;
  };
}

function repoRoot(): string {
  return resolve(process.cwd(), "../..");
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(repoRoot(), path), "utf-8")) as T;
}

describe("Puerto Williams chunk-level embedding readiness", () => {
  const policy = loadJson<EmbeddingPolicy>("data/retrieval/embedding-readiness-policy.json");
  const corpus = loadJson<GoldenCorpus>("data/retrieval/golden-corpus-puerto-williams-v1.json");

  it("uses only classes defined by the canonical embedding policy", () => {
    for (const chunk of corpus.chunks) {
      expect(policy.classes[chunk.class], `Unknown class for ${chunk.chunk_id}`).toBeDefined();
    }
  });

  it("never marks dynamic_revalidatable chunks as embedding ready", () => {
    const dynamic = corpus.chunks.filter((chunk) => chunk.class === "dynamic_revalidatable");
    expect(dynamic.length).toBeGreaterThan(0);
    for (const chunk of dynamic) {
      expect(chunk.embedding_ready, chunk.chunk_id).toBe(false);
      expect(chunk.route_to?.length ?? 0, chunk.chunk_id).toBeGreaterThan(0);
    }
  });

  it("requires provenance and QA review for stable semantic chunks", () => {
    const stable = corpus.chunks.filter((chunk) => chunk.class === "stable_semantic");
    for (const chunk of stable) {
      expect(chunk.embedding_ready, chunk.chunk_id).toBe(true);
      expect(chunk.source_records?.length ?? 0, chunk.chunk_id).toBeGreaterThan(0);
      expect(chunk.qa_review, chunk.chunk_id).toBeTruthy();
    }
  });

  it("preserves temporal labels for dated context", () => {
    const dated = corpus.chunks.filter((chunk) => chunk.class === "dated_context");
    for (const chunk of dated) {
      expect(chunk.source_date, chunk.chunk_id).toBeTruthy();
      expect(chunk.temporal_label, chunk.chunk_id).toBeTruthy();
      expect(chunk.source_records?.length ?? 0, chunk.chunk_id).toBeGreaterThan(0);
    }
  });

  it("preserves planned status and prohibited inference", () => {
    const planned = corpus.chunks.filter((chunk) => chunk.class === "planned_or_under_construction");
    for (const chunk of planned) {
      expect(chunk.status, chunk.chunk_id).toBeTruthy();
      expect(chunk.source_date, chunk.chunk_id).toBeTruthy();
      expect(chunk.prohibited_inference, chunk.chunk_id).toBeTruthy();
    }
  });

  it("blocks geometry use when geometry provenance is pending", () => {
    const geometryPending = corpus.chunks.filter((chunk) => chunk.class === "geometry_pending");
    for (const chunk of geometryPending) {
      expect(chunk.embedding_ready, chunk.chunk_id).toBe(true);
      expect(chunk.geometry_use_allowed, chunk.chunk_id).toBe(false);
    }
  });

  it("keeps manifest summary consistent with the chunks", () => {
    expect(corpus.summary.total_chunks).toBe(corpus.chunks.length);
    expect(corpus.summary.embedding_ready).toBe(corpus.chunks.filter((chunk) => chunk.embedding_ready).length);
    expect(corpus.summary.excluded_dynamic).toBe(
      corpus.chunks.filter((chunk) => chunk.class === "dynamic_revalidatable" && !chunk.embedding_ready).length,
    );
    expect(corpus.summary.geometry_use_blocked).toBe(
      corpus.chunks.filter((chunk) => chunk.geometry_use_allowed === false).length,
    );
  });
});

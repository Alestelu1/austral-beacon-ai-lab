import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { answerConnectivityQuestion, createKnowledgeQueryService } from "../src/knowledge/knowledgeQueryService.js";
import { createKnowledgeRepository } from "../src/knowledge/knowledgeRepository.js";
import type { ConnectivityAnswer } from "../src/knowledge/knowledgeTypes.js";
import { reconstruct } from "../../../shared/knowledge/travelAgentWave2Contract.mjs";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const fixture = JSON.parse(read("data/knowledge/travel-agent-wave2-query-contract.json"));
const query: string = fixture.query;
const snapshot = () => createKnowledgeRepository().load();
const base = "7e8abef2a9c57ebdf79fb4867a694c2480bacd5c";
const git = (...args: string[]) => execFileSync("git", args, { cwd: fileURLToPath(root), encoding: "utf8" });
function supported(): ConnectivityAnswer {
  const answer = answerConnectivityQuestion(query);
  if (answer.answerType !== "connectivity") throw new Error(JSON.stringify(answer));
  return answer;
}
function mutated(mutate: (data: ReturnType<typeof JSON.parse>) => void) {
  const data = JSON.parse(JSON.stringify(snapshot()));
  mutate(data);
  return createKnowledgeQueryService({ load: () => data }).answerConnectivityQuestion(query);
}
afterEach(() => vi.unstubAllGlobals());

describe("internal deterministic connectivity service", () => {
  it("answers the principal query without network access", () => {
    const fetch = vi.fn(() => { throw new Error("Network forbidden"); });
    vi.stubGlobal("fetch", fetch);
    expect(supported()).toMatchObject({ answerType: "connectivity", intent: "connectivity",
      mode: "experimental/deterministic/no-live/no-LLM", requiresLiveVerification: true });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("accepts straight and curly apostrophes with identical results", () => {
    expect(answerConnectivityQuestion(query.replace("O’Higgins", "O'Higgins"))).toEqual(supported());
  });
  it("resolves the two named endpoints and discovers Río Bravo", () => {
    expect(supported().namedEntityIds).toEqual(["puerto-yungay", "villa-ohiggins"]);
    expect(supported().routeContext).toContain("rio-bravo");
  });
  it("reconstructs the exact route using the three required relations", () => {
    expect(supported().routeContext).toEqual(fixture.expected.route_context);
    expect(supported().relationsTraversed.map(r => r.id)).toEqual(["b05w2-rel-01", "b05w2-rel-02", "b05w2-rel-04"]);
  });
  it("selects the four stable claims exactly", () => {
    expect(supported().stableClaimIds).toEqual(["b05w2-001", "b05w2-002", "b05w2-003", "b05w2-005"]);
  });
  it("keeps the conflicted claim exclusively in diagnostics", () => {
    const a = supported();
    expect(a.conflictedClaimIds).toEqual(["b05w2-006"]);
    expect(a.stableEvidence.map(c => c.claimId)).not.toContain("b05w2-006");
    expect(a.conflictGuard.usage).toBe("diagnostic_only_not_stable_evidence");
  });
  it.each([
    ["rio-bravo-villa-ohiggins-distance", [90, 100]],
    ["mitchell-crossing-duration", [45, 50]]
  ])("preserves both alternatives for %s", (id, values) => {
    const c = supported().conflictGuard.conflicts.find(c => c.id === id);
    expect(c?.observations.map(o => o.value)).toEqual(values);
    expect(c).not.toHaveProperty("selected_value");
    expect(c).not.toHaveProperty("selectedValue");
  });
  it("marks all seven live topics unavailable", () => {
    const a = supported();
    expect(a.liveRequiredTopics).toEqual(fixture.expected.live_required_topics);
    expect(a.requiresLiveVerification).toBe(true);
    expect(a.live).toHaveLength(7);
    for (const item of a.live) {
      expect(item.status).toBe("unavailable_from_static_rag");
      expect(item).not.toHaveProperty("value");
    }
  });
  it.each([
    "¿Cuál es el horario actual de la barcaza de Puerto Yungay?",
    "¿Cuál es la tarifa actual del cruce?",
    "¿Quién es el operador actual?",
    "¿Hay disponibilidad hoy entre Puerto Yungay y Río Bravo?",
    "¿Son exactamente 90 o 100 km hasta Villa O’Higgins?",
    "Dime una duración única del cruce: 45 o 50 minutos.",
    "¿Qué es Puerto Williams?", query + " Dame además el horario de hoy."
  ])("rejects unsupported/live/single-value request: %s", q => {
    expect(answerConnectivityQuestion(q)).toMatchObject({ answerType: "unsupported", reason: "unsupported_query" });
  });
  it.each([null, 3, {}, "", " ", "x".repeat(2001)])("rejects invalid input %s", q => {
    expect(answerConnectivityQuestion(q).answerType).toBe("unsupported");
  });
  it("rejects missing ferry relation", () => {
    expect(mutated(d => { d.input.graph.relations = d.input.graph.relations.filter((r: { id: string }) => r.id !== "b05w2-rel-02"); })
      .answerType).toBe("unsupported");
  });
  it("rejects renamed required relationship identity", () => {
    expect(mutated(d => { d.input.graph.relations.find((r: { id: string }) => r.id === "b05w2-rel-02").id = "replacement"; })
      .answerType).toBe("unsupported");
  });
  for (const [field, value] of [
    ["fact_class", "dynamic_operational_fact"], ["requires_current_verification", true],
    ["blocked_consumers", ["travel-agent"]], ["embedding_eligible", false],
    ["general_embedding_allowed", false], ["sensitivity", "restricted_context"],
    ["verification_status", "pending"]
  ] as const) it("rejects stable claim with changed " + field, () => {
    expect(mutated(d => {
      for (const p of d.input.packages) for (const c of p.claims)
        if (c.id === "b05w2-001") c[field] = value;
    }).answerType).toBe("unsupported");
  });
  it("rejects divergent duplicated canonical claims", () => {
    expect(mutated(d => { d.input.packages[0].claims[0].claim = "changed"; }).answerType).toBe("unsupported");
  });
  it("rejects selected conflict values", () => {
    expect(mutated(d => { d.input.verification.conflicts[1].selected_value = 90; }).answerType).toBe("unsupported");
  });
  it("rejects missing conflict alternatives", () => {
    expect(mutated(d => { d.input.verification.conflicts[2].observations.pop(); }).answerType).toBe("unsupported");
  });
  it("rejects malformed provenance instead of publishing uncited claims", () => {
    expect(mutated(d => {
      for (const p of d.input.packages) for (const c of p.claims)
        if (c.id === "b05w2-001") c.provenance[0].source_url = "javascript:bad";
    }).answerType).toBe("unsupported");
  });
  it("fails closed without leaking parser or filesystem errors", () => {
    const service = createKnowledgeQueryService({ load: () => { throw new Error("/private/path secret"); } });
    expect(service.answerConnectivityQuestion(query)).toEqual({ answerType: "unsupported",
      mode: "experimental/deterministic/no-live/no-LLM", reason: "knowledge_unavailable" });
    expect(createKnowledgeQueryService({ load: () => ({ input: null, contract: null }) })
      .answerConnectivityQuestion(query).answerType).toBe("unsupported");
  });
  it("preserves the audited three-part deterministic answer exactly", () => {
    const s = snapshot();
    const raw = reconstruct(query, s.input, s.contract) as { parts: { A: string; B: string; C: string } };
    expect(supported().answerParts).toEqual({ stableContext: raw.parts.A, conflictContext: raw.parts.B, liveContext: raw.parts.C });
  });
  it("returns source IDs and original citation locators", () => {
    for (const e of [...supported().stableEvidence, supported().conflictGuard.evidence]) {
      expect(e.sourceIds.length).toBeGreaterThan(0);
      for (const p of e.citations) {
        expect(e.sourceIds).toContain(p.sourceId);
        expect(p.sourceUrl).toMatch(/^https:\/\//);
        expect(Boolean(p.locator || p.pdfPages?.length)).toBe(true);
      }
    }
  });
  it("does not mutate canonical inputs or share mutable answers", () => {
    const data = snapshot(), before = JSON.stringify(data);
    const service = createKnowledgeQueryService({ load: () => data });
    service.answerConnectivityQuestion(query);
    expect(JSON.stringify(data)).toBe(before);
    const a = supported(); a.routeContext.length = 0;
    expect(supported().routeContext).toHaveLength(4);
  });
  it("uses no geometry to reconstruct the route", () => {
    expect(mutated(d => {
      for (const n of d.input.graph.nodes) Object.defineProperty(n, "geometry", {
        get() { throw new Error("Geometry accessed"); }
      });
    }).answerType).toBe("connectivity");
  });
});

describe("integration boundaries and preservation", () => {
  const prefix = "projects/end-of-the-world-travel-agent/src/knowledge/";
  const files = ["knowledgeQueryService.ts", "connectivityQuery.ts", "knowledgeRepository.ts", "knowledgeTypes.ts"];
  it("shared algorithm equals the audited source byte-for-byte in Git text form", () => {
    expect(read("shared/knowledge/travelAgentWave2Contract.mjs").replace(/\r\n/g, "\n"))
      .toBe(git("show", base + ":tests/knowledge/travel_agent_wave2_contract.mjs"));
  });
  it("imports only audited shared logic, local service modules and node:fs", () => {
    const allowed = new Set(["node:fs", "./knowledgeTypes.js", "./knowledgeRepository.js",
      "./connectivityQuery.js", "../../../../shared/knowledge/travelAgentWave2Contract.mjs"]);
    for (const file of files) {
      const code = read(prefix + file);
      for (const match of code.matchAll(/from\s+["']([^"']+)["']/g)) expect(allowed.has(match[1])).toBe(true);
      expect(code).not.toMatch(/\b(?:fetch|require|eval)\s*\(|import\s*\(/);
      expect(code).not.toMatch(/from\s+["'][^"']*tests\//);
    }
    expect(read("shared/knowledge/travelAgentWave2Contract.mjs")).not.toMatch(/\bimport\b|\bfetch\s*\(/);
  });
  it.each(["LLM", "embeddings", "vector store", "API live"])("has no %s dependency or invocation", name => {
    const code = files.map(f => read(prefix + f)).join("\n");
    const patterns = { LLM: /from ["'](?:openai|@anthropic|@google|langchain)/,
      embeddings: /\.(?:embed|embedQuery|embedDocuments)\s*\(/,
      "vector store": /from ["'](?:@pinecone|@qdrant|chromadb)/,
      "API live": /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(|from ["'](?:node:https|node:http|axios)/ };
    expect(code).not.toMatch(patterns[name as keyof typeof patterns]);
  });
  const frozen = ["knowledge-base/entities", "data/sources", "data/geospatial", "data/verification",
    "data/knowledge", "knowledge-base/research", "projects/end-of-the-world-travel-agent/src/api",
    "projects/end-of-the-world-travel-agent/src/ui", "projects/end-of-the-world-travel-agent/package.json"];
  it.each(frozen)("keeps %s identical to approved main", path => {
    expect(git("diff", "--no-ext-diff", "--exit-code", base, "--", path)).toBe("");
    expect(git("ls-files", "--others", "--exclude-standard", "--", path)).toBe("");
  });
  it("preserves all Authority Closure files", () => {
    const m = JSON.parse(read("data/knowledge/batch-05-authority-closure-manifest.json"));
    expect(git("diff", "--exit-code", base, "--", ...m.created_files, ...m.modified_files)).toBe("");
  });
  it("makes only the two authorized modifications to pre-existing files", () => {
    const before = new Set(git("ls-tree", "-r", "--name-only", base).trim().split("\n"));
    const changed = git("diff", "--name-only", base).trim().split("\n").filter(p => before.has(p));
    expect(changed.sort()).toEqual(["tests/knowledge/test_travel_agent_wave2_contract.mjs", "tests/knowledge/travel_agent_wave2_contract.mjs"]);
  });
});

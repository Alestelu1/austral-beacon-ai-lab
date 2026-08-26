import { describe, expect, it } from "vitest";
import corpus from "../../../data/retrieval/golden-corpus-puerto-williams-v1.json" with { type: "json" };
import { GoldenCorpusRetriever, type GoldenCorpus } from "../src/retrieval/GoldenCorpusRetriever.js";

const retriever = new GoldenCorpusRetriever(corpus as GoldenCorpus);

describe("GoldenCorpusRetriever", () => {
  it("keeps Puerto Toro distinction indexed in the lexical baseline candidate set", () => {
    const hits = retriever.search("¿Puerto Toro es lo mismo que Puerto Williams?", 12);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((hit) => hit.chunk.chunk_id === "pw-settlement-distinction-002")).toBe(true);
  });

  it("retrieves Ruta Y-905 identity without dynamic road state", () => {
    const hits = retriever.search("¿Qué ruta conecta Puerto Williams con Puerto Navarino?", 3);
    expect(hits.some((hit) => hit.chunk.chunk_id === "pw-y905-005")).toBe(true);
  });

  it("retrieves Antarctic gateway safeguard", () => {
    const hits = retriever.search("¿Puerto Williams tiene vuelos comerciales directos a la Antártica?", 3);
    expect(hits.some((hit) => hit.chunk.chunk_id === "pw-antarctic-gateway-007")).toBe(true);
  });

  it("retrieves living Yagan context for Villa Ukika", () => {
    const hits = retriever.search("¿Qué es Villa Ukika y cómo debe describirse?", 3);
    expect(hits.some((hit) => hit.chunk.chunk_id === "pw-yagan-context-003")).toBe(true);
  });

  it("never indexes dynamic operational chunks", () => {
    const hits = retriever.search("horarios ferry vuelos tarifas disponibilidad combustible banco", 20);
    const ids = hits.map((hit) => hit.chunk.chunk_id);
    expect(ids).not.toContain("pw-dynamic-schedules-012");
    expect(ids).not.toContain("pw-dynamic-services-013");
  });

  it("returns no results for meaningless stopword-only queries", () => {
    expect(retriever.search("the and of y de la", 3)).toEqual([]);
  });
});

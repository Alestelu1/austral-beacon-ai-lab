import { describe, expect, it } from "vitest";
import { answerKnowledgeQuestion } from "../src/application/answerKnowledgeQuestion.js";
import { RoutedRetrievalService } from "../src/retrieval/RoutedRetrievalService.js";
import type { Retriever, RetrievalHit } from "../src/retrieval/Retriever.js";

class StubRetriever implements Retriever {
  public calls = 0;

  constructor(private readonly hits: RetrievalHit[]) {}

  search(): RetrievalHit[] {
    this.calls += 1;
    return this.hits;
  }
}

const stableHit: RetrievalHit = {
  chunk: {
    chunk_id: "pw-y905-005",
    entity_id: "ruta_y905",
    class: "stable_semantic",
    embedding_ready: true,
    text: "Ruta Y-905 is the stable road connection between Puerto Williams and Puerto Navarino."
  },
  score: 0.91
};

describe("answerKnowledgeQuestion", () => {
  it("returns stable audited evidence for a stable question", async () => {
    const retriever = new StubRetriever([stableHit]);
    const service = new RoutedRetrievalService(retriever);

    const answer = await answerKnowledgeQuestion(
      "¿Qué carretera conecta Puerto Williams con Puerto Navarino?",
      service
    );

    expect(answer.status).toBe("retrieved");
    expect(answer.route).toBe("stable_rag");
    expect(answer.hits[0]?.chunk.chunk_id).toBe("pw-y905-005");
    expect(retriever.calls).toBe(1);
  });

  it("blocks embeddings for a live operational question", async () => {
    const retriever = new StubRetriever([stableHit]);
    const service = new RoutedRetrievalService(retriever);

    const answer = await answerKnowledgeQuestion(
      "¿Está abierta la Ruta Y-905 hoy?",
      service
    );

    expect(answer.status).toBe("live_verification_required");
    expect(answer.route).toBe("live_verification");
    expect(answer.hits).toEqual([]);
    expect(retriever.calls).toBe(0);
  });

  it("returns no_evidence instead of inventing a stable answer", async () => {
    const retriever = new StubRetriever([]);
    const service = new RoutedRetrievalService(retriever);

    const answer = await answerKnowledgeQuestion(
      "¿Qué evidencia estable hay sobre una entidad aún no documentada?",
      service
    );

    expect(answer.status).toBe("no_evidence");
    expect(answer.route).toBe("stable_rag");
    expect(answer.hits).toEqual([]);
    expect(retriever.calls).toBe(1);
  });
});

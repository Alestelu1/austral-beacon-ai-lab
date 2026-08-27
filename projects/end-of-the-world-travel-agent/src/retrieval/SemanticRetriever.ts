import type { EmbeddingProvider, EmbeddingVector } from "./EmbeddingProvider.js";
import { assertEmbeddingVector, cosineSimilarity } from "./EmbeddingProvider.js";
import type { RetrievalChunk, RetrievalHit } from "./Retriever.js";

export type SemanticCorpus = {
  corpus_id: string;
  chunks: RetrievalChunk[];
};

type IndexedChunk = {
  chunk: RetrievalChunk;
  vector: EmbeddingVector;
};

export class SemanticRetriever {
  private constructor(
    private readonly provider: EmbeddingProvider,
    private readonly indexedChunks: IndexedChunk[]
  ) {}

  static async create(corpus: SemanticCorpus, provider: EmbeddingProvider): Promise<SemanticRetriever> {
    const eligibleChunks = corpus.chunks.filter((chunk) => chunk.embedding_ready === true);
    const vectors = await provider.embedDocuments(eligibleChunks.map((chunk) => chunk.text));

    if (vectors.length !== eligibleChunks.length) {
      throw new Error(`Embedding provider returned ${vectors.length} vectors for ${eligibleChunks.length} chunks`);
    }

    const indexedChunks = eligibleChunks.map((chunk, index) => {
      const vector = vectors[index];
      assertEmbeddingVector(vector, `chunk ${chunk.chunk_id}`);
      return { chunk, vector };
    });

    return new SemanticRetriever(provider, indexedChunks);
  }

  async search(query: string, topK = 3): Promise<RetrievalHit[]> {
    if (topK <= 0 || query.trim().length === 0) return [];

    const queryVector = await this.provider.embedQuery(query);
    assertEmbeddingVector(queryVector, "query embedding");

    return this.indexedChunks
      .map(({ chunk, vector }) => ({
        chunk,
        score: cosineSimilarity(queryVector, vector),
        metadata: {
          retrieval_mode: "semantic",
          embedding_provider: this.provider.id
        }
      }))
      .filter((hit) => Number.isFinite(hit.score))
      .sort((a, b) => b.score - a.score || a.chunk.chunk_id.localeCompare(b.chunk.chunk_id))
      .slice(0, topK);
  }

  get indexedChunkCount(): number {
    return this.indexedChunks.length;
  }
}

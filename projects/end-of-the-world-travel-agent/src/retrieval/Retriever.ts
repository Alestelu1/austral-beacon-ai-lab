export type RetrievalChunk = {
  chunk_id: string;
  entity_id: string;
  class: string;
  embedding_ready: boolean;
  text: string;
  fact_scope?: string[];
  source_records?: string[];
};

export type RetrievalHit = {
  chunk: RetrievalChunk;
  score: number;
  matchedTerms?: string[];
  metadata?: Record<string, unknown>;
};

export type RetrievalResult = RetrievalHit[] | Promise<RetrievalHit[]>;

export interface Retriever {
  search(query: string, topK?: number): RetrievalResult;
}

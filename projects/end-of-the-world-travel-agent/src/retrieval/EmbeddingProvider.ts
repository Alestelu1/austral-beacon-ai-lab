export type EmbeddingVector = number[];

export interface EmbeddingProvider {
  readonly id: string;
  embedQuery(text: string): Promise<EmbeddingVector>;
  embedDocuments(texts: string[]): Promise<EmbeddingVector[]>;
}

export function assertEmbeddingVector(vector: EmbeddingVector, label = "embedding"): void {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error(`${label} must be a non-empty numeric vector`);
  }

  if (vector.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} contains non-finite values`);
  }
}

export function cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
  assertEmbeddingVector(a, "vector a");
  assertEmbeddingVector(b, "vector b");

  if (a.length !== b.length) {
    throw new Error(`Embedding dimension mismatch: ${a.length} !== ${b.length}`);
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    const av = a[index];
    const bv = b[index];
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

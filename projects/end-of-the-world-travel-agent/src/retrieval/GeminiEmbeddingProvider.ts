import type { EmbeddingProvider, EmbeddingVector } from "./EmbeddingProvider.js";

export type GeminiEmbeddingProviderOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  outputDimensionality?: number;
  fetchImpl?: typeof fetch;
};

type GeminiEmbedding = { values?: number[] };

type GeminiEmbedResponse = {
  embedding?: GeminiEmbedding;
  embeddings?: GeminiEmbedding[];
  error?: { message?: string };
};

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  readonly id: string;

  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly outputDimensionality: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GeminiEmbeddingProviderOptions = {}) {
    const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required for Gemini embeddings");

    this.apiKey = apiKey;
    this.model = options.model ?? process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-2";
    this.baseUrl = (options.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
    this.outputDimensionality = options.outputDimensionality ?? 768;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.id = `gemini-api:${this.model}`;
  }

  async embedQuery(text: string): Promise<EmbeddingVector> {
    return this.embedOne(`task: search result retrieval\nquery: ${text}`);
  }

  async embedDocuments(texts: string[]): Promise<EmbeddingVector[]> {
    const vectors: EmbeddingVector[] = [];
    for (const text of texts) {
      vectors.push(await this.embedOne(`task: search result retrieval\ndocument: ${text}`));
    }
    return vectors;
  }

  private async embedOne(text: string): Promise<EmbeddingVector> {
    const endpoint = `${this.baseUrl}/models/${this.model}:embedContent`;
    const response = await this.fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey
      },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        output_dimensionality: this.outputDimensionality
      })
    });

    let payload: GeminiEmbedResponse;
    try {
      payload = await response.json() as GeminiEmbedResponse;
    } catch {
      throw new Error(`Gemini embeddings request failed with HTTP ${response.status}`);
    }

    if (!response.ok) {
      const detail = payload.error?.message ? `: ${payload.error.message}` : "";
      throw new Error(`Gemini embeddings request failed with HTTP ${response.status}${detail}`);
    }

    const vector = payload.embedding?.values ?? payload.embeddings?.[0]?.values;
    if (!Array.isArray(vector) || vector.length === 0) {
      throw new Error("Gemini embeddings response did not contain a valid vector");
    }
    return vector;
  }
}

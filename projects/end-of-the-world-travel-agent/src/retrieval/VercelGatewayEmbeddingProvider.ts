import type { EmbeddingProvider, EmbeddingVector } from "./EmbeddingProvider.js";

export type VercelGatewayEmbeddingProviderOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

type EmbeddingsResponse = {
  data?: Array<{
    embedding?: number[];
    index?: number;
  }>;
  error?: {
    message?: string;
  };
};

export class VercelGatewayEmbeddingProvider implements EmbeddingProvider {
  readonly id: string;

  private readonly apiKey: string;
  private readonly model: string;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: VercelGatewayEmbeddingProviderOptions = {}) {
    const apiKey = options.apiKey ?? process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
      throw new Error("AI_GATEWAY_API_KEY is required for Vercel AI Gateway embeddings");
    }

    this.apiKey = apiKey;
    this.model = options.model ?? "google/gemini-embedding-2";
    this.id = `vercel-ai-gateway:${this.model}`;
    this.endpoint = `${(options.baseUrl ?? "https://ai-gateway.vercel.sh/v1").replace(/\/$/, "")}/embeddings`;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async embedQuery(text: string): Promise<EmbeddingVector> {
    const [vector] = await this.requestEmbeddings([text]);
    if (!vector) throw new Error("Vercel AI Gateway returned no query embedding");
    return vector;
  }

  async embedDocuments(texts: string[]): Promise<EmbeddingVector[]> {
    if (texts.length === 0) return [];
    return this.requestEmbeddings(texts);
  }

  private async requestEmbeddings(input: string[]): Promise<EmbeddingVector[]> {
    const response = await this.fetchImpl(this.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        input
      })
    });

    let payload: EmbeddingsResponse;
    try {
      payload = await response.json() as EmbeddingsResponse;
    } catch {
      throw new Error(`Vercel AI Gateway embeddings request failed with HTTP ${response.status}`);
    }

    if (!response.ok) {
      const detail = payload.error?.message ? `: ${payload.error.message}` : "";
      throw new Error(`Vercel AI Gateway embeddings request failed with HTTP ${response.status}${detail}`);
    }

    const data = payload.data;
    if (!Array.isArray(data) || data.length !== input.length) {
      throw new Error(`Vercel AI Gateway returned ${data?.length ?? 0} embeddings for ${input.length} inputs`);
    }

    return [...data]
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((item, index) => {
        if (!Array.isArray(item.embedding) || item.embedding.length === 0) {
          throw new Error(`Vercel AI Gateway returned an invalid embedding at index ${index}`);
        }
        return item.embedding;
      });
  }
}

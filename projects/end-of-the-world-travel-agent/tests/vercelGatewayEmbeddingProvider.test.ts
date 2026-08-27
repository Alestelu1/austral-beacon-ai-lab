import { describe, expect, it } from "vitest";
import { VercelGatewayEmbeddingProvider } from "../src/retrieval/VercelGatewayEmbeddingProvider.js";

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init
  });
}

describe("VercelGatewayEmbeddingProvider", () => {
  it("uses Gemini Embedding 2 by default and preserves batch order", async () => {
    const calls: Array<{ url: string; body: unknown; authorization: string | null }> = [];

    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({
        url: String(input),
        body: JSON.parse(String(init?.body)),
        authorization: new Headers(init?.headers).get("Authorization")
      });

      return jsonResponse({
        data: [
          { index: 1, embedding: [0, 1] },
          { index: 0, embedding: [1, 0] }
        ]
      });
    };

    const provider = new VercelGatewayEmbeddingProvider({
      apiKey: "test-key",
      fetchImpl
    });

    const vectors = await provider.embedDocuments(["Puerto Williams", "Puerto Toro"]);

    expect(vectors).toEqual([[1, 0], [0, 1]]);
    expect(provider.id).toBe("vercel-ai-gateway:google/gemini-embedding-2");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe("https://ai-gateway.vercel.sh/v1/embeddings");
    expect(calls[0]?.authorization).toBe("Bearer test-key");
    expect(calls[0]?.body).toEqual({
      model: "google/gemini-embedding-2",
      input: ["Puerto Williams", "Puerto Toro"]
    });
  });

  it("embeds a query through the same gateway endpoint", async () => {
    const fetchImpl: typeof fetch = async () => jsonResponse({
      data: [{ index: 0, embedding: [0.25, 0.75] }]
    });

    const provider = new VercelGatewayEmbeddingProvider({ apiKey: "test-key", fetchImpl });
    await expect(provider.embedQuery("Is Puerto Toro Puerto Williams?")).resolves.toEqual([0.25, 0.75]);
  });

  it("requires an API key", () => {
    const previous = process.env.AI_GATEWAY_API_KEY;
    delete process.env.AI_GATEWAY_API_KEY;

    try {
      expect(() => new VercelGatewayEmbeddingProvider()).toThrow("AI_GATEWAY_API_KEY is required");
    } finally {
      if (previous === undefined) delete process.env.AI_GATEWAY_API_KEY;
      else process.env.AI_GATEWAY_API_KEY = previous;
    }
  });

  it("surfaces gateway errors without exposing the API key", async () => {
    const fetchImpl: typeof fetch = async () => jsonResponse(
      { error: { message: "model unavailable" } },
      { status: 503 }
    );

    const provider = new VercelGatewayEmbeddingProvider({ apiKey: "super-secret", fetchImpl });

    await expect(provider.embedQuery("Puerto Williams")).rejects.toThrow(
      "Vercel AI Gateway embeddings request failed with HTTP 503: model unavailable"
    );
  });
});

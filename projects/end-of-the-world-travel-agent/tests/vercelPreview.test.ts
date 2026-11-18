import { afterEach, describe, expect, it } from "vitest";
import { POST, GET as answerGet } from "../../../api/answer.js";
import { GET as healthGet } from "../../../api/health.js";
import { GET as demoGet } from "../../../api/demo.js";

const original = process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED;
afterEach(() => {
  if (original === undefined) delete process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED;
  else process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = original;
});

function request(body: unknown, contentType = "application/json"): Request {
  return new Request("https://preview.example/api/answer", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("isolated Vercel preview API", () => {
  it("refuses all questions unless explicitly enabled", async () => {
    delete process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED;
    const response = await POST(request({ question: "¿Qué es Puerto Williams?" }));
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("PREVIEW_DISABLED");
  });

  it("answers an existing, stable destination question when enabled", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const response = await POST(request({ question: "¿Qué es Puerto Williams?" }));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("supported");
    expect(data.intent).toBe("destination-info");
  });

  it("does not invent unsupported answers", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const response = await POST(request({ question: "¿Cuánto cuesta un café?" }));
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe("unsupported");
  });

  it("rejects invalid media, malformed JSON and oversized questions", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    expect((await POST(request({ question: "test" }, "text/plain"))).status).toBe(415);
    expect((await POST(request("{invalid"))).status).toBe(400);
    const tooLong = await POST(request({ question: "x".repeat(2001) }));
    expect(tooLong.status).toBe(400);
    expect((await tooLong.json()).error.code).toBe("QUESTION_TOO_LONG");
  });

  it("sets noindex and a same-origin content security policy for demo HTML", async () => {
    const response = demoGet();
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("content-security-policy")).toContain("connect-src 'self'");
    expect(await response.text()).toContain("Travel Assistant");
  });

  it("responds 405 to GET /api/answer and health only returns non-sensitive state", async () => {
    expect(answerGet().status).toBe(405);
    const health = await healthGet().json();
    expect(health.service).toBe("austral-beacon-travel-assistant-preview");
    expect(health).not.toHaveProperty("apiKey");
  });
});

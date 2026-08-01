import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "../src/api/app.js";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("GET /health", () => {
  it("responds 200 with service status", async () => {
    const res = await fetch(`${baseUrl}/health`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");

    const body = await res.json();
    expect(body).toEqual({ status: "ok", service: "end-of-the-world-travel-agent" });
  });

  it("responds 405 for POST /health with Allow header", async () => {
    const res = await fetch(`${baseUrl}/health`, { method: "POST" });

    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("GET");

    const body = await res.json();
    expect(body).toEqual({ error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } });
  });
});

describe("POST /api/answer — body reading", () => {
  it("accepts valid JSON body", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "test" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("unsupported");
  });

  it("responds 400 for invalid JSON", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not valid json",
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: { code: "INVALID_JSON", message: "Invalid JSON body" } });
  });

  it("responds 400 for empty body", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: { code: "INVALID_JSON", message: "Invalid JSON body" } });
  });

  it("responds 413 for body exceeding 16 KB", async () => {
    const largeBody = "x".repeat(16385);
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: largeBody,
    });

    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body).toEqual({ error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large" } });
  });
});

describe("POST /api/answer — question validation", () => {
  it("responds 400 when body is a JSON array", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([1, 2, 3]),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("JSON object");
  });

  it("responds 400 when body is a JSON number", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "42",
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
  });

  it("responds 400 when body is a JSON string", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("hello"),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
  });

  it("responds 400 when body is JSON null", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "null",
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
  });

  it("responds 400 when question field is missing", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ other: "value" }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("question");
  });

  it("responds 400 when question is a number", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: 123 }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("non-empty string");
  });

  it("responds 400 when question is a boolean", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: true }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("non-empty string");
  });

  it("responds 400 when question is empty string", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "" }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("non-empty string");
  });

  it("responds 400 when question is only whitespace", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "   \t\n  " }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toContain("non-empty string");
  });

  it("responds 200 when question is a valid non-empty string", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "¿Qué es Puerto Williams?" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("supported");
    expect(body.intent).toBe("destination-info");
  });
});

describe("POST /api/answer — agent responses", () => {
  it("returns connectivity response for travel question", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "¿Cómo llegar desde Santiago a Puerto Williams?" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");

    const body = await res.json();
    expect(body.status).toBe("supported");
    expect(body.intent).toBe("connectivity");
    expect(body.summary).toBeTruthy();
    expect(body.stages).toBeDefined();
    expect(body.stages.length).toBeGreaterThan(0);
    expect(body.warnings).toBeDefined();
    expect(body.sources).toBeDefined();
  });

  it("returns destination-info response for destination question", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "¿Qué es Puerto Williams?" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("supported");
    expect(body.intent).toBe("destination-info");
    expect(body.confidence).toBe("high");
    expect(body.card).toBeDefined();
    expect(body.card.id).toBe("puerto-williams");
    expect(body.sources.length).toBeGreaterThan(0);
  });

  it("returns unsupported for unrecognized question", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "¿Cuánto cuesta un café?" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("unsupported");
    expect(body.intent).toBe("unknown");
  });

  it("responds 405 for GET /api/answer with Allow header", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, { method: "GET" });

    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");

    const body = await res.json();
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
  });
});

describe("Routing — unknown routes and wrong methods", () => {
  it("responds 404 for GET to unknown route", async () => {
    const res = await fetch(`${baseUrl}/ruta-inexistente`);

    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");

    const body = await res.json();
    expect(body).toEqual({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  it("responds 404 for POST to unknown route", async () => {
    const res = await fetch(`${baseUrl}/ruta-inexistente`, { method: "POST" });

    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");

    const body = await res.json();
    expect(body).toEqual({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  it("responds 405 for PUT /health with Allow: GET", async () => {
    const res = await fetch(`${baseUrl}/health`, { method: "PUT" });

    expect(res.status).toBe(405);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(res.headers.get("allow")).toBe("GET");

    const body = await res.json();
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
  });

  it("responds 405 for DELETE /api/answer with Allow: POST", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, { method: "DELETE" });

    expect(res.status).toBe(405);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(res.headers.get("allow")).toBe("POST");

    const body = await res.json();
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
  });
});

describe("Internal error handling (500)", () => {
  let errorServer: import("node:http").Server;
  let errorBaseUrl: string;

  beforeAll(async () => {
    errorServer = createApp({
      answerFn: () => { throw new Error("Simulated internal failure XYZ-SECRET-PATH"); },
    });
    await new Promise<void>((resolve) => errorServer.listen(0, resolve));
    const { port } = errorServer.address() as import("node:net").AddressInfo;
    errorBaseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => errorServer.close(() => resolve()));
  });

  it("responds 500 with INTERNAL_ERROR when answer function throws", async () => {
    const res = await fetch(`${errorBaseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "trigger error" }),
    });

    expect(res.status).toBe(500);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");

    const body = await res.json();
    expect(body).toEqual({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  });

  it("does not expose internal error details in response", async () => {
    const res = await fetch(`${errorBaseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "trigger error" }),
    });

    const text = await res.text();
    expect(text).not.toContain("Simulated internal failure");
    expect(text).not.toContain("XYZ-SECRET-PATH");
    expect(text).not.toContain("stack");
  });

  it("server continues responding after an internal error", async () => {
    // First request triggers error
    await fetch(`${errorBaseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "trigger error" }),
    });

    // Second request to /health should work fine
    const res = await fetch(`${errorBaseUrl}/health`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});

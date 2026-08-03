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

describe("Static file serving", () => {
  it("GET / returns 200 with text/html content type", async () => {
    const res = await fetch(`${baseUrl}/`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("GET /styles.css returns 200 with text/css content type", async () => {
    const res = await fetch(`${baseUrl}/styles.css`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/css");
  });

  it("GET /js/app.client.js returns 200 with application/javascript content type", async () => {
    const res = await fetch(`${baseUrl}/js/app.client.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/javascript");
  });

  it("GET /js/renderAnswer.js returns 200", async () => {
    const res = await fetch(`${baseUrl}/js/renderAnswer.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/javascript");
  });
});

describe("Directory traversal protection", () => {
  it("GET /js/../../../package.json is blocked (404)", async () => {
    const res = await fetch(`${baseUrl}/js/../../../package.json`);

    expect(res.status).toBe(404);
  });

  it("GET /js/..%2F..%2Fpackage.json is blocked (404)", async () => {
    const res = await fetch(`${baseUrl}/js/..%2F..%2Fpackage.json`);

    expect(res.status).toBe(404);
  });

  it("GET /js/../../etc/passwd is blocked (404)", async () => {
    const res = await fetch(`${baseUrl}/js/../../etc/passwd`);

    expect(res.status).toBe(404);
  });
});

describe("Existing API routes still work", () => {
  it("POST /api/answer still works", async () => {
    const res = await fetch(`${baseUrl}/api/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "¿Cómo llegar a Puerto Williams?" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("intent");
  });

  it("GET /health still works", async () => {
    const res = await fetch(`${baseUrl}/health`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok", service: "end-of-the-world-travel-agent" });
  });
});

describe("Unknown routes", () => {
  it("GET /foo returns 404", async () => {
    const res = await fetch(`${baseUrl}/foo`);

    expect(res.status).toBe(404);
  });

  it("GET /nonexistent.html returns 404", async () => {
    const res = await fetch(`${baseUrl}/nonexistent.html`);

    expect(res.status).toBe(404);
  });
});

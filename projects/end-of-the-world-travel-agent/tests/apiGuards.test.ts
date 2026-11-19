import { describe, expect, it, afterEach } from "vitest";
import { createApp } from "../src/api/app.js";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

const servers: Server[] = [];
async function start(options?: Parameters<typeof createApp>[0]): Promise<string> {
  const server = createApp(options);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) =>
    new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  ));
});
function ask(url: string, question: string, headers: Record<string, string> = { "Content-Type": "application/json" }) {
  return fetch(url + "/api/answer", {
    method: "POST", headers, body: JSON.stringify({ question })
  });
}
describe("API input guards", () => {
  it("rejects requests without JSON media type before parsing", async () => {
    const url = await start({ answerFn: () => ({ status: "supported" }) });
    const res = await ask(url, "hello", { "Content-Type": "text/plain" });
    expect(res.status).toBe(415);
    expect((await res.json()).error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });
  it("accepts JSON with charset", async () => {
    const url = await start({ answerFn: () => ({ status: "supported" }) });
    expect((await ask(url, "hello", { "Content-Type": "application/json; charset=utf-8" })).status).toBe(200);
  });
  it("rejects an oversized question without calling the answer function", async () => {
    let called = false;
    const url = await start({ answerFn: () => { called = true; return {}; } });
    const res = await ask(url, "x".repeat(2001));
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("QUESTION_TOO_LONG");
    expect(called).toBe(false);
  });
  it("returns a generic 504 and keeps health usable after a slow answer", async () => {
    const url = await start({
      answerFn: () => new Promise((resolve) => setTimeout(() => resolve({ status: "supported" }), 70)),
      answerTimeoutMs: 10
    });
    const res = await ask(url, "hello");
    expect(res.status).toBe(504);
    expect((await res.json()).error.code).toBe("ANSWER_TIMEOUT");
    expect((await fetch(url + "/health")).status).toBe(200);
  });
  it("returns supported answers normally before timeout", async () => {
    const url = await start({ answerFn: () => ({ status: "supported", summary: "test" }) });
    const res = await ask(url, "hello");
    expect(res.status).toBe(200);
    expect((await res.json()).summary).toBe("test");
  });
});

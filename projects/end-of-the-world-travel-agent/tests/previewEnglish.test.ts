import { afterEach, describe, expect, it } from "vitest";
import { Script } from "node:vm";
import { POST } from "../../../api/answer.js";
import { GET as englishDemo } from "../../../api/demo-en.js";

const previous = process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED;
afterEach(() => {
  if (previous === undefined) delete process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED;
  else process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = previous;
});

async function ask(question: string, locale: unknown = "en") {
  return POST(new Request("https://example.test/api/answer", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, locale }),
  }));
}
describe("audited English MVP", () => {
  it("answers Puerto Williams in English while retaining canonical provenance", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const res = await ask("What is Puerto Williams?");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("supported");
    expect(data.intent).toBe("destination-info");
    expect(data.summary).toContain("Navarino Island");
    expect(data.summary).toContain("2019");
    expect(data.summary).toContain("2021");
    expect(data.sources.length).toBeGreaterThan(0);
    expect(data.summary).not.toContain("se encuentra");
    expect(data.card).toBeUndefined();
  });
  it("answers the same operator-backed route in English with no current schedule", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const data = await (await ask("How can I travel from Punta Arenas to Puerto Williams?")).json();
    expect(data.intent).toBe("connectivity");
    expect(data.summary).toContain("Aerovías DAP");
    expect(data.summary).toContain("TABSA");
    expect(data.summary).toContain("confirm");
    expect(data.sources).toHaveLength(2);
    expect(data.warnings[0]).toContain("weather");
    expect(data.summary).not.toContain("Knowledge Base");
  });
  it("does not claim broad English coverage or fabricate translations", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const data = await (await ask("How do I get to Antarctica from Chile?")).json();
    expect(data.status).toBe("unsupported");
    expect(data.summary).toContain("English preview");
    expect(data.sources).toEqual([]);
  });
  it("rejects invalid locale", async () => {
    process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED = "true";
    const res = await ask("What is Puerto Williams?", "fr");
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("INVALID_LOCALE");
  });
  it("serves an English noindex page with valid browser script", async () => {
    const response = await englishDemo();
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    const html = await response.text();
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("English coverage is currently limited");
    expect(html).toContain("locale:'en'");
    expect(html).toContain("What is Puerto Williams?");
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    expect(() => new Script(script!)).not.toThrow();
  });
});

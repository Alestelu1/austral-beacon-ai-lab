import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { AntarcticAccessAnswer, TravelAnswer } from "../src/domain/types.js";

const INTERNAL_TOKENS = ["source_verified", "operation_independently_verified"];
const DEV_PHRASE = "conservar el alcance y las salvaguardas de los chunks";

function deepStrings(value: unknown, acc: string[] = []): string[] {
  if (typeof value === "string") acc.push(value);
  else if (Array.isArray(value)) for (const v of value) deepStrings(v, acc);
  else if (value && typeof value === "object") for (const v of Object.values(value)) deepStrings(v, acc);
  return acc;
}

describe("MVP fix 1 — Spanish connectivity intent detection", () => {
  it("recognizes '¿Cómo viajo de Punta Arenas a Puerto Williams?' as connectivity", () => {
    const answer = answerTravelQuestion("¿Cómo viajo de Punta Arenas a Puerto Williams?") as TravelAnswer;
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages.every((s) => s.from === "Punta Arenas")).toBe(true);
  });

  it("matches the working English variant's connectivity class", () => {
    const es = answerTravelQuestion("¿Cómo viajo de Punta Arenas a Puerto Williams?");
    const en = answerTravelQuestion("How do I travel from Punta Arenas to Puerto Williams?");
    expect(es.intent).toBe(en.intent);
    expect(es.intent).toBe("connectivity");
  });

  it("recognizes other natural Spanish formulations", () => {
    for (const q of [
      "¿Cómo llego a Puerto Williams desde Punta Arenas?",
      "Quiero viajar a Puerto Williams desde Punta Arenas",
      "¿Cómo ir a Puerto Williams desde Punta Arenas?"
    ]) {
      expect(answerTravelQuestion(q).intent).toBe("connectivity");
    }
  });

  it("preserves Santiago → Puerto Williams behavior (distinct two-stage route)", () => {
    const answer = answerTravelQuestion("¿Cómo llegar desde Santiago a Puerto Williams?") as TravelAnswer;
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages).toHaveLength(2);
    expect(answer.stages[0]?.from).toBe("Santiago");
  });
});

describe("MVP fix 2 — traveler-facing fallback prose (no developer text)", () => {
  it("knowledge fallback does not expose the developer chunk/safeguard phrase", async () => {
    const answer = await answerViaAssistant("¿Qué ruta conecta Puerto Williams con Puerto Navarino?");
    const text = deepStrings(answer).join(" ");
    expect(text).not.toContain(DEV_PHRASE);
    expect(text).not.toContain("corpus embebido");
    expect(text).not.toContain("chunks recuperados");
  });

  it("live not-verified message is plain traveler language, not engineering status", async () => {
    const answer = await answerViaAssistant("Is the Y-905 open today?");
    if (answer.intent !== "knowledge") throw new Error("Expected knowledge answer");
    expect(answer.summary).not.toContain("estado operativo solicitado");
    expect(answer.summary.toLowerCase()).toContain("fuente oficial");
  });
});

describe("MVP fix 3 — surface verification guidance", () => {
  it("live Y-905 query surfaces a time-sensitive warning and official source guidance", async () => {
    const answer = await answerViaAssistant("Is the Y-905 open today?");
    if (answer.intent !== "knowledge") throw new Error("Expected knowledge answer");
    expect(answer.route).toBe("live_verification");
    expect(answer.warnings.length).toBeGreaterThan(0);
    const warningsText = answer.warnings.join(" ").toLowerCase();
    expect(warningsText).toContain("sensible al tiempo");
  });

  it("tomorrow ferry query is time-sensitive and never presents a stale schedule as current fact", async () => {
    const answer = await answerViaAssistant(
      "What time is the ferry from Punta Arenas to Puerto Williams tomorrow?"
    );
    if (answer.intent !== "knowledge") throw new Error("Expected knowledge answer");
    expect(answer.route).toBe("live_verification");
    expect(answer.status).toBe("unsupported");
    // No concrete clock time / departure is asserted.
    const text = deepStrings(answer).join(" ");
    expect(text).not.toMatch(/\b\d{1,2}:\d{2}\b/);
    expect(answer.warnings.join(" ").toLowerCase()).toContain("confirmarse");
  });
});

describe("MVP fix 4 — no internal implementation tokens in user-facing text", () => {
  it("Antarctica access answer contains no internal tokens", async () => {
    const answer = (await answerViaAssistant(
      "How can I reach Antarctica from Chile?"
    )) as AntarcticAccessAnswer;
    const text = deepStrings(answer).join(" ");
    for (const token of INTERNAL_TOKENS) {
      expect(text).not.toContain(token);
    }
  });

  it("no audited MVP query leaks internal tokens", async () => {
    const queries = [
      "How do I travel from Punta Arenas to Puerto Williams?",
      "¿Cómo viajo de Punta Arenas a Puerto Williams?",
      "Is Puerto Williams the same as Cabo de Hornos?",
      "How can I reach Antarctica from Chile?",
      "Can I reach Antarctica from Puerto Williams?",
      "Is the Y-905 open today?"
    ];
    for (const q of queries) {
      const answer = await answerViaAssistant(q);
      const text = deepStrings(answer).join(" ");
      for (const token of INTERNAL_TOKENS) {
        expect(text, `token "${token}" leaked for query: ${q}`).not.toContain(token);
      }
    }
  });
});

describe("MVP fixes — Antarctica-from-Puerto-Williams safeguard preserved", () => {
  it("keeps the no-verified-direct-commercial-service safeguard while treating this-week availability as dynamic", async () => {
    const answer = await answerViaAssistant("Are there flights from Puerto Williams to Antarctica this week?");

    if ("pathways" in answer) {
      // Deterministic path: PW must remain gateway-only, never a commercial-product origin.
      const pw = answer.pathways.filter((p) => p.origin.includes("Puerto Williams"));
      expect(pw.every((p) => p.category === "gateway-policy")).toBe(true);
      expect(
        answer.pathways.some((p) => p.category === "commercial-product" && p.origin.includes("Puerto Williams"))
      ).toBe(false);
    } else if ("route" in answer) {
      // Live path ("this week" is dynamic): must route to live verification, not stable RAG,
      // and must not assert a current commercial Antarctic departure from Puerto Williams.
      expect(answer.route).toBe("live_verification");
      expect(answer.status).toBe("unsupported");
    } else {
      throw new Error("Expected knowledge or antarctic-access answer");
    }
  });
});

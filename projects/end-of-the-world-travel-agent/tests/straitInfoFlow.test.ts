import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { StraitInfoAnswer } from "../src/domain/types.js";

function asStrait(q: string): StraitInfoAnswer {
  const a = answerTravelQuestion(q);
  if (a.intent !== "strait-info") throw new Error(`Expected strait-info for: ${q} (got ${a.intent})`);
  return a as StraitInfoAnswer;
}

function fullText(a: StraitInfoAnswer): string {
  // Includes warnings for identity/where assertions.
  return [a.summary, ...a.warnings, ...a.facts.map((f) => f.text)]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Projected content the assistant asserts as fact (summary + facts), EXCLUDING
 * the safety warning. The safety warning intentionally names excluded
 * categories (corrientes, mareas, control de tráfico, pilotaje) to tell the
 * user what is NOT covered, so it must not be scanned for leakage.
 */
function assertedText(a: StraitInfoAnswer): string {
  return [a.summary, ...a.facts.map((f) => f.text)]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

describe("Strait of Magellan — stable identity questions (ES + EN)", () => {
  it("answers '¿Qué es el Estrecho de Magallanes?' from the stable projection", () => {
    const a = asStrait("¿Qué es el Estrecho de Magallanes?");
    expect(a.status).toBe("supported");
    expect(a.intent).toBe("strait-info");
    expect(a.facts.length).toBeGreaterThan(0);
    expect(a.confidence).toBe("high");
  });

  it("answers '¿Dónde está el Estrecho de Magallanes?'", () => {
    const a = asStrait("¿Dónde está el Estrecho de Magallanes?");
    expect(a.status).toBe("supported");
    expect(fullText(a)).toMatch(/330|millas nauticas|dungenes|evangelistas/);
  });

  it("answers 'What is the Strait of Magellan?' (English)", () => {
    const a = asStrait("What is the Strait of Magellan?");
    expect(a.status).toBe("supported");
    expect(a.intent).toBe("strait-info");
  });

  it("preserves canonical provenance and only DIRECTEMAR-sourced stable facts", () => {
    const a = asStrait("¿Qué es el Estrecho de Magallanes?");
    expect(a.facts.every((f) => f.entityId === "strait-of-magellan")).toBe(true);
    expect(a.facts.every((f) => f.sourceIds.length > 0)).toBe(true);
    expect(a.sources.length).toBeGreaterThan(0);
    expect(a.sources.every((s) => s.status === "verified")).toBe(true);
  });

  it("flows through the unified entry point preserving strait-info intent", async () => {
    const a = await answerViaAssistant("¿Qué es el Estrecho de Magallanes?");
    expect(a.status).toBe("supported");
    expect(a.intent).toBe("strait-info");
  });
});

describe("Strait of Magellan — no operational/legal leakage", () => {
  it("asserted content contains no currents/tides/traffic-control/pilotage", () => {
    const t = assertedText(asStrait("¿Qué es el Estrecho de Magallanes?"));
    for (const term of ["corriente", "marea", "nudos", "control de trafico", "pilotaje", "trafico maritimo"]) {
      expect(t).not.toContain(term);
    }
  });

  it("asserted content contains no treaty/sovereignty interpretation", () => {
    const t = assertedText(asStrait("What is the Strait of Magellan?"));
    for (const term of ["tratado", "soberania", "banderas", "1881", "1984"]) {
      expect(t).not.toContain(term);
    }
  });

  it("navigation questions do NOT get the stable projection answer", () => {
    for (const q of [
      "¿Cuáles son las corrientes del Estrecho de Magallanes?",
      "What are the tides in the Strait of Magellan?",
      "¿Cómo es la navegación en el Estrecho de Magallanes hoy?"
    ]) {
      expect(answerTravelQuestion(q).intent).not.toBe("strait-info");
    }
  });

  it("legal/sovereignty questions do NOT get the stable projection answer", () => {
    for (const q of [
      "¿Quién tiene soberanía sobre el Estrecho de Magallanes?",
      "What treaty governs the Strait of Magellan?"
    ]) {
      expect(answerTravelQuestion(q).intent).not.toBe("strait-info");
    }
  });

  it("does not expose the Punta Arenas relationship in v1", () => {
    const a = asStrait("¿Qué es el Estrecho de Magallanes?");
    const t = fullText(a);
    expect(t).not.toContain("punta arenas");
    expect(a.suggestedInternalLinks.some((l) => l.path.includes("punta-arenas"))).toBe(false);
  });
});

describe("Strait integration — existing flows unchanged", () => {
  it("Puerto Williams destination-info still resolves", () => {
    expect(answerTravelQuestion("¿Qué es Puerto Williams?").intent).toBe("destination-info");
  });
  it("Puerto Toro destination-info still resolves", () => {
    expect(answerTravelQuestion("¿Qué es Puerto Toro?").intent).toBe("destination-info");
  });
  it("Villa Ukika relationship still resolves", () => {
    expect(answerTravelQuestion("¿Qué es Villa Ukika?").intent).toBe("relationship");
  });
  it("Puerto Williams / Cabo de Hornos (Cape Horn) relationship still resolves", () => {
    expect(answerTravelQuestion("What is the relationship between Puerto Williams and Cape Horn?").intent).toBe("relationship");
  });
});

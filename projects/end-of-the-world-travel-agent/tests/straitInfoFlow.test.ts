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

describe("Strait of Magellan — verified Chilean geographic/jurisdictional context (public_core)", () => {
  it("'¿Qué es el Estrecho de Magallanes?' mentions Chile when supported", () => {
    expect(assertedText(asStrait("¿Qué es el Estrecho de Magallanes?"))).toContain("chile");
  });

  it("'¿Dónde está el Estrecho de Magallanes?' includes Chile + Región de Magallanes y de la Antártica Chilena", () => {
    const t = assertedText(asStrait("¿Dónde está el Estrecho de Magallanes?"));
    expect(t).toContain("chile");
    expect(t).toContain("region de magallanes y de la antartica chilena");
  });

  it("'¿En qué país está el Estrecho de Magallanes?' -> Chile (strait-info)", () => {
    const a = asStrait("¿En qué país está el Estrecho de Magallanes?");
    expect(a.intent).toBe("strait-info");
    expect(assertedText(a)).toContain("chile");
  });

  it("'¿El Estrecho de Magallanes está en Chile?' -> supported factual answer", () => {
    const a = asStrait("¿El Estrecho de Magallanes está en Chile?");
    expect(a.status).toBe("supported");
    expect(assertedText(a)).toContain("chile");
  });

  it("'¿Bajo qué jurisdicción está el Estrecho de Magallanes?' -> DIRECTEMAR jurisdiction fact, no treaty interpretation", () => {
    const a = asStrait("¿Bajo qué jurisdicción está el Estrecho de Magallanes?");
    expect(a.intent).toBe("strait-info");
    const t = assertedText(a);
    expect(t).toContain("jurisdiccion de chile");
    // The jurisdiction claim id is projected with preserved provenance.
    expect(a.facts.some((f) => f.claimId === "strait-jurisdiction-chile")).toBe(true);
    // No treaty interpretation is introduced.
    for (const term of ["tratado", "1881", "1984", "banderas", "soberania"]) {
      expect(t).not.toContain(term);
    }
  });

  it("the jurisdiction fact preserves canonical claim_id + source_ids", () => {
    const a = asStrait("¿El Estrecho de Magallanes está en Chile?");
    const jur = a.facts.find((f) => f.claimId === "strait-jurisdiction-chile");
    expect(jur).toBeDefined();
    expect(jur!.entityId).toBe("strait-of-magellan");
    expect(jur!.sourceIds).toContain("directemar-generalidades-estrecho-magallanes");
  });

  it("keyword 'jurisdicción'/'territorial' alone does NOT suppress the stable answer", () => {
    expect(answerTravelQuestion("¿Bajo qué jurisdicción está el Estrecho de Magallanes?").intent).toBe("strait-info");
  });
});

describe("Strait of Magellan — legal/treaty & operational intents remain excluded", () => {
  it("'¿Qué establece jurídicamente el Tratado de 1881?' is NOT strait-info", () => {
    expect(answerTravelQuestion("¿Qué establece jurídicamente el Tratado de 1881?").intent).not.toBe("strait-info");
  });

  it("'¿Quién tiene mejor derecho territorial sobre el Estrecho?' is NOT strait-info", () => {
    expect(answerTravelQuestion("¿Quién tiene mejor derecho territorial sobre el Estrecho de Magallanes?").intent).not.toBe("strait-info");
  });

  it("'¿Qué corrientes hay hoy en el Estrecho de Magallanes?' is NOT stable projection", () => {
    expect(answerTravelQuestion("¿Qué corrientes hay hoy en el Estrecho de Magallanes?").intent).not.toBe("strait-info");
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

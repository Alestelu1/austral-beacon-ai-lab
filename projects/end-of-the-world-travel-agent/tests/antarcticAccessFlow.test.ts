import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import type { AntarcticAccessAnswer } from "../src/domain/types.js";

const ACCESS_VARIATIONS = [
  "How do I get to Antarctica from Chile?",
  "How can I travel to Antarctica from Chile?",
  "Can I reach Antarctica from Punta Arenas?",
  "Can I reach Antarctica from Puerto Williams?",
  "¿Cómo viajar a la Antártica desde Chile?",
  "¿Se puede llegar a la Antártica desde Punta Arenas?",
  "¿Se puede viajar a la Antártica desde Puerto Williams?"
];

function asAntarctic(question: string): AntarcticAccessAnswer {
  const answer = answerTravelQuestion(question);
  if (!("pathways" in answer)) {
    throw new Error(`Expected antarctic-access answer for: ${question}`);
  }
  return answer;
}

function textOf(answer: AntarcticAccessAnswer): string {
  return [
    answer.summary,
    answer.puertoWilliamsClarification,
    ...answer.warnings,
    ...answer.pathways.map((p) => `${p.title} ${p.description}`)
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

describe("Flow 3 — accessing Antarctica from Chile", () => {
  it.each(ACCESS_VARIATIONS)("recognizes bilingual variation: %s", (question) => {
    const answer = answerTravelQuestion(question);
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("antarctic-access");
  });

  it("explains verified access pathways from Chile", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    expect(answer.pathways.length).toBeGreaterThan(0);
    const categories = answer.pathways.map((p) => p.category);
    expect(categories).toContain("gateway-policy");
    expect(categories).toContain("commercial-product");
  });

  it("presents Punta Arenas gateway status", () => {
    const answer = asAntarctic("Can I reach Antarctica from Punta Arenas?");
    const gateway = answer.pathways.find(
      (p) => p.category === "gateway-policy" && p.origin === "Punta Arenas"
    );
    expect(gateway).toBeDefined();
  });

  it("attributes verified commercial products only to Punta Arenas origin", () => {
    const answer = asAntarctic("¿Cómo viajar a la Antártica desde Chile?");
    const commercial = answer.pathways.filter((p) => p.category === "commercial-product");
    expect(commercial.length).toBeGreaterThan(0);
    // Every commercial product pathway must originate in Punta Arenas.
    expect(commercial.every((p) => p.origin === "Punta Arenas")).toBe(true);
    // No commercial product may originate in Puerto Williams.
    expect(commercial.some((p) => p.origin.includes("Puerto Williams"))).toBe(false);
  });

  it("keeps Puerto Williams as gateway-only (gateway vs service distinction)", () => {
    const answer = asAntarctic("Can I reach Antarctica from Puerto Williams?");
    const pwPathways = answer.pathways.filter((p) => p.origin.includes("Puerto Williams"));
    // Any Puerto Williams pathway is gateway-policy, never a commercial product.
    expect(pwPathways.length).toBeGreaterThan(0);
    expect(pwPathways.every((p) => p.category === "gateway-policy")).toBe(true);

    const clarification = answer.puertoWilliamsClarification
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    expect(clarification).toContain("puerto williams");
    // Must state that the verified first-party commercial products are published/offered from Punta Arenas.
    expect(clarification).toContain("punta arenas");
    expect(clarification).toContain("no contiene evidencia");
  });

  it("separates state/scientific capability from tourism", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    const stateScience = answer.pathways.find((p) => p.category === "state-science");
    expect(stateScience).toBeDefined();
    const desc = stateScience!.description
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    // Must not be presented as a public passenger / tourist route.
    expect(desc).toContain("no");
    expect(desc).toMatch(/turistica|pasajeros/);
  });

  it("separates gateway status from published transport products", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    const text = textOf(answer);
    expect(text).toContain("no equivale a un servicio comercial");
    // Published product identity != independently verified operation / date-specific availability.
    expect(text).toMatch(/no equivale a una operacion verificada|no equivale a disponibilidad/);
    expect(text).toContain("disponibilidad para una fecha concreta");
  });

  it("does not invent schedules, operators, prices or departures", () => {
    const answer = asAntarctic("¿Cómo viajar a la Antártica desde Chile?");
    // Consider only user-facing prose, not source-provenance/verification metadata
    // (verification dates and season windows in sources are legitimate traceability).
    const prose = [
      answer.summary,
      answer.puertoWilliamsClarification,
      ...answer.warnings,
      ...answer.pathways.map((p) => `${p.title} ${p.description}`)
    ].join(" ");

    // No fabricated numeric prices.
    expect(prose).not.toMatch(/\bUSD\s*\d/);
    expect(prose).not.toMatch(/\$\s*\d/);
    expect(prose).not.toMatch(/\b\d{1,3}[.,]\d{3}\b/); // e.g. 7.060 / 15,995
    // No specific fabricated departure dates (the actual DAP departures from the source).
    // Note: a verification date inside the Puerto Williams clarification is legitimate
    // traceability, so we assert against the real operator departure dates specifically
    // rather than any ISO date.
    expect(prose).not.toContain("2026-12-04");
    expect(prose).not.toContain("2026-12-18");
    expect(prose).not.toContain("2027-01-06");
    expect(prose).not.toContain("2027-02-09");
  });

  it("frames commercial products as published/offered, not as independently verified current operation", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    const commercial = answer.pathways.filter((p) => p.category === "commercial-product");
    expect(commercial.length).toBeGreaterThan(0);

    for (const pathway of commercial) {
      const desc = pathway.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      // Uses publication/offer language ("publica" / "ofrece" / "publica/ofrece").
      expect(desc).toMatch(/publica|ofrece/);
      // Explicitly disclaims independently verified current operation (either phrasing).
      expect(desc).toMatch(
        /no constituye evidencia independiente de operacion actual|no debe describirse como un servicio actualmente en operacion/
      );
    }
  });

  it("does not describe first-party commercial products as a currently operating service", () => {
    const answer = asAntarctic("¿Cómo viajar a la Antártica desde Chile?");
    const commercialText = answer.pathways
      .filter((p) => p.category === "commercial-product")
      .map((p) => `${p.title} ${p.description}`)
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // The DAP product must be attributed to the documented 2026-2027 season.
    expect(commercialText).toContain("2026-2027");
    // The Antarctica21 product must be attributed to the 2027-2028 season (future season).
    expect(commercialText).toContain("2027-2028");
  });

  it("distinguishes source verification from independently verified operation in metadata", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    const firstPartyNotes = answer.sources
      .filter((s) => s.evidenceNote)
      .map((s) => s.evidenceNote!.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
    expect(firstPartyNotes.length).toBeGreaterThan(0);
    // At least one first-party source note clarifies publication != independent operation.
    expect(firstPartyNotes.some((n) => n.includes("no") && n.includes("operacion"))).toBe(true);
  });

  it("marks schedules, departures, prices and availability as dynamic", () => {
    const answer = asAntarctic("Can I reach Antarctica from Punta Arenas?");
    const text = textOf(answer);
    expect(answer.warnings.length).toBeGreaterThan(0);
    expect(text).toMatch(/dinamic|confirmar|revalid|deben confirmarse/);
  });

  it("carries verified source metadata with verification dates", () => {
    const answer = asAntarctic("How do I get to Antarctica from Chile?");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.sources.every((s) => s.status === "verified")).toBe(true);
    for (const source of answer.sources) {
      expect(source.title).toBeTruthy();
      expect(source.publisher).toBeTruthy();
      expect(source.url).toBeTruthy();
      expect(source.verifiedAt).toBeTruthy();
    }
    expect(answer.confidence).toBe("high");
  });

  it("flows through the unified entry point preserving the antarctic-access intent", async () => {
    const answer = await answerViaAssistant("¿Cómo viajar a la Antártica desde Chile?");
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("antarctic-access");
  });
});

describe("Flow 3 — does not disturb existing flows", () => {
  it("still returns Punta Arenas → Puerto Williams connectivity (no Antarctica mention)", () => {
    const answer = answerTravelQuestion("¿Cómo viajar de Punta Arenas a Puerto Williams?");
    expect(answer.intent).toBe("connectivity");
  });

  it("still returns the Puerto Williams / Cabo de Hornos relationship", () => {
    const answer = answerTravelQuestion("¿Qué relación hay entre Puerto Williams y Cabo de Hornos?");
    expect(answer.intent).toBe("relationship");
  });
});

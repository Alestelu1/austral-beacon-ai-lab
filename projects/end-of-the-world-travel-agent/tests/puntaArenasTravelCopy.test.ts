import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";

describe("Punta Arenas–Puerto Williams public travel response", () => {
  it("helps visitors compare the two published operators without claiming live service", () => {
    const result = answerTravelQuestion("¿Cómo puedo viajar desde Punta Arenas a Puerto Williams?");
    expect(result.status).toBe("supported");
    expect(result.intent).toBe("connectivity");
    if (result.intent !== "connectivity") return;
    expect(result.summary).toContain("Aerovías DAP");
    expect(result.summary).toContain("TABSA");
    expect(result.summary).not.toContain("Knowledge Base");
    expect(result.warnings.join(" ")).not.toContain("proyección de conocimiento");
    expect(result.warnings.join(" ")).toMatch(/confirma/i);
    expect(result.sources.map((s) => s.publisher)).toEqual(
      expect.arrayContaining(["Aerovías DAP", "Transbordadora Austral Broom (TABSA)"])
    );
    expect(result.summary).not.toMatch(/sale a las|tarifa de|cupo disponible/i);
  });
});

import { describe, expect, it } from "vitest";
import { buildCaboDeHornosDestinationCard } from "../src/knowledge/caboDeHornosProjection.js";
import { buildPuertoToroDestinationCard } from "../src/knowledge/puertoToroProjection.js";
import { buildPuntaArenasDestinationCard } from "../src/knowledge/puntaArenasProjection.js";

describe("canonical southern destination projections", () => {
  it("projects Cabo de Hornos as an administrative entity with disambiguation and no coordinates", () => {
    const card = buildCaboDeHornosDestinationCard();
    expect(card.id).toBe("cabo-de-hornos");
    expect(card.coordinates).toBeUndefined();
    expect(card.stableData.disambiguation).toContain("Parque Nacional Cabo de Hornos");
    expect(card.sources.length).toBeGreaterThan(0);
  });

  it("projects Puerto Toro without leaking timetables or fabricated coordinates", () => {
    const card = buildPuertoToroDestinationCard();
    expect(card.id).toBe("puerto-toro");
    expect(card.coordinates).toBeUndefined();
    expect(card.summary).toContain("Cabo de Hornos");
    expect(card.warnings.join(" ").toLowerCase()).toContain("verificación actual");
  });

  it("projects Punta Arenas from canonical claims and keeps operations dynamic", () => {
    const card = buildPuntaArenasDestinationCard();
    expect(card.id).toBe("punta-arenas");
    expect(card.coordinates).toBeUndefined();
    expect(card.summary).toContain("capital");
    expect(card.stableData.antarcticGatewayContext.toLowerCase()).toContain("antártica");
    expect(card.warnings.join(" ").toLowerCase()).toContain("verificación actual");
  });
});

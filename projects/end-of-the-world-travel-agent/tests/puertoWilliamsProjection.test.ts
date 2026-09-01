import { describe, expect, it } from "vitest";
import {
  buildPuertoWilliamsDestinationCard,
  isPuertoWilliamsClaimProjectable,
  PUERTO_WILLIAMS_ENTITY_ID
} from "../src/knowledge/puertoWilliamsProjection.js";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";

const ALLOWED = [
  "puerto-williams-claim-001",
  "puerto-williams-claim-002",
  "puerto-williams-claim-003",
  "puerto-williams-claim-004"
];

describe("Puerto Williams travel projection v1", () => {
  it("builds the destination card from the canonical entity", () => {
    const card = buildPuertoWilliamsDestinationCard();
    expect(card.id).toBe(PUERTO_WILLIAMS_ENTITY_ID);
    expect(card.name).toBe("Puerto Williams");
    expect(card.region).toContain("Magallanes");
    expect(card.comuna).toBe("Cabo de Hornos");
  });

  it("does not publish coordinates without canonical authoritative geometry", () => {
    const card = buildPuertoWilliamsDestinationCard();
    expect(card.coordinates).toBeUndefined();
  });

  it("projects only the four approved public-core claims", () => {
    for (const claimId of ALLOWED) {
      expect(isPuertoWilliamsClaimProjectable(claimId)).toBe(true);
    }
    expect(isPuertoWilliamsClaimProjectable("current-flight-schedule")).toBe(false);
    expect(isPuertoWilliamsClaimProjectable("hotel-availability")).toBe(false);
  });

  it("preserves canonical source provenance", () => {
    const card = buildPuertoWilliamsDestinationCard();
    const publishers = card.sources.map((source) => source.publisher);
    expect(publishers).toContain("Instituto Nacional de Estadísticas");
    expect(publishers).toContain("Servicio Nacional de Turismo");
    expect(card.sources.every((source) => source.status === "verified")).toBe(true);
  });

  it("keeps dynamic transport and community-access information out of stable data", () => {
    const card = buildPuertoWilliamsDestinationCard();
    const stable = JSON.stringify(card.stableData).toLowerCase();
    for (const forbidden of ["tarifa", "cupos", "horario de vuelo", "frecuencia semanal", "puede visitar villa ukika"]) {
      expect(stable).not.toContain(forbidden);
    }
  });

  it("serves Puerto Williams through the canonical projection in deterministic destination-info", () => {
    const answer = answerTravelQuestion("¿Qué es Puerto Williams?");
    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("destination-info");
    if (answer.intent !== "destination-info" || !answer.card) throw new Error("Expected destination card");
    expect(answer.card.id).toBe("puerto-williams");
    expect(answer.card.coordinates).toBeUndefined();
    expect(answer.card.verifiedAt).toBe("2026-09-01");
  });
});

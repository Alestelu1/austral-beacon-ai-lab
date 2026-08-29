import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";
import { answerViaAssistant } from "../src/application/answerViaAssistant.js";
import { LocalJsonDestinationCardRepository } from "../src/adapters/LocalJsonDestinationCardRepository.js";
import { getDestinationCard } from "../src/application/getDestinationCard.js";
import { validateDestinationCard } from "../src/adapters/validateDestinationCard.js";
import type { DestinationCardAnswer } from "../src/domain/types.js";

const DESTINATIONS_DIR = resolve(import.meta.dirname, "../data/destinations");
const repository = new LocalJsonDestinationCardRepository(DESTINATIONS_DIR);

function asCard(q: string): DestinationCardAnswer {
  const answer = answerTravelQuestion(q);
  if (answer.intent !== "destination-info") {
    throw new Error(`Expected destination-info for: ${q}`);
  }
  return answer as DestinationCardAnswer;
}

describe("Puerto Toro — identity queries (Spanish + English)", () => {
  it("resolves '¿Qué es Puerto Toro?' as a supported destination-info answer", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    expect(a.status).toBe("supported");
    expect(a.card?.id).toBe("puerto-toro");
    expect(a.card?.name).toBe("Puerto Toro");
  });

  it("resolves 'What is Puerto Toro?' (English) as supported destination-info", () => {
    const a = asCard("What is Puerto Toro?");
    expect(a.status).toBe("supported");
    expect(a.card?.id).toBe("puerto-toro");
  });

  it("resolves 'Cuéntame sobre Puerto Toro' and 'Tell me about Puerto Toro'", () => {
    expect(asCard("Cuéntame sobre Puerto Toro").card?.id).toBe("puerto-toro");
    expect(asCard("Tell me about Puerto Toro").card?.id).toBe("puerto-toro");
  });

  it("flows through the unified entry point preserving destination-info intent", async () => {
    const a = (await answerViaAssistant("¿Qué es Puerto Toro?")) as DestinationCardAnswer;
    expect(a.status).toBe("supported");
    expect(a.intent).toBe("destination-info");
    expect(a.card?.id).toBe("puerto-toro");
  });
});

describe("Puerto Toro — entity-distinction safeguards", () => {
  it("is registered in commune Cabo de Hornos, not presented as Puerto Williams", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    expect(a.card?.comuna).toBe("Cabo de Hornos");
    expect(a.card?.name).toBe("Puerto Toro");
    // The subject is Puerto Toro, not Puerto Williams.
    expect(a.summary.toLowerCase().startsWith("puerto toro")).toBe(true);
  });

  it("explicitly states it is distinct from Puerto Williams and Puerto Navarino", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    const text = [a.summary, ...Object.values(a.card!.stableData), ...a.warnings]
      .join(" ")
      .toLowerCase();
    expect(text).toContain("puerto williams");
    expect(text).toContain("puerto navarino");
    expect(text).toMatch(/distint/);
  });

  it("never calls Puerto Toro the southernmost settlement/city of Chile", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    const text = [a.summary, ...Object.values(a.card!.stableData), ...a.warnings]
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    expect(text).not.toContain("mas austral");
    expect(text).not.toContain("southernmost");
    expect(text).not.toMatch(/ciudad mas austral|asentamiento mas austral/);
  });
});

describe("Puerto Toro — no fabricated coordinates / population / schedules", () => {
  it("omits coordinates (authoritative point pending) and remains valid", () => {
    const card = repository.findByNormalizedKey("puerto toro");
    expect(card).toBeDefined();
    expect(card!.coordinates).toBeUndefined();
    const result = validateDestinationCard(card);
    expect(result.valid).toBe(true);
  });

  it("contains no population figure and no clock/schedule times", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    const text = [a.summary, ...Object.values(a.card!.stableData), ...a.warnings].join(" ");
    // No population count (e.g. "123 habitantes" / "population of 123").
    expect(text).not.toMatch(/\d+\s*habitantes/i);
    expect(text).not.toMatch(/population/i);
    // No clock times / schedules.
    expect(text).not.toMatch(/\b\d{1,2}:\d{2}\b/);
  });

  it("keeps maritime connectivity dynamic and non-tourist", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    const warnings = a.warnings
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    expect(warnings).toContain("subsidiado");
    expect(warnings).toContain("no es un producto turistico");
    expect(warnings).toContain("confirm");
  });

  it("carries only verified sources", () => {
    const a = asCard("¿Qué es Puerto Toro?");
    expect(a.sources.length).toBeGreaterThan(0);
    expect(a.sources.every((s) => s.status === "verified")).toBe(true);
    expect(a.confidence).toBe("high");
  });
});

describe("Puerto Toro — existing destination flows preserved", () => {
  it("Puerto Williams still resolves with coordinates intact", () => {
    const card = repository.findByNormalizedKey("puerto williams");
    expect(card?.coordinates).toBeDefined();
    expect(getDestinationCard("Puerto Williams", repository).card?.id).toBe("puerto-williams");
  });

  it("Punta Arenas and Cabo de Hornos still resolve", () => {
    expect(getDestinationCard("Punta Arenas", repository).card?.id).toBe("punta-arenas");
    expect(getDestinationCard("Cabo de Hornos", repository).card?.id).toBe("cabo-de-hornos");
  });

  it("bare 'Puerto Williams' (no info indicator) still returns unknown", () => {
    const answer = answerTravelQuestion("Puerto Williams");
    expect(answer.status).toBe("unsupported");
    expect(answer.intent).toBe("unknown");
  });
});

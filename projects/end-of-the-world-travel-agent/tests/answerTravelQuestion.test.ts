import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";

describe("answerTravelQuestion", () => {
  it("returns the supported Santiago to Puerto Williams route", () => {
    const answer = answerTravelQuestion("¿Cómo llegar desde Santiago a Puerto Williams?");

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    if (!("stages" in answer)) throw new Error("Expected TravelAnswer with stages");
    expect(answer.stages).toHaveLength(2);
    expect(answer.stages[0]?.to).toBe("Punta Arenas");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.verifiedAt).toBeTruthy();
  });

  it("does not invent an answer for an unsupported question", () => {
    const answer = answerTravelQuestion("¿Cuál es el precio de un crucero mañana?");

    expect(answer.status).toBe("unsupported");
    if (!("stages" in answer)) throw new Error("Expected TravelAnswer with stages");
    expect(answer.stages).toHaveLength(0);
    expect(answer.sources).toHaveLength(0);
  });
});

describe("answerTravelQuestion — destination-info with covered destinations", () => {
  it("returns Puerto Williams card for '¿Qué es Puerto Williams?'", () => {
    const answer = answerTravelQuestion("¿Qué es Puerto Williams?");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("supported");
    expect(answer.confidence).toBe("high");
    expect(answer.card).toBeDefined();
    expect(answer.card!.id).toBe("puerto-williams");
  });

  it("returns Punta Arenas card for 'Cuéntame sobre Punta Arenas'", () => {
    const answer = answerTravelQuestion("Cuéntame sobre Punta Arenas");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("supported");
    expect(answer.confidence).toBe("high");
    expect(answer.card).toBeDefined();
    expect(answer.card!.id).toBe("punta-arenas");
  });

  it("returns Cabo de Hornos card for 'Información de Cabo de Hornos'", () => {
    const answer = answerTravelQuestion("Información de Cabo de Hornos");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("supported");
    expect(answer.card).toBeDefined();
    expect(answer.card!.id).toBe("cabo-de-hornos");
  });
});

describe("answerTravelQuestion — destination-info case/accent variations", () => {
  it("resolves 'HABLAME DE PUERTO WILLIAMS' (uppercase)", () => {
    const answer = answerTravelQuestion("HABLAME DE PUERTO WILLIAMS");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("supported");
    expect(answer.card!.id).toBe("puerto-williams");
  });

  it("resolves 'Donde esta Punta Arenas' (no accent)", () => {
    const answer = answerTravelQuestion("Donde esta Punta Arenas");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("supported");
    expect(answer.card!.id).toBe("punta-arenas");
  });
});

describe("answerTravelQuestion — destination-info uncovered destination", () => {
  it("returns unsupported/destination-info for '¿Qué es Ushuaia?'", () => {
    const answer = answerTravelQuestion("¿Qué es Ushuaia?");

    expect(answer.intent).toBe("destination-info");
    if (
      !("suggestedInternalLinks" in answer) ||
      "distinctReferents" in answer ||
      "pathways" in answer ||
      "facts" in answer
    ) {
      throw new Error("Expected DestinationCardAnswer");
    }
    expect(answer.status).toBe("unsupported");
    expect(answer.confidence).toBe("none");
    expect(answer.sources).toEqual([]);
    expect(answer.suggestedInternalLinks).toEqual([]);
  });
});

describe("answerTravelQuestion — fallback unknown", () => {
  it("returns unknown for 'Puerto Williams' without info indicator", () => {
    const answer = answerTravelQuestion("Puerto Williams");

    expect(answer.status).toBe("unsupported");
    expect(answer.intent).toBe("unknown");
  });

  it("returns unknown for unrelated question '¿Cuánto cuesta un café?'", () => {
    const answer = answerTravelQuestion("¿Cuánto cuesta un café?");

    expect(answer.status).toBe("unsupported");
    expect(answer.intent).toBe("unknown");
  });
});

describe("answerTravelQuestion — connectivity regression", () => {
  it("still returns connectivity for Santiago → Puerto Williams travel question", () => {
    const answer = answerTravelQuestion("¿Cómo llegar desde Santiago a Puerto Williams?");

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    if (!("stages" in answer)) throw new Error("Expected TravelAnswer with stages");
    expect(answer.stages).toHaveLength(2);
    expect(answer.stages[0]?.to).toBe("Punta Arenas");
  });
});

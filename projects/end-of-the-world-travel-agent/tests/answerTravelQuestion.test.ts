import { describe, expect, it } from "vitest";
import { answerTravelQuestion } from "../src/application/answerTravelQuestion.js";

describe("answerTravelQuestion", () => {
  it("returns the supported Santiago to Puerto Williams route", () => {
    const answer = answerTravelQuestion("¿Cómo llegar desde Santiago a Puerto Williams?");

    expect(answer.status).toBe("supported");
    expect(answer.intent).toBe("connectivity");
    expect(answer.stages).toHaveLength(2);
    expect(answer.stages[0]?.to).toBe("Punta Arenas");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.verifiedAt).toBeTruthy();
  });

  it("does not invent an answer for an unsupported question", () => {
    const answer = answerTravelQuestion("¿Cuál es el precio de un crucero mañana?");

    expect(answer.status).toBe("unsupported");
    expect(answer.stages).toHaveLength(0);
    expect(answer.sources).toHaveLength(0);
  });
});

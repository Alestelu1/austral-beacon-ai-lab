import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { routeRetrievalQuery, type RetrievalRoute } from "../src/retrieval/RetrievalQueryRouter.js";

type RoutingEvalSet = {
  eval_id: string;
  cases: Array<{
    id: string;
    query: string;
    expected_route: RetrievalRoute;
  }>;
};

async function loadJson<T>(relativeFromRepoRoot: string): Promise<T> {
  const filePath = path.resolve(process.cwd(), "../..", relativeFromRepoRoot);
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

describe("Puerto Williams stable-vs-live retrieval routing", () => {
  it("matches the audited routing benchmark", async () => {
    const evalSet = await loadJson<RoutingEvalSet>("data/retrieval/retrieval-routing-eval-puerto-williams-v1.json");

    const failures = evalSet.cases
      .map((testCase) => ({
        ...testCase,
        actual: routeRetrievalQuery(testCase.query)
      }))
      .filter((testCase) => testCase.actual.route !== testCase.expected_route);

    expect(failures).toEqual([]);
  });

  it("routes current road, schedule, stock, outage and medical-state questions to live verification", () => {
    const liveQueries = [
      "¿Está abierta la Y-905 hoy?",
      "¿Cuál es el horario actual del ferry?",
      "¿Hay combustible disponible ahora?",
      "¿Hay corte de agua en este momento?",
      "¿Hay ambulancia disponible esta noche?"
    ];

    for (const query of liveQueries) {
      const decision = routeRetrievalQuery(query);
      expect(decision.route).toBe("live_verification");
      expect(decision.matchedSignals.length).toBeGreaterThan(0);
    }
  });

  it("keeps stable entity and policy questions in RAG", () => {
    const stableQueries = [
      "¿Dónde está Puerto Williams?",
      "¿Qué carretera conecta Puerto Williams con Puerto Navarino?",
      "¿Qué sabemos de Puerto Williams como gateway antártico?",
      "¿Cómo se llama el hospital de Puerto Williams?"
    ];

    for (const query of stableQueries) {
      expect(routeRetrievalQuery(query).route).toBe("stable_rag");
    }
  });
});

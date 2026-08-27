import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  runRagRegressionSuite,
  validateSuite,
  type RagRegressionSuite,
} from "../src/qa/ragRegression.js";

const here = dirname(fileURLToPath(import.meta.url));
const suitePath = resolve(here, "../../../tests/rag/batch-03-puerto-williams-qa.json");

async function loadSuite(): Promise<RagRegressionSuite> {
  const raw = await readFile(suitePath, "utf8");
  return JSON.parse(raw) as RagRegressionSuite;
}

describe("Batch 03 Puerto Williams RAG regression suite", () => {
  it("has a valid executable-suite structure", async () => {
    const suite = await loadSuite();
    expect(validateSuite(suite)).toEqual([]);
    expect(suite.cases).toHaveLength(15);
  });

  it("runs deterministically with explicit answer assertions", async () => {
    const suite = await loadSuite();
    const enriched: RagRegressionSuite = {
      ...suite,
      cases: suite.cases.slice(0, 2).map((testCase) => ({
        ...testCase,
        must_include:
          testCase.id === "pw-qa-001"
            ? ["entidades distintas"]
            : ["Isla Navarino"],
      })),
    };

    const answers = new Map([
      ["pw-qa-001", "No. Puerto Williams y Puerto Toro son entidades distintas dentro de la comuna de Cabo de Hornos."],
      ["pw-qa-002", "Sí. Puerto Williams se ubica en Isla Navarino."],
    ]);

    const report = await runRagRegressionSuite(enriched, (question) => {
      const testCase = enriched.cases.find((item) => item.question === question);
      return testCase ? answers.get(testCase.id) ?? "" : "";
    });

    expect(report.total).toBe(2);
    expect(report.passed).toBe(2);
    expect(report.failed).toBe(0);
  });

  it("can delegate semantic equivalence to a future model/retrieval judge", async () => {
    const suite = await loadSuite();
    const singleCase: RagRegressionSuite = { ...suite, cases: [suite.cases[0]] };

    const report = await runRagRegressionSuite(
      singleCase,
      () => "Puerto Williams y Puerto Toro no son el mismo asentamiento.",
      ({ answer }) => answer.includes("no son el mismo"),
    );

    expect(report.failed).toBe(0);
  });
});

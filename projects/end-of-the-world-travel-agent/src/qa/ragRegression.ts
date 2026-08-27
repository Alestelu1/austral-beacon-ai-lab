export type RagFailureClass =
  | "entity_failure"
  | "temporal_failure"
  | "unsupported_inference"
  | "source_routing_failure"
  | "capability_access_failure"
  | string;

export interface RagRegressionCase {
  id: string;
  question: string;
  expected: string;
  failure_class: RagFailureClass;
  must_include?: string[];
  must_not_include?: string[];
}

export interface RagRegressionSuite {
  suite_id: string;
  scope: string;
  status: string;
  cases: RagRegressionCase[];
  global_rules?: string[];
}

export interface RagRegressionResult {
  id: string;
  question: string;
  answer: string;
  passed: boolean;
  failures: string[];
}

export interface RagRegressionReport {
  suite_id: string;
  total: number;
  passed: number;
  failed: number;
  results: RagRegressionResult[];
}

export type AnswerQuestion = (question: string) => Promise<string> | string;
export type SemanticJudge = (input: {
  question: string;
  expected: string;
  answer: string;
  failureClass: RagFailureClass;
}) => Promise<boolean> | boolean;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function validateSuite(suite: RagRegressionSuite): string[] {
  const errors: string[] = [];

  if (!suite.suite_id?.trim()) errors.push("suite_id is required");
  if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
    errors.push("cases must contain at least one regression case");
    return errors;
  }

  const ids = new Set<string>();
  for (const testCase of suite.cases) {
    if (!testCase.id?.trim()) errors.push("case id is required");
    if (ids.has(testCase.id)) errors.push(`duplicate case id: ${testCase.id}`);
    ids.add(testCase.id);

    if (!testCase.question?.trim()) errors.push(`${testCase.id}: question is required`);
    if (!testCase.expected?.trim()) errors.push(`${testCase.id}: expected is required`);
    if (!testCase.failure_class?.trim()) errors.push(`${testCase.id}: failure_class is required`);
  }

  return errors;
}

export async function runRagRegressionSuite(
  suite: RagRegressionSuite,
  answerQuestion: AnswerQuestion,
  semanticJudge?: SemanticJudge,
): Promise<RagRegressionReport> {
  const suiteErrors = validateSuite(suite);
  if (suiteErrors.length > 0) {
    throw new Error(`Invalid RAG regression suite:\n${suiteErrors.join("\n")}`);
  }

  const results: RagRegressionResult[] = [];

  for (const testCase of suite.cases) {
    const answer = await answerQuestion(testCase.question);
    const normalizedAnswer = normalize(answer);
    const failures: string[] = [];

    for (const required of testCase.must_include ?? []) {
      if (!normalizedAnswer.includes(normalize(required))) {
        failures.push(`missing required phrase: ${required}`);
      }
    }

    for (const prohibited of testCase.must_not_include ?? []) {
      if (normalizedAnswer.includes(normalize(prohibited))) {
        failures.push(`contains prohibited phrase: ${prohibited}`);
      }
    }

    if (semanticJudge) {
      const semanticallyCorrect = await semanticJudge({
        question: testCase.question,
        expected: testCase.expected,
        answer,
        failureClass: testCase.failure_class,
      });
      if (!semanticallyCorrect) failures.push("semantic judge rejected answer");
    }

    results.push({
      id: testCase.id,
      question: testCase.question,
      answer,
      passed: failures.length === 0,
      failures,
    });
  }

  const passed = results.filter((result) => result.passed).length;
  return {
    suite_id: suite.suite_id,
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}

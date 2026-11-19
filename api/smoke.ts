import { answerViaAssistant } from "../projects/end-of-the-world-travel-agent/src/application/answerViaAssistant.js";

/**
 * Protected-preview smoke test, not a public monitoring endpoint.
 * Exercises the actual bundled knowledge imports without storing user input.
 */
export async function GET(): Promise<Response> {
  if (process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED !== "true") {
    return Response.json({ error: { code: "PREVIEW_DISABLED" } }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const cases = [
    { id: "puerto-williams", question: "¿Qué es Puerto Williams?", expectedStatus: "supported" },
    { id: "no-evidence", question: "¿Cuánto cuesta un café?", expectedStatus: "unsupported" },
  ] as const;
  const results: Array<{ id: string; actualStatus: string; intent: string; passed: boolean }> = [];
  try {
    for (const testCase of cases) {
      const answer = await answerViaAssistant(testCase.question);
      results.push({
        id: testCase.id,
        actualStatus: answer.status,
        intent: answer.intent,
        passed: answer.status === testCase.expectedStatus,
      });
    }
    const ok = results.every((result) => result.passed);
    return Response.json({ ok, results }, {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    console.error("[Travel Assistant preview] Smoke test failed");
    return Response.json({ ok: false, error: "SMOKE_FAILED" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

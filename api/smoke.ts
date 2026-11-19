import { POST as answerPost } from "./answer.js";

/**
 * Protected-preview smoke test, not a public monitoring endpoint.
 * Exercises the actual bundled knowledge imports without storing user input.
 */
export async function GET(): Promise<Response> {
  if (process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED !== "true") {
    return Response.json({ error: { code: "PREVIEW_DISABLED" } }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const cases = [
    { id: "puerto-williams", question: "¿Qué es Puerto Williams?", expectedStatus: "supported", locale: "es" },
    { id: "no-evidence", question: "¿Cuánto cuesta un café?", expectedStatus: "unsupported", locale: "es" },
    { id: "puerto-williams-en", question: "What is Puerto Williams?", expectedStatus: "supported", locale: "en" },
    { id: "route-en", question: "How can I travel from Punta Arenas to Puerto Williams?", expectedStatus: "supported", locale: "en" },
  ] as const;
  const results: Array<{ id: string; actualStatus: string; intent: string; passed: boolean }> = [];
  try {
    for (const testCase of cases) {
      // Route through the *actual* POST handler, not a shortcut to the engine.
      const response = await answerPost(new Request("https://preview.local/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: testCase.question, locale: testCase.locale }),
      }));
      const answer = await response.json() as { status?: string; intent?: string; summary?: string };
      const englishOk = testCase.locale !== "en" || (typeof answer.summary === "string" && !answer.summary.includes("se encuentra") && (testCase.id !== "route-en" || (answer.summary.includes("DAP") && answer.summary.includes("TABSA"))));
      results.push({
        id: testCase.id,
        actualStatus: answer.status ?? "invalid",
        intent: answer.intent ?? "invalid",
        passed: response.status === 200 && answer.status === testCase.expectedStatus && englishOk,
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

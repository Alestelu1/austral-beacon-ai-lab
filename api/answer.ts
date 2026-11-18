import { answerViaAssistant } from "../projects/end-of-the-world-travel-agent/src/application/answerViaAssistant.js";

const MAX_BODY_BYTES = 16_384;
const MAX_QUESTION_CHARS = 2_000;
const TIMEOUT_MS = 12_000;

function json(status: number, body: unknown, extraHeaders?: Record<string, string>): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}
function error(status: number, code: string, message: string): Response {
  return json(status, { error: { code, message } });
}

/**
 * Preview-only Vercel entrypoint. NO production use until authenticated
 * deployment, edge rate limits, dependency audit and E2E validation.
 *
 * The TRAVEL_ASSISTANT_PREVIEW_ENABLED flag is intentionally server-side;
 * the deployment returns 503 by default even if a route is publicly accessible.
 */
export async function POST(request: Request): Promise<Response> {
  if (process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED !== "true") {
    return error(503, "PREVIEW_DISABLED", "Travel Assistant preview is disabled");
  }

  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("content-type") ?? "")) {
    return error(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json");
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return error(413, "PAYLOAD_TOO_LARGE", "Request body too large");
  }

  let raw: string;
  try {
    const body = await request.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) {
      return error(413, "PAYLOAD_TOO_LARGE", "Request body too large");
    }
    raw = new TextDecoder("utf-8", { fatal: true }).decode(body);
  } catch {
    return error(400, "INVALID_JSON", "Invalid JSON body");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return error(400, "INVALID_JSON", "Invalid JSON body");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return error(400, "INVALID_REQUEST", "Request body must be a JSON object");
  }

  const question = (payload as Record<string, unknown>).question;
  if (typeof question !== "string" || !question.trim()) {
    return error(400, "INVALID_REQUEST", 'Field "question" must be a non-empty string');
  }
  const trimmed = question.trim();
  if (trimmed.length > MAX_QUESTION_CHARS) {
    return error(400, "QUESTION_TOO_LONG", "Question exceeds 2000 characters");
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      answerViaAssistant(trimmed),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("ANSWER_TIMEOUT")), TIMEOUT_MS);
      }),
    ]);
    return json(200, result);
  } catch (cause) {
    if (cause instanceof Error && cause.message === "ANSWER_TIMEOUT") {
      return error(504, "ANSWER_TIMEOUT", "Answer timed out");
    }
    // Never echo stack traces, sources, prompts or implementation details to callers.
    console.error("[Travel Assistant preview] Answer failed");
    return error(500, "INTERNAL_ERROR", "Internal server error");
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function GET(): Response {
  return json(405, { error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } }, { Allow: "POST" });
}

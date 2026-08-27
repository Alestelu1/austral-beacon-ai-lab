import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { answerViaAssistant } from "../application/answerViaAssistant.js";
import { handleStaticRequest } from "./staticHandler.js";

const MAX_BODY_BYTES = 16384; // 16 KB

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(payload);
}

function sendError(res: ServerResponse, status: number, code: string, message: string): void {
  sendJson(res, status, { error: { code, message } });
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let tooLarge = false;

    req.on("data", (chunk: Buffer) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        req.removeAllListeners("data");
        req.resume(); // drain remaining data without accumulating
        reject(new Error("PAYLOAD_TOO_LARGE"));
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (!tooLarge) {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      }
    });

    req.on("error", (err) => {
      if (!tooLarge) {
        reject(err);
      }
    });
  });
}

export interface CreateAppOptions {
  /** Override the answer function. Async answerers are supported for semantic retrieval. */
  answerFn?: (question: string) => unknown | Promise<unknown>;
}

export function createApp(options?: CreateAppOptions): Server {
  const answer = options?.answerFn ?? answerViaAssistant;

  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = req.url ?? "/";
      const method = req.method ?? "GET";

      // Serve static files for GET requests
      if (method === "GET" && handleStaticRequest(req, res)) {
        return;
      }

      if (url === "/health") {
        if (method !== "GET") {
          res.setHeader("Allow", "GET");
          sendError(res, 405, "METHOD_NOT_ALLOWED", "Method not allowed");
          return;
        }
        sendJson(res, 200, { status: "ok", service: "end-of-the-world-travel-agent" });
        return;
      }

      if (url === "/api/answer") {
        if (method !== "POST") {
          res.setHeader("Allow", "POST");
          sendError(res, 405, "METHOD_NOT_ALLOWED", "Method not allowed");
          return;
        }

        let body: string;
        try {
          body = await readBody(req);
        } catch (err) {
          if (err instanceof Error && err.message === "PAYLOAD_TOO_LARGE") {
            sendError(res, 413, "PAYLOAD_TOO_LARGE", "Request body too large");
            return;
          }
          sendError(res, 400, "INVALID_JSON", "Invalid JSON body");
          return;
        }

        if (body.length === 0) {
          sendError(res, 400, "INVALID_JSON", "Invalid JSON body");
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(body);
        } catch {
          sendError(res, 400, "INVALID_JSON", "Invalid JSON body");
          return;
        }

        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          sendError(res, 400, "INVALID_REQUEST", "Request body must be a JSON object");
          return;
        }

        const obj = parsed as Record<string, unknown>;
        if (!("question" in obj)) {
          sendError(res, 400, "INVALID_REQUEST", "Field \"question\" is required");
          return;
        }
        if (typeof obj["question"] !== "string") {
          sendError(res, 400, "INVALID_REQUEST", "Field \"question\" must be a non-empty string");
          return;
        }
        if (obj["question"].trim().length === 0) {
          sendError(res, 400, "INVALID_REQUEST", "Field \"question\" must be a non-empty string");
          return;
        }

        const question = obj["question"].trim();
        const result = await answer(question);
        sendJson(res, 200, result);
        return;
      }

      sendError(res, 404, "NOT_FOUND", "Route not found");
    } catch (err) {
      console.error("[API] Internal error:", err);
      sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
    }
  });
}

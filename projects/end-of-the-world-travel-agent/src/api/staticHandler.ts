import { type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve, normalize, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const PUBLIC_DIR = resolve(__dirname, "../../public");
const JS_DIR = resolve(PUBLIC_DIR, "js");

interface StaticRoute {
  urlPath: string;
  filePath: string;
  contentType: string;
}

/**
 * Whitelist of root-level static files.
 */
const STATIC_ROUTES: StaticRoute[] = [
  { urlPath: "/", filePath: join(PUBLIC_DIR, "index.html"), contentType: "text/html; charset=utf-8" },
  { urlPath: "/styles.css", filePath: join(PUBLIC_DIR, "styles.css"), contentType: "text/css; charset=utf-8" },
];

/**
 * Attempts to handle a static file request.
 * Returns true if the request was handled, false otherwise.
 *
 * Root-level static files (/, /styles.css) are served via whitelist.
 * JavaScript modules under /js/ are resolved dynamically but constrained:
 * only .js extensions are allowed, and the resolved path must stay
 * inside public/js/ (prevents directory traversal).
 *
 * Returns false for unrecognized paths, allowing existing API logic
 * to handle them.
 */
export function handleStaticRequest(
  req: IncomingMessage,
  res: ServerResponse
): boolean {
  const url = req.url ?? "";

  // Check whitelist first
  for (const route of STATIC_ROUTES) {
    if (url === route.urlPath) {
      return serveFile(res, route.filePath, route.contentType);
    }
  }

  // Dynamic JS module resolution under /js/
  if (url.startsWith("/js/") && url.endsWith(".js")) {
    const relativePath = url.slice(4); // Remove "/js/" prefix

    // Normalize and resolve the path
    const normalized = normalize(relativePath);
    const resolved = resolve(JS_DIR, normalized);

    // Directory traversal check: resolved path must be inside JS_DIR
    if (!resolved.startsWith(JS_DIR + "\\") && !resolved.startsWith(JS_DIR + "/") && resolved !== JS_DIR) {
      send404(res);
      return true;
    }

    return serveFile(res, resolved, "application/javascript; charset=utf-8");
  }

  // Not a static file request
  return false;
}

/**
 * Reads a file from disk and serves it with the given content type.
 * Returns true (request was handled) regardless of success or failure.
 */
function serveFile(res: ServerResponse, filePath: string, contentType: string): boolean {
  try {
    if (!existsSync(filePath)) {
      send404(res);
      return true;
    }

    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
    return true;
  } catch {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }));
    return true;
  }
}

/**
 * Sends a 404 response.
 */
function send404(res: ServerResponse): void {
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: { code: "NOT_FOUND", message: "File not found" } }));
}

import { describe, expect, it } from "vitest";
import { verifyY905Live } from "../src/live/Y905LiveVerificationService.js";

function response(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/html" } });
}

const checkedAt = new Date("2026-08-26T14:00:00.000Z");

function createFetch(pages: Record<string, Response | (() => Response)>) {
  return async (input: string): Promise<Response> => {
    const entry = pages[input];
    if (!entry) return response("not found", 404);
    return typeof entry === "function" ? entry() : entry.clone();
  };
}

describe("verifyY905Live", () => {
  it("returns verified_open when a registered official source publishes fresh explicit Y-905 state", async () => {
    const index = `
      <a href="/2026/08/26/ruta-y-905-abierta/">Estado Ruta Y-905</a>
    `;
    const article = `
      <html><head>
        <meta property="og:title" content="Estado Ruta Y-905" />
        <meta property="article:published_time" content="2026-08-26T09:00:00-04:00" />
      </head><body>
        <p>La Ruta Y-905 se encuentra abierta y transitable entre Puerto Williams y Puerto Navarino.</p>
      </body></html>
    `;

    const fetchImpl = createFetch({
      "https://dppantartica.dpp.gob.cl/": response(index),
      "https://dppantartica.dpp.gob.cl/2026/08/26/ruta-y-905-abierta/": response(article),
      "https://magallanes.mop.gob.cl/": response("<html><body>Sin novedades</body></html>")
    });

    const result = await verifyY905Live({ fetchImpl, checkedAt });

    expect(result.verification.status).toBe("verified_open");
    expect(result.verification.source?.sourceId).toBe("dpp-antartica");
    expect(result.publicationCount).toBe(1);
    expect(result.adaptedPublicationCount).toBe(1);
  });

  it("returns not_verified when the only explicit statement is stale", async () => {
    const index = `<a href="/2026/08/20/ruta-y-905/">Ruta Y-905</a>`;
    const article = `
      <meta property="article:published_time" content="2026-08-20T10:00:00-04:00" />
      <p>La Ruta Y-905 se encuentra abierta y transitable.</p>
    `;

    const fetchImpl = createFetch({
      "https://dppantartica.dpp.gob.cl/": response(index),
      "https://dppantartica.dpp.gob.cl/2026/08/20/ruta-y-905/": response(article),
      "https://magallanes.mop.gob.cl/": response("<html></html>")
    });

    const result = await verifyY905Live({ fetchImpl, checkedAt, maxEvidenceAgeHours: 24 });

    expect(result.verification.status).toBe("not_verified");
    expect(result.observations).toHaveLength(1);
  });

  it("returns not_verified rather than inferring state from generic ice warnings", async () => {
    const index = `<a href="/2026/08/26/hielo-rutas/">Hielo en rutas de Isla Navarino</a>`;
    const article = `
      <meta property="article:published_time" content="2026-08-26T08:00:00-04:00" />
      <p>Se recomienda precaución por hielo lavado en rutas de Isla Navarino.</p>
    `;

    const fetchImpl = createFetch({
      "https://dppantartica.dpp.gob.cl/": response(index),
      "https://dppantartica.dpp.gob.cl/2026/08/26/hielo-rutas/": response(article),
      "https://magallanes.mop.gob.cl/": response("<html></html>")
    });

    const result = await verifyY905Live({ fetchImpl, checkedAt });

    expect(result.verification.status).toBe("not_verified");
    expect(result.adaptedPublicationCount).toBe(0);
  });

  it("survives one official source failure and still checks the other", async () => {
    const fetchImpl = async (input: string): Promise<Response> => {
      if (input === "https://magallanes.mop.gob.cl/") throw new Error("network failure");
      if (input === "https://dppantartica.dpp.gob.cl/") {
        return response(`<a href="/2026/08/26/y905-cerrada/">Ruta Y-905 cerrada</a>`);
      }
      if (input === "https://dppantartica.dpp.gob.cl/2026/08/26/y905-cerrada/") {
        return response(`
          <meta property="article:published_time" content="2026-08-26T09:30:00-04:00" />
          <p>La Ruta Y-905 permanece cerrada por acumulación de nieve.</p>
        `);
      }
      return response("not found", 404);
    };

    const result = await verifyY905Live({ fetchImpl, checkedAt });

    expect(result.verification.status).toBe("verified_closed");
    expect(result.warnings.some((warning) => warning.includes("mop-magallanes-regional"))).toBe(true);
  });
});

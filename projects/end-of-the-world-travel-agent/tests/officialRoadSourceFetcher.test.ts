import { describe, expect, it } from "vitest";
import { fetchOfficialRoadSource } from "../src/live/OfficialRoadSourceFetcher.js";
import type { LiveVerificationSource } from "../src/live/LiveVerificationSourceRegistry.js";

const source: LiveVerificationSource = {
  source_id: "dpp-antartica",
  producer: "Delegación Presidencial Provincial de la Antártica Chilena",
  source_class: "official_publication_monitor",
  url: "https://dppantartica.dpp.gob.cl/",
  machine_readable: false,
  operational_scope: ["road_condition"],
  notes: "test"
};

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, { status, headers: { "content-type": "text/html" } });
}

describe("fetchOfficialRoadSource", () => {
  it("discovers road-related candidates and normalizes dated official pages", async () => {
    const fetchImpl = async (url: string) => {
      if (url === source.url) {
        return htmlResponse(`
          <a href="/2026/08/26/estado-ruta-y-905/">Estado Ruta Y-905</a>
          <a href="/turismo/">Turismo general</a>
        `);
      }
      return htmlResponse(`
        <html>
          <head>
            <meta property="og:title" content="Estado de Ruta Y-905" />
            <meta content="2026-08-26T09:00:00-04:00" property="article:published_time" />
          </head>
          <body>La Ruta Y-905 se encuentra abierta y transitable.</body>
        </html>
      `);
    };

    const result = await fetchOfficialRoadSource(source, {
      fetchImpl,
      fetchedAt: new Date("2026-08-26T14:00:00Z")
    });

    expect(result.publications).toHaveLength(1);
    expect(result.publications[0]?.title).toBe("Estado de Ruta Y-905");
    expect(result.publications[0]?.text).toContain("Ruta Y-905 se encuentra abierta");
    expect(result.publications[0]?.publishedAt).toBe("2026-08-26T13:00:00.000Z");
  });

  it("uses registered official search pages when the homepage has no road candidate", async () => {
    const discoverySource: LiveVerificationSource = {
      ...source,
      discovery_urls: [source.url, `${source.url}?s=ruta`]
    };

    const fetchImpl = async (url: string) => {
      if (url === source.url) return htmlResponse('<a href="/cultura/">Cultura</a>');
      if (url === `${source.url}?s=ruta`) {
        return htmlResponse('<a href="/2026/08/10/afiche-recomendaciones-frente-a-hielo-lavado-en-rutas-de-isla-navarino/">Recomendaciones frente a hielo lavado en rutas de Isla Navarino</a>');
      }
      return htmlResponse(`
        <html><body>
          <div>10 de Agosto de 2026</div>
          <p>Atención en las rutas de Isla Navarino por hielo lavado.</p>
        </body></html>
      `);
    };

    const result = await fetchOfficialRoadSource(discoverySource, { fetchImpl });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0]?.sourceUrl).toContain("hielo-lavado-en-rutas-de-isla-navarino");
  });

  it("accepts a visible Spanish publication date used by DPP pages", async () => {
    const fetchImpl = async (url: string) => {
      if (url === source.url) {
        return htmlResponse('<a href="/2026/08/10/afiche-recomendaciones-frente-a-hielo-lavado-en-rutas-de-isla-navarino/">Recomendaciones frente a hielo lavado en rutas</a>');
      }
      return htmlResponse(`
        <html><head><title>Recomendaciones frente a hielo lavado</title></head>
        <body><div>10 de Agosto de 2026</div><p>Atención en las rutas de Isla Navarino por hielo lavado.</p></body></html>
      `);
    };

    const result = await fetchOfficialRoadSource(source, { fetchImpl });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0]?.publishedAt).toContain("2026-08-10");
  });

  it("can use the official YYYY/MM/DD permalink as a conservative date fallback", async () => {
    const fetchImpl = async (url: string) => {
      if (url === source.url) {
        return htmlResponse('<a href="/2026/08/26/ruta-y-905-transitable/">Ruta Y-905 transitable</a>');
      }
      return htmlResponse("<html><body>La Ruta Y-905 se encuentra transitable.</body></html>");
    };

    const result = await fetchOfficialRoadSource(source, { fetchImpl });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0]?.publishedAt).toContain("2026-08-26");
  });

  it("does not invent a date when neither the page nor URL exposes one", async () => {
    const fetchImpl = async (url: string) => {
      if (url === source.url) return htmlResponse('<a href="/ruta-y-905/">Ruta Y-905</a>');
      return htmlResponse("<html><body>Ruta Y-905 abierta.</body></html>");
    };

    const result = await fetchOfficialRoadSource(source, { fetchImpl });
    expect(result.publications).toEqual([]);
    expect(result.warnings.some((warning) => warning.includes("no detectable publication date"))).toBe(true);
  });

  it("returns acquisition warnings instead of throwing on discovery page HTTP failure", async () => {
    const fetchImpl = async () => htmlResponse("Unavailable", 503);
    const result = await fetchOfficialRoadSource(source, { fetchImpl });

    expect(result.publications).toEqual([]);
    expect(result.warnings.some((warning) => warning.includes("Discovery page request failed with HTTP 503"))).toBe(true);
  });

  it("ignores unrelated Puerto Williams publications on official discovery pages", async () => {
    const fetchImpl = async () => htmlResponse(`
      <a href="/2026/08/24/puerto-williams-disfruta-concierto-de-musica-clasica/">Puerto Williams disfruta concierto de música clásica</a>
      <a href="/cultura/">Actividad cultural</a>
    `);
    const result = await fetchOfficialRoadSource(source, { fetchImpl });

    expect(result.publications).toEqual([]);
    expect(result.warnings).toContain("No road-condition candidate publication links were discovered on registered official discovery pages.");
  });
});

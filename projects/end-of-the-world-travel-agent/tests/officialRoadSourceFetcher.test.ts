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
            <meta property="article:published_time" content="2026-08-26T09:00:00-04:00" />
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

  it("does not invent a date when the official page lacks one", async () => {
    const fetchImpl = async (url: string) => {
      if (url === source.url) return htmlResponse('<a href="/ruta-y-905/">Ruta Y-905</a>');
      return htmlResponse("<html><body>Ruta Y-905 abierta.</body></html>");
    };

    const result = await fetchOfficialRoadSource(source, { fetchImpl });
    expect(result.publications).toEqual([]);
    expect(result.warnings.some((warning) => warning.includes("no machine-detectable publication date"))).toBe(true);
  });

  it("returns an acquisition warning instead of throwing on source index HTTP failure", async () => {
    const fetchImpl = async () => htmlResponse("Unavailable", 503);
    const result = await fetchOfficialRoadSource(source, { fetchImpl });

    expect(result.publications).toEqual([]);
    expect(result.warnings).toContain("Source index request failed with HTTP 503.");
  });

  it("ignores unrelated links on the official source index", async () => {
    const fetchImpl = async () => htmlResponse('<a href="/cultura/">Actividad cultural</a>');
    const result = await fetchOfficialRoadSource(source, { fetchImpl });

    expect(result.publications).toEqual([]);
    expect(result.warnings).toContain("No road-condition candidate publication links were discovered on the source index.");
  });
});

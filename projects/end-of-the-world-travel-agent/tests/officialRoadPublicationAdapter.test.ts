import { describe, expect, it } from "vitest";
import { adaptOfficialRoadPublication } from "../src/live/OfficialRoadPublicationAdapter.js";

const producer = "Delegación Presidencial Provincial de la Antártica Chilena";

function publication(text: string, title = "Estado de rutas") {
  return {
    sourceId: "dpp-antartica",
    sourceUrl: "https://dppantartica.dpp.gob.cl/example",
    producer,
    publishedAt: "2026-08-26T10:00:00-04:00",
    title,
    text
  };
}

describe("adaptOfficialRoadPublication", () => {
  it("creates an open observation only when Y-905 and open state are explicit", () => {
    const result = adaptOfficialRoadPublication(
      publication("La Ruta Y-905 se encuentra abierta y transitable entre Puerto Williams y Puerto Navarino.")
    );

    expect(result.routeMentioned).toBe(true);
    expect(result.explicitStateFound).toBe(true);
    expect(result.observation?.routeState).toBe("open");
  });

  it("creates a closed observation for an explicit Y-905 closure", () => {
    const result = adaptOfficialRoadPublication(
      publication("Se informa que la Ruta Y-905 permanece cerrada por acumulación de nieve.")
    );

    expect(result.observation?.routeState).toBe("closed");
  });

  it("creates a restricted observation only for an explicit restriction", () => {
    const result = adaptOfficialRoadPublication(
      publication("La Ruta Y-905 mantiene tránsito restringido durante las labores de despeje.")
    );

    expect(result.observation?.routeState).toBe("restricted");
  });

  it("does not turn a generic Isla Navarino ice warning into Y-905 evidence", () => {
    const result = adaptOfficialRoadPublication(
      publication(
        "Atención en las rutas de Isla Navarino. Las bajas temperaturas pueden favorecer hielo lavado. Conduce con extrema precaución.",
        "Recomendaciones frente a hielo lavado en rutas de Isla Navarino"
      )
    );

    expect(result.routeMentioned).toBe(false);
    expect(result.observation).toBeNull();
  });

  it("keeps a Y-905 maintenance publication unknown when no operational state is explicit", () => {
    const result = adaptOfficialRoadPublication(
      publication("Vialidad realizará trabajos de reperfilado y mantenimiento en la Ruta Y-905 durante esta semana.")
    );

    expect(result.routeMentioned).toBe(true);
    expect(result.explicitStateFound).toBe(false);
    expect(result.observation?.routeState).toBe("unknown");
  });

  it("does not transfer another road's state to Y-905", () => {
    const result = adaptOfficialRoadPublication(
      publication("La Ruta Y-905 será inspeccionada mañana. El camino a Bocatoma se encuentra abierto y transitable.")
    );

    expect(result.routeMentioned).toBe(true);
    expect(result.explicitStateFound).toBe(false);
    expect(result.observation?.routeState).toBe("unknown");
  });

  it("can structure an older explicit route-scoped statement while leaving freshness to the verifier", () => {
    const result = adaptOfficialRoadPublication({
      sourceId: "dpp-antartica-stale-fixture",
      sourceUrl: "https://dppantartica.dpp.gob.cl/example-stale-y905",
      producer,
      publishedAt: "2023-08-07T12:00:00-04:00",
      title: "Estado de Ruta Y-905",
      text: "La Ruta Y-905 se encontraba abierta y transitable hacia Puerto Navarino al momento de la publicación."
    });

    expect(result.observation?.routeState).toBe("open");
    expect(result.observation?.publishedAt).toContain("2023-08-07");
  });
});

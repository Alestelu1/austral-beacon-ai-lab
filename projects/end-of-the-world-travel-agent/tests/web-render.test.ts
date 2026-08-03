import { describe, it, expect } from "vitest";
import { renderConnectivity } from "../src/ui/web/renderConnectivity.js";
import { renderDestination } from "../src/ui/web/renderDestination.js";
import { renderUnsupported } from "../src/ui/web/renderUnsupported.js";
import { renderError } from "../src/ui/web/renderError.js";
import { validateQuestion } from "../src/ui/web/app.client.js";

// --- Test fixtures ---

const connectivityAnswer = {
  status: "supported" as const,
  intent: "connectivity" as const,
  summary: "Ruta Santiago → Puerto Williams",
  stages: [
    { from: "Santiago", to: "Punta Arenas", mode: "air", note: "Vuelo directo LATAM o JetSmart" },
    { from: "Punta Arenas", to: "Puerto Williams", mode: "air", note: "DAP Airlines, sujeto a clima" },
  ],
  warnings: ["Vuelos a Puerto Williams cancelan frecuentemente por viento", "Reservar con anticipación en temporada alta"],
  sources: [
    { title: "DAP Airlines", publisher: "DAP", url: "https://www.dapairline.com", verifiedAt: "2025-06-01" },
    { title: "LATAM Chile", publisher: "LATAM Airlines", url: "https://www.latam.com", verifiedAt: "2025-05-15" },
  ],
  verifiedAt: "2025-06-01",
};

const destinationAnswer = {
  status: "supported" as const,
  intent: "destination-info" as const,
  summary: "Puerto Williams es la ciudad más austral del mundo.",
  confidence: "high" as const,
  warnings: ["Acceso limitado en invierno"],
  sources: [
    { title: "Municipalidad Cabo de Hornos", publisher: "Gobierno Regional", url: "https://www.municipalidadcabodehornos.cl", verifiedAt: "2025-04-01" },
    { title: "Chile Travel", publisher: "SERNATUR", url: "https://www.chile.travel", verifiedAt: "2025-03-20" },
    { title: "Guía Navarino", publisher: "Fundación Omora", url: "https://www.omora.org", verifiedAt: "2025-02-10" },
  ],
  suggestedInternalLinks: [
    { path: "/destinos/cabo-de-hornos", label: "Cabo de Hornos" },
    { path: "/rutas/santiago-puerto-williams", label: "Cómo llegar" },
  ],
  verifiedAt: "2025-04-01",
  card: {
    name: "Puerto Williams",
    stableData: {
      geographicContext: "Ubicada en la Isla Navarino, canal Beagle.",
      culturalContext: "Territorio ancestral del pueblo Yagán.",
    },
  },
};

// --- renderConnectivity ---

describe("renderConnectivity", () => {
  it("contains the summary text", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("Ruta Santiago → Puerto Williams");
  });

  it("contains all stages with from, to, mode and note", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("Santiago");
    expect(html).toContain("Punta Arenas");
    expect(html).toContain("Puerto Williams");
    expect(html).toContain("air");
    expect(html).toContain("Vuelo directo LATAM o JetSmart");
    expect(html).toContain("DAP Airlines, sujeto a clima");
  });

  it("contains all warnings", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("Vuelos a Puerto Williams cancelan frecuentemente por viento");
    expect(html).toContain("Reservar con anticipación en temporada alta");
  });

  it("contains all sources with title, publisher, URL and verifiedAt", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("DAP Airlines");
    expect(html).toContain("DAP");
    expect(html).toContain("https://www.dapairline.com");
    expect(html).toContain("2025-06-01");
    expect(html).toContain("LATAM Chile");
    expect(html).toContain("LATAM Airlines");
    expect(html).toContain("https://www.latam.com");
    expect(html).toContain("2025-05-15");
  });

  it("contains section labels (Resumen, Etapas, Advertencias, Fuentes)", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("Resumen");
    expect(html).toContain("Etapas");
    expect(html).toContain("Advertencias");
    expect(html).toContain("Fuentes");
  });

  it("contains the general verifiedAt date", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("2025-06-01");
  });

  it("uses the answer-connectivity class", () => {
    const html = renderConnectivity(connectivityAnswer);
    expect(html).toContain("answer-connectivity");
  });

  it("uses the route-stage class for each stage", () => {
    const html = renderConnectivity(connectivityAnswer);
    const matches = html.match(/route-stage/g);
    expect(matches).toHaveLength(2);
  });

  it("uses the source-item class for each source", () => {
    const html = renderConnectivity(connectivityAnswer);
    const matches = html.match(/source-item/g);
    expect(matches).toHaveLength(2);
  });

  it("throws when status is not supported", () => {
    const bad = { ...connectivityAnswer, status: "unsupported" as const };
    expect(() => renderConnectivity(bad)).toThrow();
  });

  it("throws when intent is not connectivity", () => {
    const bad = { ...connectivityAnswer, intent: "destination-info" as const };
    expect(() => renderConnectivity(bad as never)).toThrow();
  });

  it("escapes HTML in dynamic content", () => {
    const xss = {
      ...connectivityAnswer,
      summary: '<script>alert("xss")</script>',
    };
    const html = renderConnectivity(xss);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

// --- renderDestination ---

describe("renderDestination", () => {
  it("contains the destination name", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Puerto Williams");
  });

  it("contains the summary", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("ciudad más austral del mundo");
  });

  it("contains geographic context", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Isla Navarino");
    expect(html).toContain("canal Beagle");
  });

  it("contains cultural context", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("pueblo Yagán");
  });

  it("contains all warnings", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Acceso limitado en invierno");
  });

  it("contains all sources with clickable URLs", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Municipalidad Cabo de Hornos");
    expect(html).toContain("Gobierno Regional");
    expect(html).toContain('href="https://www.municipalidadcabodehornos.cl"');
    expect(html).toContain("2025-04-01");
    expect(html).toContain("Chile Travel");
    expect(html).toContain("SERNATUR");
    expect(html).toContain('href="https://www.chile.travel"');
    expect(html).toContain("Guía Navarino");
    expect(html).toContain("Fundación Omora");
    expect(html).toContain('href="https://www.omora.org"');
  });

  it("contains internal links with path and label", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Cabo de Hornos");
    expect(html).toContain("/destinos/cabo-de-hornos");
    expect(html).toContain("Cómo llegar");
    expect(html).toContain("/rutas/santiago-puerto-williams");
  });

  it("contains confidence level", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("Alta");
  });

  it("contains the verifiedAt date", () => {
    const html = renderDestination(destinationAnswer);
    expect(html).toContain("2025-04-01");
  });

  it("has 3 source-item blocks for 3 sources", () => {
    const html = renderDestination(destinationAnswer);
    const matches = html.match(/source-item/g);
    expect(matches).toHaveLength(3);
  });

  it("throws when status is not supported", () => {
    const bad = { ...destinationAnswer, status: "unsupported" as const };
    expect(() => renderDestination(bad)).toThrow();
  });
});

// --- renderUnsupported ---

describe("renderUnsupported", () => {
  it("shows 'destino no disponible' for intent destination-info", () => {
    const answer = {
      status: "unsupported" as const,
      intent: "destination-info" as const,
      summary: "",
      confidence: "none" as const,
      warnings: [],
      sources: [],
      suggestedInternalLinks: [],
    };
    const html = renderUnsupported(answer);
    expect(html).toContain("no está disponible");
  });

  it("shows 'consulta no reconocida' for intent unknown", () => {
    const answer = {
      status: "unsupported" as const,
      intent: "unknown" as const,
      summary: "",
      stages: [],
      warnings: [],
      sources: [],
    };
    const html = renderUnsupported(answer);
    expect(html).toContain("no fue reconocida");
  });

  it("throws when status is supported", () => {
    const answer = {
      status: "supported" as const,
      intent: "unknown" as const,
      summary: "",
      stages: [],
      warnings: [],
      sources: [],
    };
    expect(() => renderUnsupported(answer)).toThrow();
  });

  it("uses the answer-unsupported class", () => {
    const answer = {
      status: "unsupported" as const,
      intent: "destination-info" as const,
      summary: "",
      confidence: "none" as const,
      warnings: [],
      sources: [],
      suggestedInternalLinks: [],
    };
    const html = renderUnsupported(answer);
    expect(html).toContain("answer-unsupported");
  });
});

// --- renderError ---

describe("renderError", () => {
  it("shows connection failure message for network errors", () => {
    const html = renderError({ type: "network" });
    expect(html).toContain("No se pudo contactar al servidor");
  });

  it("shows the API error message for HTTP 400", () => {
    const html = renderError({ type: "http", status: 400, message: "Campo requerido" });
    expect(html).toContain("Campo requerido");
  });

  it("shows generic internal error for HTTP 500", () => {
    const html = renderError({ type: "http", status: 500 });
    expect(html).toContain("Error interno del servidor");
  });

  it("shows unexpected error for other HTTP statuses", () => {
    const html = renderError({ type: "http", status: 503 });
    expect(html).toContain("error inesperado");
  });

  it("does not expose technical details", () => {
    const html = renderError({ type: "http", status: 500, message: "/internal/path/secret.ts:42" });
    expect(html).not.toContain("/internal/path/secret.ts");
    expect(html).toContain("Error interno del servidor");
  });

  it("uses the answer-error class", () => {
    const html = renderError({ type: "network" });
    expect(html).toContain("answer-error");
  });

  it("escapes API error message for HTTP 400", () => {
    const html = renderError({ type: "http", status: 400, message: '<img src=x onerror=alert(1)>' });
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

// --- validateQuestion ---

describe("validateQuestion", () => {
  it("returns valid:false for empty string", () => {
    const result = validateQuestion("");
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("returns valid:false for whitespace-only string", () => {
    const result = validateQuestion("   \t\n  ");
    expect(result.valid).toBe(false);
  });

  it("returns valid:true for non-empty string", () => {
    const result = validateQuestion("hola");
    expect(result.valid).toBe(true);
  });

  it("returns valid:true for string with leading/trailing spaces", () => {
    const result = validateQuestion("  pregunta  ");
    expect(result.valid).toBe(true);
  });

  it("returns no message when valid", () => {
    const result = validateQuestion("test");
    expect(result.message).toBeUndefined();
  });
});

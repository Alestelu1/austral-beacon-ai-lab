import routeData from "../../data/routes/santiago-puerto-williams.json" with { type: "json" };
import type { RouteRecord, TravelAnswer } from "../domain/types.js";

const route = routeData as RouteRecord;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isSupportedConnectivityQuestion(question: string): boolean {
  const value = normalize(question);
  const mentionsOrigin = value.includes("santiago");
  const mentionsDestination = value.includes("puerto williams");
  const mentionsTravel = ["llegar", "viajar", "ir", "ruta", "conexion", "como llegar", "how to get", "travel", "route"].some((term) => value.includes(term));

  return mentionsOrigin && mentionsDestination && mentionsTravel;
}

export function answerTravelQuestion(question: string): TravelAnswer {
  if (!isSupportedConnectivityQuestion(question)) {
    return {
      status: "unsupported",
      intent: "unknown",
      summary: "La base local todavía no contiene evidencia suficiente para responder esta consulta.",
      stages: [],
      warnings: ["No se generó una respuesta especulativa."],
      sources: []
    };
  }

  return {
    status: "supported",
    intent: "connectivity",
    summary: route.summary,
    stages: route.stages,
    warnings: route.warnings,
    sources: route.sources,
    recommendedPage: route.recommendedPage,
    verifiedAt: route.verifiedAt
  };
}

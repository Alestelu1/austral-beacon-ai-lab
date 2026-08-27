export type RetrievalRoute = "stable_rag" | "live_verification";

export type RetrievalRoutingDecision = {
  route: RetrievalRoute;
  reason: string;
  matchedSignals: string[];
};

const LIVE_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "relative_time",
    pattern:
      /\b(hoy|ahora|ahora mismo|esta mañana|esta tarde|esta noche|mañana|esta semana|right now|today|this morning|this afternoon|tonight|tomorrow|this week|currently)\b/i
  },
  { label: "schedule", pattern: /\b(horario|hora sale|sale mañana|schedule|departure|departures)\b/i },
  { label: "availability", pattern: /\b(disponible|disponibilidad|available|availability|pasajes|tickets|booking)\b/i },
  {
    label: "road_condition",
    pattern:
      /\b(abierta|abierto|cerrada|cerrado|estado de la ruta|transitable|intransitable|se puede pasar|se puede transitar|se puede manejar|se puede conducir|puedo pasar|puedo manejar|puedo conducir|safe and open|road condition|drivable|driveable|passable|can i drive|can we drive|open to traffic|nieve|hielo|snow|ice)\b/i
  },
  { label: "service_outage", pattern: /\b(corte|interrupci[oó]n|outage|sin servicio|service interruption)\b/i },
  { label: "fuel_or_cash_state", pattern: /\b(combustible|fuel|efectivo|cash|cajero|atm)\b/i },
  { label: "medical_operational_state", pattern: /\b(especialistas|ambulancia|evacuaci[oó]n aerom[eé]dica|medevac|specialist|ambulance)\b/i },
  { label: "weather_or_trail_state", pattern: /\b(tiempo har[aá]|weather|condici[oó]n del sendero|trail condition)\b/i },
  { label: "commercial_operation_now", pattern: /\b(vuelos? comerciales?.*(hoy|esta semana|available)|commercial flights?.*(today|this week|available))\b/i }
];

export function routeRetrievalQuery(query: string): RetrievalRoutingDecision {
  const normalized = query.trim();
  if (!normalized) {
    return {
      route: "stable_rag",
      reason: "Empty query has no live operational signal; caller should handle validation separately.",
      matchedSignals: []
    };
  }

  const matchedSignals = LIVE_PATTERNS
    .filter(({ pattern }) => pattern.test(normalized))
    .map(({ label }) => label);

  if (matchedSignals.length > 0) {
    return {
      route: "live_verification",
      reason: "Query contains temporal or operational signals whose answer may change and should not rely on stale embeddings.",
      matchedSignals
    };
  }

  return {
    route: "stable_rag",
    reason: "Query asks for stable or dated knowledge without a current operational-state requirement.",
    matchedSignals: []
  };
}

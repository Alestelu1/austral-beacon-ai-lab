import type {
  AntarcticAccessAnswer,
  DestinationCardAnswer,
  RelationshipAnswer,
  StraitInfoAnswer,
  TravelAnswer
} from "../domain/types.js";

type AnyAnswer =
  | TravelAnswer
  | DestinationCardAnswer
  | RelationshipAnswer
  | AntarcticAccessAnswer
  | StraitInfoAnswer;

function isStraitInfoAnswer(answer: AnyAnswer): answer is StraitInfoAnswer {
  return answer.intent === "strait-info";
}

function isAntarcticAccessAnswer(answer: AnyAnswer): answer is AntarcticAccessAnswer {
  return answer.intent === "antarctic-access";
}

function isRelationshipAnswer(answer: AnyAnswer): answer is RelationshipAnswer {
  return answer.intent === "relationship";
}

function isDestinationCardAnswer(answer: AnyAnswer): answer is DestinationCardAnswer {
  return answer.intent === "destination-info";
}

function formatConnectivitySupported(answer: TravelAnswer): string {
  const lines: string[] = [];

  lines.push("━━━ Conectividad ━━━");
  lines.push("");
  lines.push(`Resumen: ${answer.summary}`);

  if (answer.stages.length > 0) {
    lines.push("");
    lines.push("Etapas:");
    for (let i = 0; i < answer.stages.length; i++) {
      const stage = answer.stages[i]!;
      const mode = stage.mode === "air-or-sea" ? "aéreo o marítimo" : stage.mode === "air" ? "aéreo" : stage.mode === "sea" ? "marítimo" : "terrestre";
      lines.push(`  ${i + 1}. ${stage.from} → ${stage.to} [${mode}]`);
      lines.push(`     ${stage.note}`);
    }
  }

  if (answer.warnings.length > 0) {
    lines.push("");
    lines.push("Advertencias:");
    for (const warning of answer.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  if (answer.sources.length > 0) {
    lines.push("");
    lines.push("Fuentes:");
    for (let i = 0; i < answer.sources.length; i++) {
      const source = answer.sources[i]!;
      lines.push(`  ${i + 1}. ${source.title}`);
      lines.push(`     Editor: ${source.publisher}`);
      lines.push(`     URL: ${source.url}`);
      lines.push(`     Verificado: ${source.verifiedAt}`);
    }
  }

  if (answer.verifiedAt) {
    lines.push("");
    lines.push(`Verificado: ${answer.verifiedAt}`);
  }

  return lines.join("\n");
}

function formatDestinationInfoSupported(answer: DestinationCardAnswer): string {
  const card = answer.card!;
  const lines: string[] = [];

  lines.push(`━━━ ${card.name} ━━━`);
  lines.push("");
  lines.push(`Resumen: ${answer.summary}`);

  lines.push("");
  lines.push("Contexto geográfico:");
  lines.push(`  ${card.stableData.geographicContext}`);

  lines.push("");
  lines.push("Contexto cultural:");
  lines.push(`  ${card.stableData.culturalContext}`);

  if (answer.warnings.length > 0) {
    lines.push("");
    lines.push("Advertencias:");
    for (const warning of answer.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  if (answer.sources.length > 0) {
    lines.push("");
    lines.push("Fuentes:");
    for (let i = 0; i < answer.sources.length; i++) {
      const source = answer.sources[i]!;
      lines.push(`  ${i + 1}. ${source.title}`);
      lines.push(`     Editor: ${source.publisher}`);
      lines.push(`     URL: ${source.url}`);
      lines.push(`     Verificado: ${source.verifiedAt}`);
    }
  }

  if (answer.suggestedInternalLinks.length > 0) {
    lines.push("");
    lines.push("Enlaces sugeridos:");
    for (const link of answer.suggestedInternalLinks) {
      lines.push(`  → ${link.path} — ${link.label}`);
    }
  }

  lines.push("");
  lines.push(`Confianza: ${answer.confidence}`);
  if (answer.verifiedAt) {
    lines.push(`Verificado: ${answer.verifiedAt}`);
  }

  return lines.join("\n");
}

function formatRelationshipSupported(answer: RelationshipAnswer): string {
  const lines: string[] = [];

  lines.push("━━━ Relación entre lugares ━━━");
  lines.push("");
  lines.push("Relación administrativa:");
  lines.push(`  ${answer.administrativeRelation}`);

  lines.push("");
  lines.push("Distinción geográfica:");
  lines.push(`  ${answer.geographicDistinction}`);

  if (answer.distinctReferents.length > 0) {
    lines.push("");
    lines.push("Referentes distintos del nombre:");
    for (const referent of answer.distinctReferents) {
      lines.push(`  • ${referent.name} [${referent.kind}]`);
      lines.push(`     ${referent.description}`);
    }
  }

  if (answer.warnings.length > 0) {
    lines.push("");
    lines.push("Advertencias:");
    for (const warning of answer.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  if (answer.sources.length > 0) {
    lines.push("");
    lines.push("Fuentes:");
    for (let i = 0; i < answer.sources.length; i++) {
      const source = answer.sources[i]!;
      lines.push(`  ${i + 1}. ${source.title}`);
      lines.push(`     Editor: ${source.publisher}`);
      lines.push(`     URL: ${source.url}`);
      lines.push(`     Verificado: ${source.verifiedAt}`);
    }
  }

  lines.push("");
  lines.push(`Confianza: ${answer.confidence}`);
  if (answer.verifiedAt) {
    lines.push(`Verificado: ${answer.verifiedAt}`);
  }

  return lines.join("\n");
}

function formatAntarcticAccessSupported(answer: AntarcticAccessAnswer): string {
  const categoryLabel: Record<string, string> = {
    "gateway-policy": "Contexto de política / gateway",
    "commercial-product": "Producto comercial publicado",
    "state-science": "Capacidad estatal o científica (no turística)",
    "planned-infrastructure": "Infraestructura planificada (no operativa)"
  };

  const lines: string[] = [];

  lines.push("━━━ Acceso a la Antártica desde Chile ━━━");
  lines.push("");
  lines.push(`Resumen: ${answer.summary}`);

  if (answer.pathways.length > 0) {
    lines.push("");
    lines.push("Vías de acceso (por categoría de evidencia):");
    for (const pathway of answer.pathways) {
      const label = categoryLabel[pathway.category] ?? pathway.category;
      lines.push(`  • [${label}] ${pathway.title} — origen: ${pathway.origin}`);
      lines.push(`     ${pathway.description}`);
    }
  }

  lines.push("");
  lines.push("Aclaración sobre Puerto Williams:");
  lines.push(`  ${answer.puertoWilliamsClarification}`);

  if (answer.warnings.length > 0) {
    lines.push("");
    lines.push("Advertencias:");
    for (const warning of answer.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  if (answer.sources.length > 0) {
    lines.push("");
    lines.push("Fuentes:");
    for (let i = 0; i < answer.sources.length; i++) {
      const source = answer.sources[i]!;
      lines.push(`  ${i + 1}. ${source.title}`);
      lines.push(`     Editor: ${source.publisher}`);
      lines.push(`     URL: ${source.url}`);
      lines.push(`     Verificado: ${source.verifiedAt}`);
    }
  }

  lines.push("");
  lines.push(`Confianza: ${answer.confidence}`);
  if (answer.verifiedAt) {
    lines.push(`Verificado: ${answer.verifiedAt}`);
  }

  return lines.join("\n");
}

function formatStraitInfoSupported(answer: StraitInfoAnswer): string {
  const lines: string[] = [];
  lines.push("━━━ Estrecho de Magallanes ━━━");
  lines.push("");
  lines.push(`Resumen: ${answer.summary}`);

  if (answer.warnings.length > 0) {
    lines.push("");
    lines.push("Advertencias:");
    for (const warning of answer.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  if (answer.sources.length > 0) {
    lines.push("");
    lines.push("Fuentes:");
    for (let i = 0; i < answer.sources.length; i++) {
      const source = answer.sources[i]!;
      lines.push(`  ${i + 1}. ${source.title}`);
      lines.push(`     Editor: ${source.publisher}`);
      lines.push(`     URL: ${source.url}`);
      lines.push(`     Verificado: ${source.verifiedAt}`);
    }
  }

  lines.push("");
  lines.push(`Confianza: ${answer.confidence}`);
  if (answer.verifiedAt) {
    lines.push(`Verificado: ${answer.verifiedAt}`);
  }
  return lines.join("\n");
}

function formatUnsupported(answer: AnyAnswer): string {
  if (isDestinationCardAnswer(answer)) {
    return "⚠ El destino consultado no está disponible en la base local.";
  }
  return "⚠ La base local todavía no contiene evidencia suficiente para responder esta consulta.";
}

export function formatAnswer(answer: AnyAnswer): string {
  if (answer.status === "unsupported") {
    return formatUnsupported(answer);
  }

  if (isStraitInfoAnswer(answer)) {
    return formatStraitInfoSupported(answer);
  }

  if (isAntarcticAccessAnswer(answer)) {
    return formatAntarcticAccessSupported(answer);
  }

  if (isRelationshipAnswer(answer)) {
    return formatRelationshipSupported(answer);
  }

  if (isDestinationCardAnswer(answer)) {
    return formatDestinationInfoSupported(answer);
  }

  return formatConnectivitySupported(answer);
}

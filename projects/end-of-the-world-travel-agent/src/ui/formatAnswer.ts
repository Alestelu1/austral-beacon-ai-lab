import type { DestinationCardAnswer, TravelAnswer } from "../domain/types.js";

function isDestinationCardAnswer(
  answer: TravelAnswer | DestinationCardAnswer
): answer is DestinationCardAnswer {
  return "confidence" in answer;
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

function formatUnsupported(answer: TravelAnswer | DestinationCardAnswer): string {
  if (isDestinationCardAnswer(answer)) {
    return "⚠ El destino consultado no está disponible en la base local.";
  }
  return "⚠ La base local todavía no contiene evidencia suficiente para responder esta consulta.";
}

export function formatAnswer(answer: TravelAnswer | DestinationCardAnswer): string {
  if (answer.status === "unsupported") {
    return formatUnsupported(answer);
  }

  if (isDestinationCardAnswer(answer)) {
    return formatDestinationInfoSupported(answer);
  }

  return formatConnectivitySupported(answer);
}

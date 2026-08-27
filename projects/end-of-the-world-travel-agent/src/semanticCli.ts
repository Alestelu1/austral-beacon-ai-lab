import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createGeminiTravelAssistantFromEnv } from "./application/createSemanticTravelAssistant.js";

const EXIT_COMMANDS = ["salir", "exit", "quit"];

async function main(): Promise<void> {
  const assistant = await createGeminiTravelAssistantFromEnv();
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("");
  console.log("═══ End of the World Travel Assistant — Semantic RAG ═══");
  console.log(`Provider: ${assistant.providerId}`);
  console.log(`Indexed chunks: ${assistant.indexedChunkCount}`);
  console.log("");
  console.log("Prueba conocimiento estable y consultas dinámicas.");
  console.log("Ejemplos:");
  console.log("  • ¿Qué carretera conecta Puerto Williams con Puerto Navarino?");
  console.log("  • ¿Está abierta la Ruta Y-905 hoy?");
  console.log("");

  try {
    while (true) {
      const line = await rl.question("▶ ");
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (EXIT_COMMANDS.includes(trimmed.toLowerCase())) break;

      const answer = await assistant.answer(trimmed);
      console.log("\n" + JSON.stringify(answer, null, 2) + "\n");
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("Semantic CLI failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

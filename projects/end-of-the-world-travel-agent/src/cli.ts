import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { answerTravelQuestion } from "./application/answerTravelQuestion.js";
import { formatAnswer } from "./ui/formatAnswer.js";

const EXIT_COMMANDS = ["salir", "exit", "quit"];

async function main(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("");
  console.log("═══ End of the World Travel Agent ═══");
  console.log("");
  console.log("Escribe una pregunta sobre el sur austral de Chile.");
  console.log("");
  console.log("Ejemplos:");
  console.log("  • ¿Cómo llegar desde Santiago a Puerto Williams?");
  console.log("  • ¿Qué es Puerto Williams?");
  console.log("  • Cuéntame sobre Punta Arenas");
  console.log("  • Información de Cabo de Hornos");
  console.log("");
  console.log("Escribe 'salir', 'exit' o 'quit' para terminar.");
  console.log("");

  try {
    while (true) {
      const line = await rl.question("▶ ");
      const trimmed = line.trim();

      if (trimmed.length === 0) continue;

      if (EXIT_COMMANDS.includes(trimmed.toLowerCase())) {
        console.log("\nHasta pronto. Buen viaje.");
        break;
      }

      const answer = answerTravelQuestion(trimmed);
      const output = formatAnswer(answer);
      console.log("\n" + output + "\n");
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ERR_USE_AFTER_CLOSE") {
      // readline closed (e.g. Ctrl+D)
    } else {
      console.error("\nError interno:", err instanceof Error ? err.message : err);
    }
  } finally {
    rl.close();
  }
}

main();

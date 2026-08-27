import { createGeminiTravelAssistantFromEnv } from "../application/createSemanticTravelAssistant.js";
import { createApp } from "./app.js";

const DEFAULT_PORT = 3000;

function resolvePort(value: string | undefined): number {
  if (!value) return DEFAULT_PORT;
  const parsedPort = Number.parseInt(value, 10);
  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65_535) {
    console.warn(`[API] Invalid PORT "${value}". Using ${DEFAULT_PORT}.`);
    return DEFAULT_PORT;
  }
  return parsedPort;
}

async function main(): Promise<void> {
  const assistant = await createGeminiTravelAssistantFromEnv();
  const port = resolvePort(process.env.PORT);
  const server = createApp({ answerFn: (question) => assistant.answer(question) });

  server.listen(port, () => {
    console.log(`[API] Semantic Travel Assistant listening on http://localhost:${port}`);
    console.log(`[API] Embedding provider: ${assistant.providerId}`);
    console.log(`[API] Indexed chunks: ${assistant.indexedChunkCount}`);
  });
}

main().catch((error) => {
  console.error("[API] Failed to initialize semantic Travel Assistant:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

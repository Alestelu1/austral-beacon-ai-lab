import { createApp } from "./app.js";

const DEFAULT_PORT = 3000;

function resolvePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const parsedPort = Number.parseInt(value, 10);

  if (
    !Number.isInteger(parsedPort) ||
    parsedPort < 1 ||
    parsedPort > 65_535
  ) {
    console.warn(
      `[API] Invalid PORT "${value}". Using ${DEFAULT_PORT}.`,
    );

    return DEFAULT_PORT;
  }

  return parsedPort;
}

const port = resolvePort(process.env.PORT);
const server = createApp();

server.listen(port, () => {
  console.log(`[API] Listening on http://localhost:${port}`);
});
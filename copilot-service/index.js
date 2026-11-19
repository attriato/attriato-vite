import { tmpdir } from "node:os";
import { join } from "node:path";
import { CopilotClient, RuntimeConnection } from "@microsoft/copilot-sdk";
import { createAnalysisServer, createCopilotAnalyzer } from "./server.js";

if (!process.env.COPILOT_GITHUB_TOKEN) {
  throw new Error("Set COPILOT_GITHUB_TOKEN to a supported token for a GitHub Copilot account.");
}

const client = new CopilotClient({
  mode: "empty",
  runtime: RuntimeConnection.forDefault({
    baseDirectory: process.env.COPILOT_DATA_DIR || join(tmpdir(), "attriato-copilot"),
  }),
});
const server = createAnalysisServer({
  token: process.env.COPILOT_SERVICE_TOKEN,
  analyze: createCopilotAnalyzer(client),
});

await client.start();
server.listen(Number(process.env.PORT || 8788), "0.0.0.0", () => {
  console.log(`Copilot analysis service listening on port ${process.env.PORT || 8788}.`);
});

async function shutdown() {
  server.close(async () => {
    await client.stop();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

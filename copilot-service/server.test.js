import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createAnalysisServer, createCopilotAnalyzer } from "./server.js";

const token = "test-shared-service-token-".repeat(2);
const server = createAnalysisServer({
  token,
  analyze: async (report) => ({
    summary: "Sessions increased.",
    findings: [{
      issue: "Organic Search sessions increased",
      evidence: `${report.channels.dimensionName}: ${report.channels.segments[0].dimensionValue}`,
      recommendation: "Review the conversion rate for this channel.",
      priority: "medium",
    }],
    limitations: [],
  }),
});
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("requires the shared service token", async () => {
  const response = await fetch(`${baseUrl}/analyze`, { method: "POST", body: "{}" });
  assert.equal(response.status, 401);
});

test("returns validated analysis for an authenticated GA4 report", async () => {
  const response = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [],
      report: {
        channels: {
          dimensionName: "sessionDefaultChannelGroup",
          segments: [{ dimensionValue: "Organic Search", metrics: {} }],
        },
      },
    }),
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.analysis.findings[0].evidence, "sessionDefaultChannelGroup: Organic Search");
});

test("rejects malformed or oversized request bodies", async () => {
  const malformed = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(malformed.status, 400);

  const oversized = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: " ".repeat(257 * 1024),
  });
  assert.equal(oversized.status, 413);
});

test("requests structured Copilot output and disconnects its session", async () => {
  let disconnected = false;
  const githubToken = "test-github-token";
  const expected = { summary: "Summary", findings: [], limitations: [] };
  const analyze = createCopilotAnalyzer({
    async createSession(options) {
      assert.equal(options.model, "auto");
      assert.deepEqual(options.tools.availableTools, []);
      assert.equal(options.github.token, githubToken);
      return {
        async sendAndWait(options) {
          assert.match(options.prompt, /sessionDefaultChannelGroup/);
          assert.match(options.prompt, /Organic Search/);
          assert.equal(options.responseSchema.type, "object");
          return { data: { content: JSON.stringify(expected) } };
        },
        async disconnect() {
          disconnected = true;
        },
      };
    },
  }, githubToken);

  const analysis = await analyze({
    channels: {
      dimensionName: "sessionDefaultChannelGroup",
      segments: [{ dimensionValue: "Organic Search", metrics: {} }],
    },
  }, []);
  assert.deepEqual(analysis, expected);
  assert.equal(disconnected, true);
});

test("requires a GitHub token for Copilot sessions", () => {
  assert.throws(() => createCopilotAnalyzer({}, ""), /COPILOT_GITHUB_TOKEN/);
});

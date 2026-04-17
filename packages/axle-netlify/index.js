// Netlify Build Plugin entry. Netlify invokes lifecycle hooks with a
// `{ utils, inputs, constants }` payload. We wire `onPostBuild` to run
// the axle CLI against the current deploy preview URL and fail the
// build when violations cross the configured threshold.

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const onPostBuild = async ({ utils, inputs, constants }) => {
  const { failOn, withAiFixes, maxAiFixes } = inputs;
  const target =
    inputs.url ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    process.env.DEPLOY_URL;

  if (!target) {
    return utils.build.failBuild(
      "axle: no URL to scan. Set inputs.url or rely on Netlify's DEPLOY_PRIME_URL."
    );
  }

  const jsonOut = resolve(constants.PUBLISH_DIR ?? ".", "axle-report.json");
  const mdOut = resolve(constants.PUBLISH_DIR ?? ".", "axle-report.md");

  const args = [
    "@axle/cli",
    "scan",
    "--url",
    target,
    "--fail-on",
    failOn ?? "serious",
    "--max-ai-fixes",
    String(maxAiFixes ?? 10),
    "--with-ai-fixes",
    withAiFixes ? "true" : "false",
    "--json-out",
    jsonOut,
    "--markdown-out",
    mdOut,
  ];

  utils.status.show({
    title: "axle",
    summary: `Scanning ${target} (threshold: ${failOn})…`,
  });

  const code = await new Promise((res) => {
    const p = spawn("npx", ["-y", ...args], {
      stdio: "inherit",
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      },
    });
    p.on("exit", (c) => res(c ?? 0));
  });

  let summary = "axle: no report produced";
  try {
    summary = await readFile(mdOut, "utf8");
  } catch {
    /* no-op */
  }

  utils.status.show({
    title: "axle",
    summary: code === 0 ? "Passing ✅" : "Failed ❌",
    text: summary.slice(0, 8000),
  });

  if (code === 1) {
    return utils.build.failBuild("axle: accessibility violations detected.");
  }
};

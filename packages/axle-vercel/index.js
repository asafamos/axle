#!/usr/bin/env node
// Vercel build hook. Add to your Vercel project's Build Command:
//   next build && npx -y axle-vercel-plugin
// Or as a postbuild script in package.json:
//   "postbuild": "axle-vercel-plugin"
//
// Reads VERCEL_URL / VERCEL_BRANCH_URL (set by Vercel during builds), invokes
// axle-cli against the preview URL, fails the build when violations cross
// the configured severity threshold.

import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FAIL_ON = process.env.AXLE_FAIL_ON || "serious";
const WITH_AI_FIXES = process.env.AXLE_WITH_AI_FIXES || "false";
const MAX_AI_FIXES = process.env.AXLE_MAX_AI_FIXES || "10";

// Vercel exposes multiple URL env vars depending on deployment type.
// Prefer an explicit override, then the branch URL (stable across builds
// of the same branch), then the per-deployment URL.
const rawTarget =
  process.env.AXLE_URL ||
  process.env.VERCEL_BRANCH_URL ||
  process.env.VERCEL_URL;

// VERCEL_URL / VERCEL_BRANCH_URL arrive without the protocol.
const TARGET = rawTarget && !/^https?:\/\//i.test(rawTarget)
  ? `https://${rawTarget}`
  : rawTarget;

if (!TARGET) {
  console.error(
    "[axle] No URL to scan. Expected VERCEL_URL / VERCEL_BRANCH_URL / AXLE_URL env var."
  );
  process.exit(2);
}

// On Vercel the build output dir is cwd, so reports land alongside other
// build artifacts and can be downloaded from the deployment.
const outDir = process.env.AXLE_OUT_DIR || ".";
const jsonOut = resolve(outDir, "axle-report.json");
const mdOut = resolve(outDir, "axle-report.md");

console.log(`[axle] Scanning ${TARGET} (threshold: ${FAIL_ON})…`);

const child = spawn(
  "npx",
  [
    "-y",
    "axle-cli",
    "scan",
    "--url",
    TARGET,
    "--fail-on",
    FAIL_ON,
    "--with-ai-fixes",
    WITH_AI_FIXES,
    "--max-ai-fixes",
    MAX_AI_FIXES,
    "--json-out",
    jsonOut,
    "--markdown-out",
    mdOut,
  ],
  { stdio: "inherit" }
);

child.on("exit", (code) => {
  if (code === 0) {
    console.log("[axle] ✓ Passing");
  } else if (code === 1) {
    console.log("[axle] ✗ Accessibility violations detected — failing build");
  }
  if (existsSync(mdOut)) {
    try {
      const md = readFileSync(mdOut, "utf8");
      console.log("\n=== axle report ===\n");
      console.log(md.slice(0, 4000));
      console.log("\n=== end report ===\n");
    } catch {
      /* no-op */
    }
  }
  process.exit(code ?? 0);
});

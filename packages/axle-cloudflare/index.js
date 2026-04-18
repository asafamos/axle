#!/usr/bin/env node
// Cloudflare Pages build hook. Run from the Cloudflare Pages Dashboard as
// the "Build command":
//   npx axle-cloudflare-plugin
//
// Reads the preview URL from CF_PAGES_URL (set by Cloudflare during builds),
// invokes the axle CLI, and fails the build if violations cross the
// configured severity threshold.

import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FAIL_ON = process.env.AXLE_FAIL_ON || "serious";
const WITH_AI_FIXES = process.env.AXLE_WITH_AI_FIXES || "false";
const MAX_AI_FIXES = process.env.AXLE_MAX_AI_FIXES || "10";
const TARGET =
  process.env.AXLE_URL ||
  process.env.CF_PAGES_URL ||
  process.env.CF_PAGES_BRANCH_URL;

if (!TARGET) {
  console.error(
    "[axle] No URL to scan. Expected CF_PAGES_URL / AXLE_URL env var."
  );
  process.exit(2);
}

const outDir = process.env.CF_PAGES_OUTPUT_DIR || ".";
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

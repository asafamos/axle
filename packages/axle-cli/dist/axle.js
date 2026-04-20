#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { scanUrl } from "./scanner.js";
import { generateFix } from "./fixer.js";
import { renderMarkdown } from "./markdown.js";
const SEVERITY_RANK = {
    critical: 4,
    serious: 3,
    moderate: 2,
    minor: 1,
};
function help() {
    console.log(`axle — accessibility compliance CI

Usage:
  axle scan <url> [options]
  axle --version

Options:
  --fail-on <severity>       critical | serious | moderate | minor | none (default: serious)
  --with-ai-fixes <bool>     true | false (default: false; requires ANTHROPIC_API_KEY)
  --max-ai-fixes <n>         Cap on AI fix calls per run (default: 10)
  --json-out <path>          Path for JSON report (default: axle-report.json)
  --markdown-out <path>      Path for markdown report (default: axle-report.md)

Exit codes:
  0  passing at threshold
  1  violations at or above threshold
  2  invalid arguments / fatal error
`);
    process.exit(0);
}
function parseArgs(argv) {
    if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h")
        help();
    if (argv[0] === "--version" || argv[0] === "-v") {
        // Lazy import to keep cold start fast.
        console.log("axle-cli 1.0.1");
        process.exit(0);
    }
    const command = argv[0] === "scan" ? "scan" : null;
    const rest = command ? argv.slice(1) : argv;
    const get = (flag) => {
        const i = rest.indexOf(flag);
        return i >= 0 ? rest[i + 1] : undefined;
    };
    const positional = rest.find((a) => !a.startsWith("--") && !a.startsWith("-"));
    const url = positional ?? get("--url") ?? process.env.AXLE_URL;
    if (!url) {
        console.error("Missing URL. Example: axle scan https://example.com");
        process.exit(2);
    }
    const failOn = (get("--fail-on") ?? "serious").toLowerCase();
    if (!["critical", "serious", "moderate", "minor", "none"].includes(failOn)) {
        console.error(`Invalid --fail-on: ${failOn}`);
        process.exit(2);
    }
    return {
        command,
        args: {
            url,
            failOn,
            withAiFixes: (get("--with-ai-fixes") ?? "false").toLowerCase() === "true",
            maxAiFixes: Number(get("--max-ai-fixes") ?? 10),
            jsonOut: get("--json-out") ?? "axle-report.json",
            markdownOut: get("--markdown-out") ?? "axle-report.md",
        },
    };
}
function shouldFail(result, failOn) {
    if (failOn === "none")
        return false;
    const threshold = SEVERITY_RANK[failOn];
    return result.violations.some((v) => v.impact !== null && SEVERITY_RANK[v.impact] >= threshold);
}
function printBanner() {
    console.log("────────────────────────────────────────");
    console.log(" axle — accessibility compliance CI");
    console.log(" https://axle-iota.vercel.app?utm_source=axle-cli");
    console.log("────────────────────────────────────────");
}
const TELEMETRY_ENDPOINT = "https://axle-iota.vercel.app/api/track";
const TELEMETRY_TIMEOUT_MS = 1500;
/**
 * Anonymous attribution ping — lets axle the hosted service see how much
 * the CLI is actually used. No URL, no report contents, no user identifiers
 * are sent. Only { source: "axle-cli", event: "scan_complete" }.
 * Disabled with AXLE_NO_TELEMETRY=1. Best-effort; never blocks or errors.
 */
async function pingTelemetry(event) {
    if (process.env.AXLE_NO_TELEMETRY === "1")
        return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TELEMETRY_TIMEOUT_MS);
    try {
        await fetch(TELEMETRY_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: "axle-cli", event }),
            signal: controller.signal,
        });
    }
    catch {
        /* no-op */
    }
    finally {
        clearTimeout(timer);
    }
}
async function main() {
    const { args } = parseArgs(process.argv.slice(2));
    printBanner();
    console.log(`[axle] scanning ${args.url}…`);
    const result = await scanUrl(args.url);
    console.log(`[axle] ${result.violations.length} rule(s), ${result.summary.critical}c / ${result.summary.serious}s / ${result.summary.moderate}m / ${result.summary.minor}mi`);
    const fixes = new Map();
    if (args.withAiFixes && result.violations.length > 0) {
        if (!process.env.ANTHROPIC_API_KEY) {
            console.warn("[axle] --with-ai-fixes set but ANTHROPIC_API_KEY missing; skipping fix generation");
        }
        else {
            const tasks = [];
            for (const v of result.violations) {
                for (let i = 0; i < Math.min(v.nodes.length, 3); i++) {
                    tasks.push({ v, idx: i, key: `${v.id}-${i}` });
                    if (tasks.length >= args.maxAiFixes)
                        break;
                }
                if (tasks.length >= args.maxAiFixes)
                    break;
            }
            console.log(`[axle] generating ${tasks.length} AI fix(es)…`);
            const results = await Promise.allSettled(tasks.map((t) => generateFix(t.v, t.idx)));
            results.forEach((r, i) => {
                if (r.status === "fulfilled")
                    fixes.set(tasks[i].key, r.value);
                else
                    console.warn(`[axle] fix ${tasks[i].key} failed: ${r.reason}`);
            });
        }
    }
    const failing = shouldFail(result, args.failOn);
    const markdown = renderMarkdown(result, fixes, failing, args.failOn);
    await mkdir(dirname(resolve(args.jsonOut)), { recursive: true });
    await writeFile(args.jsonOut, JSON.stringify({ result, fixes: Object.fromEntries(fixes) }, null, 2));
    await writeFile(args.markdownOut, markdown);
    console.log(`[axle] wrote ${args.jsonOut} and ${args.markdownOut}`);
    console.log(`[axle] ${failing ? "FAILING" : "passing"} (threshold: ${args.failOn})`);
    await pingTelemetry("scan_complete");
    process.exit(failing ? 1 : 0);
}
main().catch(async (err) => {
    console.error("[axle] fatal:", err);
    await pingTelemetry("scan_error");
    process.exit(2);
});

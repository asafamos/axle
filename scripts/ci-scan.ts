#!/usr/bin/env tsx
/**
 * CLI entry for CI environments. Scans a URL, optionally requests AI fixes,
 * writes JSON + markdown reports, and exits non-zero when violations at or
 * above the fail-on severity are present. Designed to be wrapped by the
 * axle GitHub Action, but is usable locally for debugging.
 */
import { writeFile, mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { scanUrl, type AxeViolation, type ScanResult } from "../lib/scanner";
import { generateFix, type FixResult } from "../lib/fixer";

type Severity = "critical" | "serious" | "moderate" | "minor";
const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1,
};

type Args = {
  url: string;
  failOn: Severity | "none";
  withAiFixes: boolean;
  maxAiFixes: number;
  jsonOut: string;
  markdownOut: string;
};

function parseArgs(argv: string[]): Args {
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const url = get("--url") ?? process.env.A11Y_URL;
  if (!url) {
    console.error("Missing --url (or A11Y_URL env)");
    process.exit(2);
  }
  const failOn = (get("--fail-on") ?? "serious").toLowerCase() as Args["failOn"];
  if (!["critical", "serious", "moderate", "minor", "none"].includes(failOn)) {
    console.error(`Invalid --fail-on value: ${failOn}`);
    process.exit(2);
  }
  return {
    url,
    failOn,
    withAiFixes: (get("--with-ai-fixes") ?? "false").toLowerCase() === "true",
    maxAiFixes: Number(get("--max-ai-fixes") ?? 10),
    jsonOut: get("--json-out") ?? "a11y-report.json",
    markdownOut: get("--markdown-out") ?? "a11y-report.md",
  };
}

function shouldFail(result: ScanResult, failOn: Args["failOn"]): boolean {
  if (failOn === "none") return false;
  const threshold = SEVERITY_RANK[failOn];
  return result.violations.some(
    (v) => v.impact !== null && SEVERITY_RANK[v.impact] >= threshold
  );
}

const IMPACT_EMOJI: Record<string, string> = {
  critical: "🔴",
  serious: "🟠",
  moderate: "🟡",
  minor: "🔵",
};

function renderMarkdown(
  result: ScanResult,
  fixes: Map<string, FixResult>,
  failing: boolean,
  failOn: string
): string {
  const total = result.violations.reduce((s, v) => s + v.nodes.length, 0);
  const header = failing
    ? `### ❌ Accessibility check failed (${failOn}+)`
    : total === 0
    ? `### ✅ No accessibility violations detected`
    : `### ⚠️ Accessibility issues below the \`${failOn}\` threshold`;

  const summaryLine = `**${result.violations.length}** rule${
    result.violations.length === 1 ? "" : "s"
  } · **${total}** element${total === 1 ? "" : "s"} · ${
    result.summary.critical
  } critical · ${result.summary.serious} serious · ${
    result.summary.moderate
  } moderate · ${result.summary.minor} minor`;

  const scannedLine = `Scanned \`${result.url}\` at ${result.scannedAt}`;

  if (result.violations.length === 0) {
    return [
      header,
      "",
      scannedLine,
      "",
      `_axe-core automated checks catch roughly 57% of WCAG issues. Manual review still recommended._`,
      "",
      `<sub>Powered by **[axle](https://axle-iota.vercel.app)** — the overlay-free accessibility CI. [Try it free ↗](https://axle-iota.vercel.app) · [Docs ↗](https://github.com/asafamos/axle-action) · Remediation assistance, not compliance certification.</sub>`,
    ].join("\n");
  }

  const sections = result.violations.map((v) => renderViolation(v, fixes));

  return [
    header,
    "",
    summaryLine,
    "",
    scannedLine,
    "",
    ...sections,
    "---",
    `<sub>Powered by **[axle](https://axle-iota.vercel.app)** — the overlay-free accessibility CI. [Try it free ↗](https://axle-iota.vercel.app) · [Docs ↗](https://github.com/asafamos/axle-action) · Remediation assistance, not compliance certification.</sub>`,
  ].join("\n");
}

function renderViolation(
  v: AxeViolation,
  fixes: Map<string, FixResult>
): string {
  const impact = v.impact ?? "minor";
  const badge = `${IMPACT_EMOJI[impact] ?? "•"} **${impact}**`;
  const nodes = v.nodes.slice(0, 5);
  const overflow = v.nodes.length - nodes.length;

  const nodeBlocks = nodes.map((n, i) => {
    const key = `${v.id}-${i}`;
    const fix = fixes.get(key);
    const selectorLine = `\`${n.target.join(" ")}\``;
    const html = "```html\n" + n.html + "\n```";
    if (!fix) return [selectorLine, html].join("\n");
    const confidence = `${fix.confidence.toUpperCase()} confidence${
      fix.manual_review_needed ? " · ⚠️ manual review needed" : ""
    }`;
    const patches = fix.patches
      .map(
        (p) =>
          [
            `<details><summary>Suggested fix</summary>`,
            "",
            `**Why:** ${fix.explanation}`,
            ``,
            `**Strategy:** ${fix.fix_strategy}`,
            ``,
            `\`\`\`diff`,
            `- ${p.before}`,
            `+ ${p.after}`,
            `\`\`\``,
            p.notes ? `> ${p.notes}` : "",
            `</details>`,
          ]
            .filter(Boolean)
            .join("\n")
      )
      .join("\n\n");
    return [selectorLine, html, `_${confidence}_`, patches].join("\n\n");
  });

  const overflowLine =
    overflow > 0 ? `\n_…and ${overflow} more element(s)_` : "";

  return [
    `#### ${badge} · ${v.help}`,
    ``,
    `Rule: \`${v.id}\` · [WCAG reference](${v.helpUrl})`,
    ``,
    v.description,
    ``,
    ...nodeBlocks,
    overflowLine,
    ``,
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log(`[axle] scanning ${args.url}…`);
  const result = await scanUrl(args.url);
  console.log(
    `[axle] ${result.violations.length} rule(s), ${result.summary.critical}c / ${result.summary.serious}s / ${result.summary.moderate}m / ${result.summary.minor}mi`
  );

  const fixes = new Map<string, FixResult>();
  if (args.withAiFixes && result.violations.length > 0) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn(
        "[axle] --with-ai-fixes set but ANTHROPIC_API_KEY missing; skipping fix generation"
      );
    } else {
      const tasks: Array<{ v: AxeViolation; idx: number; key: string }> = [];
      for (const v of result.violations) {
        for (let i = 0; i < Math.min(v.nodes.length, 3); i++) {
          tasks.push({ v, idx: i, key: `${v.id}-${i}` });
          if (tasks.length >= args.maxAiFixes) break;
        }
        if (tasks.length >= args.maxAiFixes) break;
      }
      console.log(`[axle] generating ${tasks.length} AI fix(es)…`);
      const results = await Promise.allSettled(
        tasks.map((t) => generateFix(t.v, t.idx))
      );
      results.forEach((r, i) => {
        if (r.status === "fulfilled") fixes.set(tasks[i].key, r.value);
        else console.warn(`[axle] fix ${tasks[i].key} failed: ${r.reason}`);
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

  process.exit(failing ? 1 : 0);
}

main().catch((err) => {
  console.error("[axle] fatal:", err);
  process.exit(2);
});

import { chromium, type Browser } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type AxeViolation = {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
};

export type ScanResult = {
  url: string;
  scannedAt: string;
  title: string;
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
};

function resolveAxeScript(): string {
  // Resolve axe-core from the published npm package, wherever it's installed.
  const axePath = require.resolve("axe-core/axe.min.js");
  return readFileSync(axePath, "utf-8");
}

/** The Playwright version this CLI is really running — what a matching browser install must name. */
export function playwrightVersion(): string {
  try {
    return (require("playwright/package.json") as { version: string }).version;
  } catch {
    return "latest";
  }
}

/**
 * Playwright's bundled Chromium has to match the Playwright version that
 * `npx axle-cli` resolves (a ^range, so the newest 1.x), and that is easy to get
 * out of step: `npx playwright install chromium` run inside a project that pins an
 * older Playwright downloads the wrong revision. So when the bundled browser is
 * missing, use the Chrome or Edge the developer already has before asking them
 * to download anything.
 */
async function launchBrowser(): Promise<Browser> {
  try {
    return await chromium.launch({ headless: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/Executable doesn't exist|playwright install/i.test(message)) throw err;
    for (const channel of ["chrome", "msedge"] as const) {
      try {
        return await chromium.launch({ headless: true, channel });
      } catch {
        /* not installed — try the next one */
      }
    }
    throw err;
  }
}

export async function scanUrl(url: string): Promise<ScanResult> {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("URL must start with http:// or https://");
  }

  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (axle/0.1; +https://axle.dev/bot)",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const title = await page.title();

    const axeSource = resolveAxeScript();
    await page.addScriptTag({ content: axeSource });

    const axeResults = await page.evaluate(async () => {
      // @ts-expect-error axe is injected at runtime
      return await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
        resultTypes: ["violations", "incomplete", "passes"],
      });
    });

    const violations = (axeResults.violations || []) as AxeViolation[];
    const summary = {
      critical: violations.filter((v) => v.impact === "critical").length,
      serious: violations.filter((v) => v.impact === "serious").length,
      moderate: violations.filter((v) => v.impact === "moderate").length,
      minor: violations.filter((v) => v.impact === "minor").length,
    };

    return {
      url,
      scannedAt: new Date().toISOString(),
      title,
      violations,
      passes: (axeResults.passes || []).length,
      incomplete: (axeResults.incomplete || []).length,
      summary,
    };
  } finally {
    if (browser) await browser.close();
  }
}

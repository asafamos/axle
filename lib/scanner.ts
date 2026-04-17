import { chromium, type Browser } from "playwright";
import { readFileSync } from "fs";
import { join } from "path";

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

const AXE_SCRIPT_PATH = join(
  process.cwd(),
  "node_modules",
  "axe-core",
  "axe.min.js"
);

export async function scanUrl(url: string): Promise<ScanResult> {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("URL must start with http:// or https://");
  }

  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (A11yFixer/0.1; +https://a11yfixer.example/bot)",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const title = await page.title();

    const axeSource = readFileSync(AXE_SCRIPT_PATH, "utf-8");
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

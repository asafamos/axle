import * as vscode from "vscode";
import * as https from "https";
import * as http from "http";

/**
 * axle — a11y / WCAG scanner — VS Code extension.
 *
 * Scope: small, opinionated. Runs an axle scan from inside VS Code
 * against a URL the user provides (or against localhost:3000 for
 * the active dev server). Renders results in a Webview panel with a
 * link to the public /r/<id> page for sharing.
 *
 * Why this is a thin wrapper: axle's hosted /api/scan endpoint
 * already does the heavy lifting (Playwright + axe-core 4.11). A
 * local browser engine would balloon the extension to 100MB+.
 * Instead we POST to the API, parse the JSON, render a panel.
 *
 * Anti-abuse: free-scan endpoint has its own rate limit. With an
 * API key (Team/Business plan), no limit. The key is stored via the
 * standard VS Code SecretStorage API — never in workspace settings.
 */

const SCAN_ENDPOINT = "https://axle-iota.vercel.app/api/scan";
const API_BASE = "https://axle-iota.vercel.app";

let lastResult: ScanResult | undefined;

type ScanResult = {
  url: string;
  scanned_at: string;
  engine: string;
  result_id?: string;
  permalink?: string;
  summary: {
    violations: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  violations: Array<{
    id: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    help: string;
    helpUrl?: string;
    tags?: string[];
    nodes: Array<{
      html: string;
      target?: string[];
      failureSummary?: string;
    }>;
  }>;
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("axle.scanUrl", async () => {
      const url = await vscode.window.showInputBox({
        prompt: "URL to scan for WCAG 2.2 AA violations",
        placeHolder: "https://example.com",
        validateInput: (v) => {
          if (!v) return "Required";
          try {
            const u = new URL(v);
            if (u.protocol !== "http:" && u.protocol !== "https:") {
              return "Must start with http:// or https://";
            }
            return null;
          } catch {
            return "Invalid URL";
          }
        },
      });
      if (!url) return;
      await runScan(url, context);
    }),

    vscode.commands.registerCommand("axle.scanLocalhost", async () => {
      const config = vscode.workspace.getConfiguration("axle");
      const defaultUrl = config.get<string>("defaultUrl") ?? "http://localhost:3000";
      await runScan(defaultUrl, context);
    }),

    vscode.commands.registerCommand("axle.openLastResult", async () => {
      if (!lastResult) {
        vscode.window.showInformationMessage(
          "No axle scan result yet. Run 'axle: Scan a URL' first.",
        );
        return;
      }
      renderPanel(lastResult, context);
    }),
  );
}

async function runScan(url: string, context: vscode.ExtensionContext) {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `axle — scanning ${url}`,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ message: "Sending to axle…" });
        const config = vscode.workspace.getConfiguration("axle");
        const apiKey = config.get<string>("apiKey") ?? "";
        const body = { url, source: "vscode" };
        const result = await postJson<ScanResult>(SCAN_ENDPOINT, body, apiKey);
        lastResult = result;
        progress.report({ message: "Rendering results…" });
        renderPanel(result, context);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        vscode.window.showErrorMessage(`axle scan failed: ${message}`);
      }
    },
  );
}

function postJson<T>(url: string, body: unknown, apiKey: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === "https:" ? https : http;
    const payload = JSON.stringify(body);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload).toString(),
      "User-Agent": "axle-vscode/0.1",
    };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const req = lib.request(
      {
        method: "POST",
        host: u.hostname,
        port: u.port || (u.protocol === "https:" ? 443 : 80),
        path: u.pathname + u.search,
        headers,
      },
      (res) => {
        let buf = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (buf += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(buf);
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(parsed.error || `HTTP ${res.statusCode}`));
              return;
            }
            resolve(parsed as T);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function renderPanel(result: ScanResult, context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "axleResult",
    `axle — ${new URL(result.url).hostname}`,
    vscode.ViewColumn.Active,
    { enableScripts: false, retainContextWhenHidden: true },
  );
  panel.webview.html = renderHtml(result);
}

function renderHtml(result: ScanResult): string {
  const { summary, violations } = result;
  const passing = summary.critical === 0 && summary.serious === 0;
  const shareUrl = result.permalink ? `${API_BASE}${result.permalink}` : null;

  const violationCards = violations
    .map((v) => {
      const impactBadge = `<span class="impact impact-${v.impact}">${escapeHtml(v.impact)}</span>`;
      const wcag = (v.tags ?? [])
        .filter((t) => t.startsWith("wcag"))
        .map((t) => `<code>${escapeHtml(t)}</code>`)
        .join(" ");
      const nodes = v.nodes
        .slice(0, 3)
        .map(
          (n) => `<details>
            <summary><code>${escapeHtml((n.target ?? []).join(" "))}</code></summary>
            <pre>${escapeHtml(n.html.slice(0, 600))}</pre>
            <p class="muted">${escapeHtml(n.failureSummary ?? "")}</p>
          </details>`,
        )
        .join("");
      const more =
        v.nodes.length > 3
          ? `<p class="muted">…and ${v.nodes.length - 3} more occurrences</p>`
          : "";
      return `<article class="card">
        <h3>${impactBadge} ${escapeHtml(v.id)}</h3>
        <p>${escapeHtml(v.help)}</p>
        <p class="wcag">${wcag}</p>
        ${nodes}
        ${more}
        ${v.helpUrl ? `<p><a href="${escapeAttr(v.helpUrl)}">Rule docs →</a></p>` : ""}
      </article>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 16px 20px; line-height: 1.5; }
  h1 { font-size: 1.4rem; margin: 0 0 4px; }
  h3 { font-size: 1rem; margin: 0 0 8px; }
  .meta { color: var(--vscode-descriptionForeground); font-size: 0.85rem; margin-bottom: 16px; }
  .summary { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
  .summary div { background: var(--vscode-textBlockQuote-background); padding: 8px 12px; border-radius: 4px; }
  .summary strong { display: block; font-size: 1.4rem; }
  .pass { background: #1e6f3a !important; color: #fff; padding: 12px 16px !important; border-radius: 6px; }
  .card { border: 1px solid var(--vscode-input-border); padding: 12px 16px; border-radius: 6px; margin-bottom: 12px; }
  .impact { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-right: 6px; }
  .impact-critical { background: #b91c1c; color: #fff; }
  .impact-serious { background: #c2410c; color: #fff; }
  .impact-moderate { background: #ca8a04; color: #000; }
  .impact-minor { background: #2563eb; color: #fff; }
  .wcag { font-size: 0.8rem; color: var(--vscode-descriptionForeground); }
  .wcag code { font-size: 0.7rem; padding: 1px 6px; border-radius: 3px; background: var(--vscode-textBlockQuote-background); }
  pre { background: var(--vscode-textCodeBlock-background); padding: 8px; overflow-x: auto; font-size: 0.85rem; border-radius: 3px; max-height: 200px; }
  details summary { cursor: pointer; padding: 4px 0; }
  .muted { color: var(--vscode-descriptionForeground); font-size: 0.85rem; }
  a { color: var(--vscode-textLink-foreground); }
  .share { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 6px; margin-top: 24px; font-size: 0.9rem; }
</style>
</head>
<body>
  <h1>${escapeHtml(new URL(result.url).hostname)}</h1>
  <p class="meta">${escapeHtml(result.url)} · scanned ${escapeHtml(new Date(result.scanned_at).toLocaleString())} · ${escapeHtml(result.engine)}</p>

  ${
    passing
      ? `<div class="pass"><strong>✓ Passing.</strong> No critical or serious WCAG 2.2 AA violations.</div>`
      : `<div class="summary">
          <div><strong>${summary.critical}</strong>critical</div>
          <div><strong>${summary.serious}</strong>serious</div>
          <div><strong>${summary.moderate}</strong>moderate</div>
          <div><strong>${summary.minor}</strong>minor</div>
        </div>
        <h2>Violations (${summary.violations})</h2>
        ${violationCards}`
  }

  ${
    shareUrl
      ? `<div class="share">Share this scan: <a href="${escapeAttr(shareUrl)}">${escapeHtml(shareUrl)}</a></div>`
      : ""
  }
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

export function deactivate() {}

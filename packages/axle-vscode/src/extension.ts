import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {
  API_BASE,
  ApiError,
  buildFixRequest,
  escapeHtml,
  isLocalUrl,
  normalizeScan,
  partitionByThreshold,
  postJson,
  renderFixMarkdown,
  shouldShowCiTip,
  siteUrl,
  type FailOn,
  type FixResponse,
  type ScanResult,
  type Violation,
} from "./api";

/**
 * axle — a11y / WCAG scanner — VS Code extension.
 *
 * - Public URLs are scanned by axle's hosted endpoint (Playwright + axe-core
 *   4.11) — a thin wrapper, so the extension stays small.
 * - localhost / private-network URLs can't be reached from our servers, so
 *   those run `npx axle-cli` in a visible terminal on the user's machine and
 *   the JSON report is rendered in the same panel.
 * - "Generate AI fix" sends ONE element of ONE violation to axle (and from
 *   there to Anthropic's Claude) — only after the user asks, and only after
 *   a one-time confirmation. Nothing is sent in the background.
 *
 * No telemetry. The optional API key lives in the user-level (machine-scoped)
 * `axle.apiKey` setting, never in workspace settings.
 */

const SCAN_ENDPOINT = `${API_BASE}/api/scan`;
const FIX_ENDPOINT = `${API_BASE}/api/fix`;

const STATE_SCAN_COUNT = "axle.scanCount";
const STATE_CI_TIP_SHOWN = "axle.ciTipLastShown";
const STATE_FIX_CONSENT = "axle.fixConsent";

let lastResult: ScanResult | undefined;
let currentPanel: vscode.WebviewPanel | undefined;

function userAgent(context: vscode.ExtensionContext): string {
  const version = (context.extension.packageJSON as { version?: string }).version ?? "0";
  return `axle-vscode/${version}`;
}

function getFailOn(): FailOn {
  const v = vscode.workspace.getConfiguration("axle").get<string>("failOn") ?? "serious";
  return (["critical", "serious", "moderate", "minor", "none"] as const).includes(v as FailOn)
    ? (v as FailOn)
    : "serious";
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("axle.scanUrl", async () => {
      const url = await vscode.window.showInputBox({
        prompt: "URL to scan for WCAG 2.2 AA violations",
        placeHolder: "https://example.com — or http://localhost:3000",
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
      await scan(url, context);
    }),

    vscode.commands.registerCommand("axle.scanLocalhost", async () => {
      const config = vscode.workspace.getConfiguration("axle");
      const defaultUrl = config.get<string>("defaultUrl") ?? "http://localhost:3000";
      await scan(defaultUrl, context);
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

    vscode.commands.registerCommand(
      "axle.fixViolation",
      async (violationIndex?: number, nodeIndex?: number) => {
        await fixViolation(context, violationIndex, nodeIndex);
      },
    ),
  );
}

async function scan(url: string, context: vscode.ExtensionContext) {
  if (isLocalUrl(url)) {
    await runLocalScan(url, context);
  } else {
    await runHostedScan(url, context);
  }
}

async function runHostedScan(url: string, context: vscode.ExtensionContext) {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `axle — scanning ${url}`,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ message: "Sending to axle…" });
        const apiKey = vscode.workspace.getConfiguration("axle").get<string>("apiKey") ?? "";
        const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
        const raw = await postJson<unknown>(
          SCAN_ENDPOINT,
          { url, source: "axle-vscode" },
          headers,
          userAgent(context),
        );
        const result = normalizeScan(raw);
        // The share link comes from the hosted response, not from normalizeScan's guess.
        const permalink = (raw as { permalink?: unknown }).permalink;
        if (typeof permalink === "string") result.permalink = permalink;
        progress.report({ message: "Rendering results…" });
        await showResult(result, context);
      } catch (err) {
        await reportError("axle scan failed", err);
      }
    },
  );
}

async function runLocalScan(url: string, context: vscode.ExtensionContext) {
  if (!vscode.workspace.isTrusted) {
    vscode.window.showWarningMessage(
      "axle: scanning a local URL runs `npx axle-cli` on your machine, which needs a trusted workspace. Trust this workspace and try again.",
    );
    return;
  }

  const dir = context.globalStorageUri.fsPath;
  await fs.promises.mkdir(dir, { recursive: true });
  const jsonOut = path.join(dir, "axle-report.json");
  const markdownOut = path.join(dir, "axle-report.md");
  await fs.promises.rm(jsonOut, { force: true });

  const strong = (value: string): vscode.ShellQuotedString => ({
    value,
    quoting: vscode.ShellQuoting.Strong,
  });
  const execution = new vscode.ShellExecution(
    "npx",
    [
      "--yes",
      "axle-cli",
      "scan",
      strong(url),
      "--fail-on",
      "none",
      "--json-out",
      strong(jsonOut),
      "--markdown-out",
      strong(markdownOut),
    ],
    // The extension promises no telemetry — keep that true for the CLI it launches.
    { env: { AXLE_NO_TELEMETRY: "1" } },
  );
  const task = new vscode.Task(
    { type: "shell" },
    vscode.workspace.workspaceFolders?.[0] ?? vscode.TaskScope.Global,
    "axle local scan",
    "axle",
    execution,
  );
  task.presentationOptions = {
    reveal: vscode.TaskRevealKind.Always,
    focus: false,
    clear: true,
    panel: vscode.TaskPanelKind.Dedicated,
  };

  const started = await vscode.tasks.executeTask(task);
  const exitCode = await new Promise<number | undefined>((resolve) => {
    const sub = vscode.tasks.onDidEndTaskProcess((e) => {
      if (e.execution === started) {
        sub.dispose();
        resolve(e.exitCode);
      }
    });
  });

  if (exitCode !== 0) {
    vscode.window.showErrorMessage(
      `axle: the local scan did not finish. Check that your dev server is running at ${url}. ` +
        `On first use the scanner may also need a browser: run "npx playwright install chromium" in a terminal.`,
    );
    return;
  }
  try {
    const raw = JSON.parse(await fs.promises.readFile(jsonOut, "utf8")) as unknown;
    await showResult(normalizeScan(raw), context);
  } catch (err) {
    await reportError("axle could not read the local scan report", err);
  }
}

async function showResult(result: ScanResult, context: vscode.ExtensionContext) {
  lastResult = result;
  renderPanel(result, context);
  await maybeShowCiTip(result, context);
}

async function reportError(prefix: string, err: unknown) {
  if (err instanceof ApiError && err.status === 402) {
    const choice = await vscode.window.showWarningMessage(
      `${prefix}: ${err.message}`,
      "See plans",
    );
    if (choice === "See plans") {
      await vscode.env.openExternal(
        vscode.Uri.parse(siteUrl("/pricing", "limit-reached")),
      );
    }
    return;
  }
  const message = (err instanceof Error ? err.message : "Unknown error").replace(/\.+$/, "");
  const offline = /ENOTFOUND|ECONNREFUSED|ECONNRESET|EAI_AGAIN|timed out/i.test(message)
    ? " Check your internet connection — axle's hosted scanner could not be reached."
    : "";
  vscode.window.showErrorMessage(`${prefix}: ${message}.${offline}`);
}

/**
 * One gentle, dismissible nudge — never on the first scan, at most weekly,
 * only when there is something to fix, and switchable off in settings.
 */
async function maybeShowCiTip(result: ScanResult, context: vscode.ExtensionContext) {
  const scanCount = (context.globalState.get<number>(STATE_SCAN_COUNT) ?? 0) + 1;
  await context.globalState.update(STATE_SCAN_COUNT, scanCount);
  if (result.summary.violations === 0) return;

  const config = vscode.workspace.getConfiguration("axle");
  const enabled = config.get<boolean>("showCiTip") ?? true;
  const lastShown = context.globalState.get<number>(STATE_CI_TIP_SHOWN);
  if (!shouldShowCiTip({ scanCount, lastShown }, enabled, Date.now())) return;

  await context.globalState.update(STATE_CI_TIP_SHOWN, Date.now());
  const choice = await vscode.window.showInformationMessage(
    "Catch accessibility regressions before they ship: the axle GitHub Action runs this check on every pull request (free for one repository).",
    "Set up CI",
    "Not now",
    "Don't show again",
  );
  if (choice === "Set up CI") {
    await vscode.env.openExternal(vscode.Uri.parse(siteUrl("/pricing", "ci-tip")));
  } else if (choice === "Don't show again") {
    await config.update("showCiTip", false, vscode.ConfigurationTarget.Global);
  }
}

async function fixViolation(
  context: vscode.ExtensionContext,
  violationIndex?: number,
  nodeIndex?: number,
) {
  if (!lastResult || lastResult.violations.length === 0) {
    vscode.window.showInformationMessage(
      "axle: run a scan first — there are no violations to fix yet.",
    );
    return;
  }
  const result = lastResult;

  let vIdx = violationIndex;
  if (typeof vIdx !== "number" || !result.violations[vIdx]) {
    const pick = await vscode.window.showQuickPick(
      result.violations.map((v, i) => ({
        label: `$(warning) ${v.id}`,
        description: `${v.impact} · ${v.nodes.length} element${v.nodes.length === 1 ? "" : "s"}`,
        detail: v.help,
        index: i,
      })),
      { title: "axle — pick a violation to fix", matchOnDetail: true },
    );
    if (!pick) return;
    vIdx = pick.index;
  }
  const violation: Violation = result.violations[vIdx];

  let nIdx = nodeIndex;
  if (typeof nIdx !== "number" || !violation.nodes[nIdx]) {
    if (violation.nodes.length <= 1) {
      nIdx = 0;
    } else {
      const pick = await vscode.window.showQuickPick(
        violation.nodes.slice(0, 10).map((n, i) => ({
          label: n.target.join(" ") || "(no selector)",
          detail: n.html.slice(0, 120),
          index: i,
        })),
        { title: `axle — which "${violation.id}" element?` },
      );
      if (!pick) return;
      nIdx = pick.index;
    }
  }
  const node = violation.nodes[nIdx];
  if (!node) {
    vscode.window.showWarningMessage("axle: that element is no longer in the last scan result.");
    return;
  }

  if (!(await ensureFixConsent(context))) return;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `axle — generating a fix for ${violation.id}…`,
      cancellable: false,
    },
    async () => {
      try {
        const apiKey = vscode.workspace.getConfiguration("axle").get<string>("apiKey") ?? "";
        const headers: Record<string, string> = apiKey ? { "x-axle-key": apiKey } : {};
        const fix = await postJson<FixResponse>(
          FIX_ENDPOINT,
          buildFixRequest(violation, nIdx as number),
          headers,
          userAgent(context),
        );
        const doc = await vscode.workspace.openTextDocument({
          language: "markdown",
          content: renderFixMarkdown(fix, violation, node, result.url),
        });
        await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside, preview: false });
        try {
          await vscode.commands.executeCommand("markdown.showPreview", doc.uri);
        } catch {
          /* the source text is readable on its own */
        }
      } catch (err) {
        await reportError("axle could not generate a fix", err);
      }
    },
  );
}

async function ensureFixConsent(context: vscode.ExtensionContext): Promise<boolean> {
  if (context.globalState.get<boolean>(STATE_FIX_CONSENT)) return true;
  const choice = await vscode.window.showInformationMessage(
    "Generate an AI fix?",
    {
      modal: true,
      detail:
        "axle will send the rule details and the HTML of this one element (up to 500 characters) to axlescan.com, which uses Anthropic's Claude to suggest a code change. " +
        "Nothing else from your machine is sent, and nothing is sent unless you ask. " +
        "A few fixes per day are free; an axle API key (setting: axle.apiKey) lifts the limit.",
    },
    "Send and generate",
  );
  if (choice !== "Send and generate") return false;
  await context.globalState.update(STATE_FIX_CONSENT, true);
  return true;
}

function renderPanel(result: ScanResult, context: vscode.ExtensionContext) {
  const title = `axle — ${safeHostname(result.url)}`;
  if (currentPanel) {
    currentPanel.title = title;
    currentPanel.webview.html = renderHtml(result, getFailOn());
    currentPanel.reveal(vscode.ViewColumn.Active, false);
    return;
  }
  const panel = vscode.window.createWebviewPanel(
    "axleResult",
    title,
    vscode.ViewColumn.Active,
    {
      enableScripts: false,
      // Lets the "Generate AI fix" links in the panel run exactly this one command.
      enableCommandUris: ["axle.fixViolation"],
      retainContextWhenHidden: true,
    },
  );
  currentPanel = panel;
  panel.onDidDispose(() => (currentPanel = undefined), null, context.subscriptions);
  panel.webview.html = renderHtml(result, getFailOn());
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname || url;
  } catch {
    return url;
  }
}

function renderHtml(result: ScanResult, failOn: FailOn): string {
  const { summary, violations } = result;
  const { shown, hidden } = partitionByThreshold(violations, failOn);
  const passing = shown.length === 0;
  const shareUrl = result.permalink ? `${API_BASE}${result.permalink}` : null;
  const ciUrl = siteUrl("/pricing", "panel-ci");

  const card = ({ v, index }: { v: Violation; index: number }) => {
    const impactBadge = `<span class="impact impact-${escapeHtml(v.impact)}">${escapeHtml(v.impact)}</span>`;
    const wcag = v.tags
      .filter((t) => t.startsWith("wcag"))
      .map((t) => `<code>${escapeHtml(t)}</code>`)
      .join(" ");
    const nodes = v.nodes
      .slice(0, 3)
      .map(
        (n) => `<details>
            <summary><code>${escapeHtml(n.target.join(" "))}</code></summary>
            <pre tabindex="0">${escapeHtml(n.html.slice(0, 600))}</pre>
            <p class="muted">${escapeHtml(n.failureSummary)}</p>
          </details>`,
      )
      .join("");
    const more =
      v.nodes.length > 3
        ? `<p class="muted">…and ${v.nodes.length - 3} more occurrences</p>`
        : "";
    const fixUri = `command:axle.fixViolation?${encodeURIComponent(JSON.stringify([index, 0]))}`;
    return `<article class="card" aria-labelledby="v${index}">
        <h3 id="v${index}">${impactBadge} ${escapeHtml(v.id)}</h3>
        <p>${escapeHtml(v.help)}</p>
        <p class="wcag">${wcag}</p>
        ${nodes}
        ${more}
        <p class="actions">
          <a href="${fixUri}">Generate AI fix for the first element</a>
          ${v.helpUrl ? ` · <a href="${escapeHtml(v.helpUrl)}">Rule docs</a>` : ""}
        </p>
      </article>`;
  };

  const hiddenSection =
    hidden.length > 0
      ? `<details class="lower">
          <summary>${hidden.length} lower-severity issue${hidden.length === 1 ? "" : "s"} below your <code>axle.failOn</code> threshold (${escapeHtml(failOn)})</summary>
          ${hidden.map(card).join("")}
        </details>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>axle scan result</title>
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 16px 20px; line-height: 1.5; }
  h1 { font-size: 1.4rem; margin: 0 0 4px; }
  h2 { font-size: 1.15rem; margin: 24px 0 8px; }
  h3 { font-size: 1rem; margin: 0 0 8px; }
  .meta { color: var(--vscode-descriptionForeground); font-size: 0.85rem; margin-bottom: 16px; }
  .summary { display: flex; gap: 12px; flex-wrap: wrap; margin: 0 0 24px; padding: 0; list-style: none; }
  .summary li { background: var(--vscode-textBlockQuote-background); padding: 8px 12px; border-radius: 4px; }
  .summary strong { display: block; font-size: 1.4rem; }
  .pass { background: #1e6f3a; color: #fff; padding: 12px 16px; border-radius: 6px; }
  .card { border: 1px solid var(--vscode-input-border, var(--vscode-panel-border)); padding: 12px 16px; border-radius: 6px; margin-bottom: 12px; }
  .impact { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-right: 6px; }
  .impact-critical { background: #b91c1c; color: #fff; }
  .impact-serious { background: #c2410c; color: #fff; }
  .impact-moderate { background: #ca8a04; color: #000; }
  .impact-minor { background: #2563eb; color: #fff; }
  .wcag { font-size: 0.8rem; color: var(--vscode-descriptionForeground); }
  .wcag code { font-size: 0.75rem; padding: 1px 6px; border-radius: 3px; background: var(--vscode-textBlockQuote-background); color: var(--vscode-foreground); }
  pre { background: var(--vscode-textCodeBlock-background); padding: 8px; overflow-x: auto; font-size: 0.85rem; border-radius: 3px; max-height: 200px; }
  details summary { cursor: pointer; padding: 4px 0; }
  .muted { color: var(--vscode-descriptionForeground); font-size: 0.85rem; }
  .actions { margin: 8px 0 0; }
  a { color: var(--vscode-textLink-foreground); }
  .callout { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 6px; margin-top: 24px; font-size: 0.9rem; }
</style>
</head>
<body>
<main>
  <h1>${escapeHtml(safeHostname(result.url))}</h1>
  <p class="meta">${escapeHtml(result.url)} · scanned ${escapeHtml(new Date(result.scanned_at).toLocaleString())} · ${escapeHtml(result.engine)}</p>

  ${
    passing
      ? `<p class="pass" role="status"><strong>✓ Passing.</strong> ${
          failOn === "none"
            ? "No WCAG 2.2 AA violations found."
            : `No ${escapeHtml(failOn)} or worse WCAG 2.2 AA violations.`
        }</p>`
      : `<section aria-label="Summary">
          <ul class="summary">
            <li><strong>${summary.critical}</strong>critical</li>
            <li><strong>${summary.serious}</strong>serious</li>
            <li><strong>${summary.moderate}</strong>moderate</li>
            <li><strong>${summary.minor}</strong>minor</li>
          </ul>
        </section>
        <section aria-labelledby="violations-h">
          <h2 id="violations-h">Violations (${shown.length})</h2>
          ${shown.map(card).join("")}
        </section>`
  }
  ${hiddenSection}

  ${
    shareUrl
      ? `<p class="callout">Share this scan: <a href="${escapeHtml(shareUrl)}">${escapeHtml(shareUrl)}</a></p>`
      : ""
  }
  <p class="callout">
    ${passing ? "Keep it passing:" : "Stop these coming back:"} run the same checks on every pull request with the
    <a href="${escapeHtml(ciUrl)}">axle GitHub Action</a> (free for one repository).
    AI fixes: the first few each day are free.
  </p>
</main>
</body>
</html>`;
}

export function deactivate() {}

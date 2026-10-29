/**
 * Pure helpers for the axle VS Code extension — no `vscode` import, so they
 * can be unit-tested with plain Node (see test/api.test.mjs).
 */
import * as https from "https";
import * as http from "http";

export const API_BASE = "https://axlescan.com";

export type Impact = "critical" | "serious" | "moderate" | "minor";
export type FailOn = Impact | "none";

export type ViolationNode = {
  html: string;
  target: string[];
  failureSummary: string;
};

export type Violation = {
  id: string;
  impact: Impact;
  description: string;
  help: string;
  helpUrl?: string;
  tags: string[];
  nodes: ViolationNode[];
};

export type ScanResult = {
  url: string;
  scanned_at: string;
  engine: string;
  permalink?: string;
  summary: {
    violations: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  violations: Violation[];
};

export type FixPatch = {
  selector?: string;
  before?: string;
  after?: string;
  notes?: string;
};

export type FixResponse = {
  explanation?: string;
  fix_strategy?: string;
  patches?: FixPatch[];
  confidence?: "high" | "medium" | "low";
  manual_review_needed?: boolean;
  tier?: "free" | "subscriber";
  remaining?: number;
  limit?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public upgradeUrl?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

export function postJson<T>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
  userAgent = "axle-vscode",
  timeoutMs = 75_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === "https:" ? https : http;
    const payload = JSON.stringify(body);
    const req = lib.request(
      {
        method: "POST",
        hostname: u.hostname,
        port: u.port || (u.protocol === "https:" ? 443 : 80),
        path: u.pathname + u.search,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload).toString(),
          "User-Agent": userAgent,
          ...headers,
        },
      },
      (res) => {
        let buf = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => {
          buf += chunk;
          if (buf.length > MAX_RESPONSE_BYTES) {
            req.destroy(new Error("Response from axle was too large"));
          }
        });
        res.on("end", () => {
          const status = res.statusCode ?? 0;
          let parsed: unknown;
          try {
            parsed = JSON.parse(buf);
          } catch {
            reject(
              new ApiError(
                status >= 400
                  ? `axle returned HTTP ${status}`
                  : "axle returned an unexpected (non-JSON) response",
                status,
              ),
            );
            return;
          }
          if (status >= 400) {
            const p = (parsed ?? {}) as { error?: unknown; upgrade_url?: unknown };
            const msg =
              typeof p.error === "string" && p.error ? p.error : `HTTP ${status}`;
            const upgrade =
              typeof p.upgrade_url === "string" ? absoluteUrl(p.upgrade_url) : undefined;
            reject(new ApiError(msg, status, upgrade));
            return;
          }
          resolve(parsed as T);
        });
      },
    );
    req.setTimeout(timeoutMs, () =>
      req.destroy(new Error("The request to axle timed out")),
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/** Resolve a server-relative path such as "/#pricing" against the axle host. */
export function absoluteUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl, API_BASE).toString();
  } catch {
    return API_BASE;
  }
}

/** A link into the axle site, tagged so we can tell which surface it came from. */
export function siteUrl(path: string, campaign: string): string {
  const u = new URL(path, API_BASE);
  u.searchParams.set("utm_source", "axle-vscode");
  u.searchParams.set("utm_medium", "extension");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

const IMPACTS: Impact[] = ["critical", "serious", "moderate", "minor"];

export const SEVERITY_RANK: Record<Impact, number> = {
  critical: 3,
  serious: 2,
  moderate: 1,
  minor: 0,
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function normalizeViolation(raw: unknown): Violation | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  const id = asString(v.id);
  if (!id) return null;
  const impact = IMPACTS.includes(v.impact as Impact) ? (v.impact as Impact) : "minor";
  const nodes = (Array.isArray(v.nodes) ? v.nodes : []).map((n): ViolationNode => {
    const o = (n ?? {}) as Record<string, unknown>;
    const target = Array.isArray(o.target) ? o.target.map((t) => String(t)) : [];
    return {
      html: asString(o.html),
      target,
      failureSummary: asString(o.failureSummary),
    };
  });
  return {
    id,
    impact,
    description: asString(v.description),
    help: asString(v.help),
    helpUrl: typeof v.helpUrl === "string" ? v.helpUrl : undefined,
    tags: Array.isArray(v.tags) ? v.tags.map((t) => String(t)) : [],
    nodes,
  };
}

/**
 * Accepts both shapes we produce: the hosted API response
 * ({url, scanned_at, violations, permalink, ...}) and the axle-cli report file
 * ({result: {url, scannedAt, violations, ...}, fixes}). Counts are recomputed
 * from the violations so the numbers on screen always match the list.
 */
export function normalizeScan(raw: unknown): ScanResult {
  const top = (raw ?? {}) as Record<string, unknown>;
  const r = (
    top.result && typeof top.result === "object" ? top.result : top
  ) as Record<string, unknown>;
  if (!Array.isArray(r.violations)) {
    throw new Error("Unexpected scan result (no violations list)");
  }
  const violations = r.violations
    .map(normalizeViolation)
    .filter((v): v is Violation => v !== null);
  const count = (i: Impact) => violations.filter((v) => v.impact === i).length;
  return {
    url: asString(r.url, "about:blank"),
    scanned_at: asString(r.scanned_at) || asString(r.scannedAt) || new Date().toISOString(),
    engine: asString(r.engine, "axe-core"),
    permalink: typeof r.permalink === "string" ? r.permalink : undefined,
    summary: {
      violations: violations.length,
      critical: count("critical"),
      serious: count("serious"),
      moderate: count("moderate"),
      minor: count("minor"),
    },
    violations,
  };
}

/**
 * Split violations by the `axle.failOn` threshold. Nothing is dropped: the
 * panel shows the below-threshold ones in a collapsed section.
 */
export function partitionByThreshold(
  violations: Violation[],
  failOn: FailOn,
): { shown: Array<{ v: Violation; index: number }>; hidden: Array<{ v: Violation; index: number }> } {
  const indexed = violations.map((v, index) => ({ v, index }));
  if (failOn === "none") return { shown: indexed, hidden: [] };
  const min = SEVERITY_RANK[failOn];
  return {
    shown: indexed.filter(({ v }) => SEVERITY_RANK[v.impact] >= min),
    hidden: indexed.filter(({ v }) => SEVERITY_RANK[v.impact] < min),
  };
}

export function isLocalUrl(raw: string): boolean {
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return false;
  }
  host = host.replace(/^\[|\]$/g, "");
  return (
    host === "localhost" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".test") ||
    host.endsWith(".internal") ||
    /^127\./.test(host) ||
    /^0\.0\.0\.0$/.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

function clip(value: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return clean.length > max ? clean.slice(0, max) : clean;
}

/**
 * Body for POST /api/fix. Sends ONE element of ONE violation, with the same
 * caps as the WordPress plugin — nothing else from the user's machine.
 */
export function buildFixRequest(v: Violation, nodeIndex: number) {
  const node = v.nodes[nodeIndex];
  if (!node) throw new Error("That element is no longer in the last scan result.");
  return {
    violation: {
      id: v.id,
      impact: v.impact,
      description: clip(v.description, 600),
      help: clip(v.help, 300),
      helpUrl: v.helpUrl,
      tags: v.tags.slice(0, 20),
      nodes: [
        {
          html: clip(node.html, 500),
          target: node.target.slice(0, 10).map((t) => clip(t, 500)),
          failureSummary: clip(node.failureSummary, 1500),
        },
      ],
    },
    nodeIndex: 0,
  };
}

function fence(code: string): string {
  // Use a fence longer than any backtick run inside the snippet.
  const longest = Math.max(2, ...(code.match(/`+/g) ?? []).map((m) => m.length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}html\n${code}\n${ticks}`;
}

export function renderFixMarkdown(
  fix: FixResponse,
  v: Violation,
  node: ViolationNode,
  pageUrl: string,
): string {
  const lines: string[] = [];
  lines.push(`# AI fix — \`${v.id}\``);
  lines.push("");
  lines.push(`**${v.help}** (${v.impact}) · ${pageUrl}`);
  lines.push("");
  lines.push(`Element: \`${node.target.join(" ") || "(no selector)"}\``);
  lines.push("");
  if (fix.explanation) {
    lines.push("## What is wrong", "", fix.explanation, "");
  }
  if (fix.fix_strategy) {
    lines.push("## How to fix it", "", fix.fix_strategy, "");
  }
  for (const p of fix.patches ?? []) {
    if (p.selector) lines.push(`### \`${p.selector}\``, "");
    if (p.before) lines.push("**Before**", "", fence(p.before), "");
    if (p.after) lines.push("**After**", "", fence(p.after), "");
    if (p.notes) lines.push(p.notes, "");
  }
  lines.push(`**Confidence:** ${fix.confidence ?? "unknown"}`);
  if (fix.manual_review_needed) {
    lines.push("", "> ⚠️ Manual review recommended — check this change in context before using it.");
  }
  lines.push(
    "",
    "_This is a suggested change, generated by AI. Review it before applying it to your code._",
  );
  if (fix.tier === "subscriber") {
    lines.push("", "_Included in your axle plan._");
  } else if (typeof fix.remaining === "number") {
    lines.push("", `_Free AI fixes left today: ${fix.remaining}_`);
  }
  return lines.join("\n") + "\n";
}

/** Throttle for the "run this in CI" tip: not before the 2nd scan, then at most weekly. */
export const CI_TIP_MIN_SCANS = 2;
export const CI_TIP_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export function shouldShowCiTip(
  state: { scanCount: number; lastShown: number | undefined },
  enabled: boolean,
  now: number,
): boolean {
  if (!enabled) return false;
  if (state.scanCount < CI_TIP_MIN_SCANS) return false;
  if (state.lastShown !== undefined && now - state.lastShown < CI_TIP_INTERVAL_MS) return false;
  return true;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

#!/usr/bin/env node
/**
 * axle MCP server — exposes the axle WCAG 2.2 AA scanner over the
 * Model Context Protocol so Claude Desktop, Cursor, Cline, Continue,
 * and any other MCP-compatible agent can scan URLs for accessibility
 * violations as a tool.
 *
 * The server is a thin wrapper over the public scan endpoint at
 *   POST https://axle-iota.vercel.app/api/scan
 * — same engine (axe-core 4.11) and same persistence layer that powers
 * the GitHub Action and the /r/<id> shareable certificate URLs.
 *
 * Transport: stdio (standard for MCP servers run by the host app).
 * Configurable via env:
 *   AXLE_API_BASE   — default "https://axle-iota.vercel.app"
 *   AXLE_API_KEY    — optional Bearer token; removes free-tier rate limits
 *   AXLE_SOURCE     — default "axle-mcp"; passed to the API for telemetry
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.AXLE_API_BASE ?? "https://axle-iota.vercel.app";
const API_KEY = process.env.AXLE_API_KEY;
const SOURCE = process.env.AXLE_SOURCE ?? "axle-mcp";

type AxleViolation = {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor" | null;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{ html: string; target: string[]; failureSummary: string }>;
};

type AxleScanResponse = {
  url: string;
  scanned_at?: string;
  scannedAt?: string;
  result_id?: string;
  permalink?: string;
  summary: {
    violations?: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  violations: AxleViolation[];
};

const server = new Server(
  {
    name: "axle-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "scan_url",
      description:
        "Scan a public URL for WCAG 2.1 / 2.2 AA accessibility violations using axe-core 4.11. Returns prioritized issues by severity (critical / serious / moderate / minor) with the failing HTML, the WCAG criteria tags, and a public shareable certificate URL at /r/<id>. Use this when the user asks 'is X accessible?', 'does X comply with ADA / EAA / WCAG?', or asks for an a11y audit of a specific website.",
      inputSchema: {
        type: "object",
        required: ["url"],
        properties: {
          url: {
            type: "string",
            description:
              "Public http(s) URL to scan. Internal hostnames (localhost, *.local, *.test) are rejected by the hosted scanner.",
          },
        },
      },
    },
    {
      name: "explain_violation",
      description:
        "Explain a specific axe-core rule by ID (e.g., 'color-contrast', 'image-alt', 'label'). Returns the WCAG success criteria the rule maps to, why it matters for ADA / EAA compliance, and concrete code-level fix patterns. Use this after scan_url when the user wants to understand a specific violation in depth.",
      inputSchema: {
        type: "object",
        required: ["rule_id"],
        properties: {
          rule_id: {
            type: "string",
            description:
              "axe-core rule ID, exactly as returned by scan_url. Examples: color-contrast, image-alt, label, link-name, button-name, html-has-lang.",
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "scan_url") {
    const url = (args as { url?: unknown })?.url;
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      throw new Error(
        "scan_url requires a public http(s) URL. Got: " + JSON.stringify(url),
      );
    }
    return await handleScan(url);
  }

  if (name === "explain_violation") {
    const rule_id = (args as { rule_id?: unknown })?.rule_id;
    if (typeof rule_id !== "string" || !rule_id) {
      throw new Error("explain_violation requires a rule_id string.");
    }
    return handleExplain(rule_id);
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function handleScan(url: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": `axle-mcp/0.1.0 (+${API_BASE})`,
  };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

  const res = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url, source: SOURCE }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `axle scanner returned ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`,
    );
  }

  const data = (await res.json()) as AxleScanResponse;
  const summary = data.summary ?? {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };
  const total =
    summary.violations ??
    (summary.critical + summary.serious + summary.moderate + summary.minor);
  const permalink = data.permalink
    ? `${API_BASE}${data.permalink.startsWith("/") ? "" : "/"}${data.permalink}`
    : null;

  const lines: string[] = [];
  lines.push(`# axle scan — ${data.url}`);
  lines.push("");
  lines.push(
    `**${total} violation${total === 1 ? "" : "s"}** · critical: ${summary.critical} · serious: ${summary.serious} · moderate: ${summary.moderate} · minor: ${summary.minor}`,
  );
  lines.push("");
  if (permalink) {
    lines.push(`Shareable certificate: ${permalink}`);
    lines.push("");
  }

  if (data.violations.length === 0) {
    lines.push(
      "✓ No WCAG 2.2 AA violations detected by automated scanning. Manual review by a human auditor is still recommended for full conformance — automated tools catch ~57% of WCAG issues.",
    );
  } else {
    const sorted = [...data.violations].sort(
      (a, b) => impactRank(a.impact) - impactRank(b.impact),
    );
    for (const v of sorted) {
      lines.push(
        `## ${(v.impact ?? "minor").toUpperCase()} — \`${v.id}\` (${v.nodes.length} element${v.nodes.length === 1 ? "" : "s"})`,
      );
      lines.push(v.help);
      const wcagTags = (v.tags ?? []).filter((t) => t.startsWith("wcag"));
      if (wcagTags.length > 0) lines.push(`Tags: ${wcagTags.join(" · ")}`);
      if (v.helpUrl) lines.push(`Docs: ${v.helpUrl}`);
      lines.push("");
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text: lines.join("\n"),
      },
    ],
    structuredContent: {
      url: data.url,
      result_id: data.result_id ?? null,
      permalink,
      summary: {
        total,
        critical: summary.critical,
        serious: summary.serious,
        moderate: summary.moderate,
        minor: summary.minor,
      },
      violations: data.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        node_count: v.nodes.length,
      })),
    },
  };
}

function impactRank(
  impact: "critical" | "serious" | "moderate" | "minor" | null,
): number {
  switch (impact) {
    case "critical":
      return 0;
    case "serious":
      return 1;
    case "moderate":
      return 2;
    case "minor":
      return 3;
    default:
      return 4;
  }
}

function handleExplain(ruleId: string) {
  const docsUrl = `https://dequeuniversity.com/rules/axe/4.11/${encodeURIComponent(ruleId)}`;
  return {
    content: [
      {
        type: "text" as const,
        text:
          `axe-core rule \`${ruleId}\` — full documentation, WCAG mapping, ` +
          `failure examples, and remediation patterns:\n\n${docsUrl}\n\n` +
          `For ADA Title III defense and EAA 2025 conformance, the rule's ` +
          `WCAG 2.2 AA criteria tag (e.g., wcag143 for color contrast) is ` +
          `what courts and conformance reports cite. Always pair an automated ` +
          `scan finding with a manual review by a qualified auditor before ` +
          `claiming full conformance — automated tooling catches ~57% of ` +
          `WCAG issues.`,
      },
    ],
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`axle-mcp fatal: ${err?.message ?? err}\n`);
  process.exit(1);
});

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "axle MCP server — WCAG / ADA / EAA scanner for Claude Desktop, Cursor, Cline",
  description:
    "Install axle as a Model Context Protocol server. Lets Claude Desktop, Cursor, Cline, and any MCP-compatible agent scan URLs for WCAG 2.2 AA violations using axe-core 4.11.",
  keywords: [
    "axle MCP",
    "MCP server accessibility",
    "Claude Desktop accessibility",
    "Cursor a11y plugin",
    "Cline accessibility",
    "Continue.dev WCAG",
    "Model Context Protocol axe-core",
    "axle",
  ],
  openGraph: {
    title: "axle MCP server — accessibility scanner as an MCP tool",
    description:
      "Add axle to Claude Desktop, Cursor, Cline, or any MCP host. Same engine as the axle GitHub Action.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · Model Context Protocol
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          axle MCP server
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          One <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">npx</code> away from giving Claude Desktop, Cursor, Cline, or any
          MCP-compatible agent the ability to scan a URL for WCAG 2.1 / 2.2 AA
          violations and return a structured report — same engine (axe-core
          4.11) that powers the{" "}
          <Link className="underline hover:text-slate-900" href="/">
            axle GitHub Action
          </Link>{" "}
          and the WordPress / VSCode / Storybook plugins.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          What your agent gets
        </h2>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
                scan_url
              </code>
            </strong>{" "}
            — Renders the URL in headless Chromium, runs axe-core 4.11, returns
            violations grouped by severity (critical / serious / moderate /
            minor) plus a public shareable certificate URL at{" "}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
              /r/&lt;id&gt;
            </code>
            .
          </li>
          <li>
            <strong>
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
                explain_violation
              </code>
            </strong>{" "}
            — Given an axe-core rule ID (e.g.{" "}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
              color-contrast
            </code>
            ), returns the WCAG criteria, ADA / EAA framing, and the Deque
            University remediation patterns.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Install in Claude Desktop
        </h2>
        <p className="mt-2 text-slate-700">
          Edit{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-900">
            ~/Library/Application Support/Claude/claude_desktop_config.json
          </code>{" "}
          (macOS) or{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-900">
            %APPDATA%\Claude\claude_desktop_config.json
          </code>{" "}
          (Windows):
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"]
    }
  }
}`}
        </pre>
        <p className="mt-2 text-sm text-slate-600">
          Restart Claude Desktop. You&apos;ll see a 🔨 icon in the composer —
          click it and <code>axle.scan_url</code> is callable.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Install in Cursor
        </h2>
        <p className="mt-2 text-slate-700">
          Settings → Features → Model Context Protocol → Add server:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`Command: npx -y axle-mcp`}
        </pre>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Install in Cline (VS Code)
        </h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`{
  "axle": {
    "command": "npx",
    "args": ["-y", "axle-mcp"]
  }
}`}
        </pre>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Install in Continue.dev
        </h2>
        <p className="mt-2 text-slate-700">
          In <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-900">~/.continue/config.json</code>:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"]
    }
  }
}`}
        </pre>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Try it
        </h2>
        <p className="mt-2 text-slate-700">
          Once installed, in any MCP-connected chat just ask:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-800">
          <li>Is <code>https://example.com</code> ADA compliant?</li>
          <li>Scan <code>https://stripe.com/pricing</code> for WCAG 2.2 AA violations.</li>
          <li>Audit <code>https://staging.acme.com</code> and explain the top 3 issues.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Removing the rate limit
        </h2>
        <p className="mt-2 text-slate-700">
          Free tier is 5 scans / day per IP. To remove the limit, get an API key
          from <Link className="underline hover:text-slate-900" href="/pricing">/pricing</Link>{" "}
          and add it to the MCP config:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"],
      "env": {
        "AXLE_API_KEY": "sk_axle_..."
      }
    }
  }
}`}
        </pre>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Why axle-mcp vs other a11y MCP servers?
        </h2>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>Same engine as the GitHub Action.</strong> What you see in
            chat is exactly what the CI will block on PR — no surprises when a
            scan in chat passes but a scan in CI fails.
          </li>
          <li>
            <strong>Public shareable certificate URLs.</strong>{" "}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
              /r/&lt;id&gt;
            </code>{" "}
            is a permanent public report you can paste into a Jira ticket, a
            sales-engineering doc, or an EAA conformance bundle.
          </li>
          <li>
            <strong>No local Chromium.</strong> Runs against the hosted scanner
            so it works even when you don&apos;t have Playwright installed.
          </li>
          <li>
            <strong>Local-first option.</strong> If you want fully local
            scanning, swap to{" "}
            <Link className="underline hover:text-slate-900" href="https://www.npmjs.com/package/axle-cli" target="_blank">
              axle-cli
            </Link>
            {" "}— same project, same engine, no network.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Honest scope
        </h2>
        <p className="mt-2 text-slate-700">
          axe-core (and therefore this MCP server) catches roughly{" "}
          <strong>57%</strong> of WCAG issues automatically. The other 43%
          require manual review by a qualified human auditor. Treat the output
          as a high-recall first pass, not a conformance certificate.
        </p>

        <hr className="my-12 border-slate-300" />
        <p className="text-sm text-slate-600">
          Source:{" "}
          <Link
            className="underline hover:text-slate-900"
            href="https://github.com/asafamos/axle/tree/main/packages/axle-mcp"
            target="_blank"
          >
            github.com/asafamos/axle/packages/axle-mcp
          </Link>
          {" · "}
          npm:{" "}
          <Link
            className="underline hover:text-slate-900"
            href="https://www.npmjs.com/package/axle-mcp"
            target="_blank"
          >
            axle-mcp
          </Link>
          {" · "}
          Already use ChatGPT?{" "}
          <Link className="underline hover:text-slate-900" href="/gpt">
            Add axle to a GPT instead
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle for ChatGPT GPTs and Claude tool use — connect axle to your AI",
  description:
    "Add axle's WCAG scanner as a tool in your ChatGPT GPT, Claude tool-use app, or any LLM agent. Free tier, no auth required, OpenAPI spec at /openapi.yaml.",
  keywords: [
    "axle ChatGPT GPT",
    "axle Claude tool",
    "ChatGPT accessibility plugin",
    "Claude WCAG tool",
    "OpenAI plugin a11y",
    "MCP server accessibility",
    "axle",
  ],
  openGraph: {
    title: "axle as a tool for ChatGPT GPTs and Claude",
    description:
      "Connect axle's WCAG scanner to any LLM agent. Free, no auth, OpenAPI spec.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/gpt" },
};

export default function GptPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · ChatGPT + Claude integration
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          axle as a tool for your LLM agent
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Engineers ask ChatGPT and Claude &ldquo;is my site accessible?&rdquo;
          all the time. The honest answer the model can give without a tool
          is &ldquo;I don&apos;t know — I can&apos;t see your site&rdquo;. With
          axle wired in as a tool, the model can actually run the scan and
          return a structured report. This page is the one-stop shop for
          plugging axle into ChatGPT GPTs, Claude tool-use applications, MCP
          servers, and any other agent framework.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            ChatGPT GPT (custom GPT) setup
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Create a new GPT at <a className="underline" href="https://chatgpt.com/gpts/editor" target="_blank" rel="noopener">chatgpt.com/gpts/editor</a>.</li>
            <li>Configure → Actions → <strong>Create new action</strong>.</li>
            <li>Authentication: <strong>None</strong>.</li>
            <li>Schema → <strong>Import from URL</strong>: paste{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-900">
                https://axle-iota.vercel.app/openapi.yaml
              </code>
            </li>
            <li>The action <code>scanUrlForAccessibility</code> will appear with the right schema.</li>
            <li>Privacy policy URL: <code>https://axle-iota.vercel.app/privacy</code></li>
            <li>System prompt suggestion (paste into Instructions):
              <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`When the user asks about a website's accessibility, WCAG conformance,
ADA / EAA / Section 508 status, or asks to audit / scan a site for
accessibility, call the scanUrlForAccessibility tool with the URL.
Then summarize the response: report total violations by severity,
list the top 3 most serious issues with their WCAG criteria, and
share the /r/<id> permalink so the user can open the full report.`}
              </pre>
            </li>
            <li>Save → publish the GPT.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Claude tool-use setup (Anthropic API)
          </h2>
          <p className="mt-3 text-slate-700">
            Claude&apos;s tool-use API takes the OpenAPI spec inline. Minimal
            example using <code>@anthropic-ai/sdk</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
  {
    name: "scan_url_for_accessibility",
    description:
      "Scan a URL for WCAG 2.2 AA accessibility violations using axe-core 4.11. " +
      "Returns a structured report grouped by severity. Use whenever the user asks " +
      "about a website's accessibility, WCAG status, ADA compliance, or asks to audit a site.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public URL to scan (http/https)" },
      },
      required: ["url"],
    },
  },
];

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "Is example.com accessible?" }],
});

// When Claude returns tool_use, fetch from axle:
async function runAxleScan(url: string) {
  const res = await fetch("https://axle-iota.vercel.app/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, source: "claude-tool" }),
  });
  return res.json();
}`}
          </pre>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            MCP server (Model Context Protocol)
          </h2>
          <p className="mt-3 text-slate-700">
            The Anthropic MCP spec is the emerging standard for tool servers
            that work across Claude, ChatGPT, and Cursor. Until we ship a
            dedicated MCP server, you can wrap the OpenAPI endpoint above
            using any of the OpenAPI→MCP bridges (e.g.{" "}
            <a
              className="underline"
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener"
            >
              modelcontextprotocol/servers
            </a>
            ).
          </p>
          <p className="mt-3 text-slate-700">
            Native MCP server is on the roadmap — email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>{" "}
            if you want a heads-up when it ships.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Anti-abuse + rate limits
          </h2>
          <p className="mt-3 text-slate-700">
            The free-tier endpoint allows <strong>5 scans / day / IP</strong>.
            For higher volume, sign up for a Team or Business plan and pass
            the API key as <code>Authorization: Bearer &lt;key&gt;</code>{" "}
            with each request — the rate limit is removed.
          </p>
          <p className="mt-3 text-slate-700">
            Internal hostnames (localhost, *.local, *.test, IP addresses)
            are rejected. Public URLs only.
          </p>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Built one? Tell us
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            If you ship a public ChatGPT GPT or Claude integration that uses
            axle, email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>{" "}
            and we&apos;ll feature it in our docs / certified directory. The
            partner program ({" "}
            <Link href="/partners" className="underline">
              /partners
            </Link>
            ) pays 30% recurring on every Team / Business plan referred via
            your tool.
          </p>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://axle-iota.vercel.app/openapi.yaml"
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Open OpenAPI spec →
          </a>
          <a
            href="https://axle-iota.vercel.app/.well-known/ai-plugin.json"
            target="_blank"
            rel="noopener"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            ai-plugin.json
          </a>
          <Link
            href="/docs"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            API docs
          </Link>
          <Link
            href="/partners"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Partner program
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 7 May 2026.
        </footer>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap — what axle has shipped, what's next, what we're not doing",
  description:
    "Honest roadmap. Three columns: shipped (and proven), in development, and explicitly out of scope. Updated as things ship.",
  alternates: { canonical: "/roadmap" },
};

type Item = {
  title: string;
  body: string;
};

const SHIPPED: Item[] = [
  {
    title: "axe-core 4.11 scanner",
    body: "WCAG 2.0 / 2.1 / 2.2 A+AA evaluation, headless Chromium via Playwright. Same engine as the GitHub Action, the CLI, and the MCP server.",
  },
  {
    title: "GitHub Action",
    body: "Composite action on the Marketplace as asafamos/axle-action. Posts a sticky PR comment with violations, fails the check at configurable severity.",
  },
  {
    title: "create-issues mode",
    body: "Opt-in axle-action mode that opens / updates / closes GitHub Issues per violation, deduped by axe rule + first-node selector. Treat it like Renovate, for accessibility.",
  },
  {
    title: "Claude fix suggestions in PR comments",
    body: "With with-ai-fixes: true, the PR comment includes a per-violation diff suggesting how to remediate. Diffs are HTML-level (current → fixed), and apply cleanly for static markup; React/Vue/template-engine apps need a human in the loop for the source mapping.",
  },
  {
    title: "axle-mcp Model Context Protocol server",
    body: "npm install -g axle-mcp. Wires Claude Desktop / Cursor / Cline / Continue.dev to axle. Two tools: scan_url, explain_violation. Stdio transport. Verified end-to-end.",
  },
  {
    title: "VS Code extension",
    body: "asafamos.axle-a11y on the Microsoft Marketplace. Command palette scan, in-editor webview with the report, share to /r/<id>.",
  },
  {
    title: "axle-storybook addon",
    body: "axle-storybook on npm. Storybook 7/8/9 compatible, runs axe against every story, panel UI with severity badges.",
  },
  {
    title: "Hosting plugins — Netlify / Cloudflare Pages / Vercel",
    body: "Build-time integration plugins on npm. Each fails the deploy when violations cross the threshold. Low download counts so far — surface, not yet adopted.",
  },
  {
    title: "WordPress plugin (AsafAmos Accessibility Scanner)",
    body: "axe-core runs entirely in the WP admin browser via a hidden iframe. Free version on the WordPress.org directory (under review at time of writing).",
  },
  {
    title: "/api/scan + /api/fix hosted endpoints",
    body: "Public hosted scanner. 3 scans/day/IP free, unlimited with an axle API key. Powers the web /free-scan form, the MCP server, the Slack App, and the ChatGPT GPT.",
  },
  {
    title: "/r/<id> shareable certificate URLs",
    body: "Every scan produces a public permalink with custom OG image. 30-day TTL. Used as a viral primitive in cold emails, Jira tickets, EAA conformance bundles.",
  },
  {
    title: "Hebrew accessibility statement generator",
    body: "/statement runs locally in the browser, generates a תקנה 35-aligned Hebrew statement. No upload, no signup.",
  },
  {
    title: "OpenAPI 3.1 spec + .well-known/ai-plugin.json",
    body: "Public API spec at /openapi.yaml. ChatGPT GPT builders, Claude tool-use, OpenAPI→MCP bridges all import from here.",
  },
];

const IN_DEVELOPMENT: Item[] = [
  {
    title: "Auto-opening fix PRs (not just Issues)",
    body: "The marketing copy on /why-axle calls out 'Claude opens a PR per violation'. Today, the create-issues mode opens GitHub Issues with the AI fix in the body. The next phase is to map the AI diff back to the source file (HTML / JSX / Vue template) and open a real draft PR. Hard part is the selector→source mapping for templating engines. Plan: ship for static HTML first, then JSX/TSX with a heuristic, then templating engines via plugin contracts.",
  },
  {
    title: "Slack App (hosted listing)",
    body: "/slack landing + /axle scan slash command code is shipped (see packages/axle-slack/). The hosted Slack App Directory listing is in the pipeline. Self-host works today.",
  },
  {
    title: "EU multilingual statement pack",
    body: "Hebrew statement ships. The /pricing $299 Business tier promises German / French / Italian / Spanish / Dutch / Portuguese / Swedish / Polish. The infrastructure is in place; per-country translations + legal review for each are in progress. Don't promise day-one delivery on this tier yet.",
  },
  {
    title: "Cal.com / Calendly demo booking",
    body: "/demo currently uses a pre-filled mailto with a context-gathering template. Direct calendar booking will replace it once the booking tool is set up.",
  },
  {
    title: "ChatGPT GPT publishing",
    body: "OpenAPI spec is live (3.1.0, validated). The actual GPT publication is blocked by an OpenAI workspace-side bug on the owner account. Will retry once OpenAI resolves on their side.",
  },
  {
    title: "Reddit account recovery",
    body: "Posts from u/SwapVideoTeam were auto-filtered by Reddit (looks like a shadowban from posting cadence on a fresh account). Migration plan: post via a different channel until the account is whitelisted via Reddit appeals.",
  },
];

const OUT_OF_SCOPE: Item[] = [
  {
    title: "Replacing axe DevTools Pro at the enterprise tier",
    body: "Deque's product is mature and integrated. axle isn't trying to win that fight. For teams with budget for axe DevTools Pro and an existing relationship with Deque, run both for a month and pick.",
  },
  {
    title: "An accessibility overlay widget",
    body: "Never. Overlay widgets do not work. The FTC settled accessiBe at $1M in January 2025 specifically for deceptive claims about overlay widgets. axle scans the served HTML — the only thing regulators actually evaluate. See /why-not-overlay.",
  },
  {
    title: "A managed dashboard with SSO, RBAC, audit logs",
    body: "axle is a CI tool that uses GitHub / Linear / Jira as the dashboard. If you need a single-pane-of-glass managed dashboard, look at Tenon.io or axe Watcher.",
  },
  {
    title: "A general-purpose AI coding tool",
    body: "axle generates fixes for a specific class of violations using axe-core's rule taxonomy. It is not a general code-generation tool. For that, use Cursor / Claude Code / Copilot — and install axle-mcp into them so accessibility is one of the things they can call.",
  },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · honest roadmap
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          What we&apos;ve shipped, what we&apos;re building, what we&apos;re
          not doing
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          The single biggest gap between a 30-day-old product and a credible
          one is honesty about scope. Here&apos;s exactly where axle is today.
          Updated as things ship.
        </p>

        <hr className="my-10 border-slate-300" />

        <Section
          title="Shipped"
          subtitle="Working in production, used by real (early) adopters."
          items={SHIPPED}
          tone="green"
        />

        <Section
          title="In development"
          subtitle="Promised in marketing copy, partly built, not 'done'. We&apos;d rather tell you here than have you discover it during a sales call."
          items={IN_DEVELOPMENT}
          tone="amber"
        />

        <Section
          title="Explicitly out of scope"
          subtitle="Things we won&apos;t build, with our reason. Saves both sides time on calls."
          items={OUT_OF_SCOPE}
          tone="slate"
        />

        <hr className="my-12 border-slate-300" />

        <p className="text-sm text-slate-600">
          Disagree with what&apos;s in or out?{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>{" "}
          — happy to discuss. The roadmap above is opinionated but
          falsifiable. Comparison-shopping?{" "}
          <Link className="underline" href="/why-axle">
            /why-axle
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/compare">
            /compare
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

function Section({
  title,
  subtitle,
  items,
  tone,
}: {
  title: string;
  subtitle: string;
  items: Item[];
  tone: "green" | "amber" | "slate";
}) {
  const toneClass = {
    green: "border-emerald-300 bg-emerald-50 text-emerald-900",
    amber: "border-amber-300 bg-amber-50 text-amber-900",
    slate: "border-slate-300 bg-slate-100 text-slate-800",
  }[tone];

  return (
    <section className="mt-10">
      <div className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${toneClass}`}>
        {title} · {items.length}
      </div>
      <p className="mt-3 text-slate-700">{subtitle}</p>
      <ul className="mt-5 space-y-4">
        {items.map((it) => (
          <li
            key={it.title}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

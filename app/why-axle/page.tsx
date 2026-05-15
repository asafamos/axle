import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Why axle — when Pa11y is free and axe-core works, what does axle actually do for me?",
  description:
    "The honest case for axle over the free open-source alternatives. Three differentiators: Claude-generated source-code fix PRs, EU multilingual statement pack, MCP server for Claude / Cursor / Cline. ROI math at the bottom.",
  keywords: [
    "why axle",
    "axle pricing",
    "axle vs free tools",
    "axe-core SaaS vs free",
    "accessibility CI value",
    "EAA compliance ROI",
    "ADA defense tool",
    "axle",
  ],
  openGraph: {
    title: "Why axle — the honest case for paying for accessibility CI",
    description:
      "Three differentiators that aren't in Pa11y / axe-core / Lighthouse. ROI math at the bottom.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/why-axle" },
};

export default function WhyAxlePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · the honest case for paying
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          If <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-2xl text-slate-900">axe-core</code> is free, why pay for axle?
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Fair question. <Link className="underline hover:text-slate-900" href="/compare">The comparison page</Link> tells you Pa11y, Lighthouse CI, and the axe-core CLI all run the same engine for $0. The free tier of axle runs the same engine too. Here&apos;s when paying — for axle or any other paid tool — actually pays back.
        </p>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          The four reasons people actually upgrade
        </h2>

        <h3 className="mt-8 text-xl font-bold text-slate-900">
          1. Claude-generated source-code fix PRs
        </h3>
        <p className="mt-2 text-slate-700">
          Every scanner gives you a list of violations.{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">color-contrast on 17 elements</code>,{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">image-alt missing on 23 images</code>,{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">label not associated with input</code>. Great. Now someone has to fix all of that.
        </p>
        <p className="mt-3 text-slate-700">
          Average dev time per fix in our internal benchmark: <strong>22 minutes</strong>. At 47 violations and $100/hr loaded engineering rate, that&apos;s <strong>$1,720 of engineering work</strong> per scan. The first scan on most apps surfaces 30-120 violations. The math gets ugly fast.
        </p>
        <p className="mt-3 text-slate-700">
          axle Team ($49/mo) opens a PR per violation with a Claude-generated source-code diff. About 70% merge cleanly with one round of review. The remaining 30% need real human judgment — which is exactly the part of a remediation sprint that&apos;s worth a human&apos;s time.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          <strong>ROI calc:</strong> One scan, 47 violations, 70% auto-mergeable = 33 fixes you don&apos;t touch = ~12 hours of engineering saved = <strong>$1,200 on a $49/mo plan</strong>. Pays back month one.
        </p>

        <h3 className="mt-10 text-xl font-bold text-slate-900">
          2. EU multilingual statement pack (EAA 2025)
        </h3>
        <p className="mt-2 text-slate-700">
          If you ship a consumer-facing service into the EU and you employ 10+ people, EAA 2025 has been enforceable since 28 June 2025. Penalties are state-by-state:
          DE €100K, FR €25K, IT 5% of turnover, ES €600K, NL €900K, PL 10% of turnover.
        </p>
        <p className="mt-3 text-slate-700">
          Each member state requires the accessibility statement <strong>in its own language</strong>, with the local conformance authority, escalation procedure, and named contact. One English statement doesn&apos;t satisfy the rules.
        </p>
        <p className="mt-3 text-slate-700">
          axle Business ($299/mo) ships a statement pack covering German, French, Italian, Spanish, Dutch, Portuguese, Swedish, Polish, and Hebrew (Israeli תקנה 35) with per-country authority + escalation pre-filled. Generated per service, kept fresh as your scan history updates.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          <strong>ROI calc:</strong> One legal-team hour to draft a multilingual statement set = $400+. axle Business covers an entire year of regenerated statements for $3,588 — typically less than what one accessibility lawyer charges to review a single English statement.
        </p>

        <h3 className="mt-10 text-xl font-bold text-slate-900">
          3. Auto-managed GitHub Issues per violation
        </h3>
        <p className="mt-2 text-slate-700">
          Most scanners stop at a PR comment that disappears once the PR
          merges. With{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
            create-issues: true
          </code>
          , axle opens a deduplicated GitHub Issue per WCAG violation —
          impact-labelled, AI-fix in the body, target selector + first
          failing element preserved. When the next scan no longer sees the
          violation, axle auto-closes the issue with a comment linking to the
          fixing commit.
        </p>
        <p className="mt-3 text-slate-700">
          Net effect: your team triages accessibility in the same board as
          everything else (Linear / Jira / Notion sync via GitHub&apos;s native
          mirroring) instead of in an ephemeral PR thread. Treat it like
          Renovate but for WCAG.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          <strong>ROI calc:</strong> One agency we talked to was paying a
          contractor 4 hr/month to copy violations from PR comments into
          their Linear board. axle Team ($49/mo) replaces that workflow
          entirely — about $400 of manual ops eliminated per month per repo.
        </p>

        <h3 className="mt-10 text-xl font-bold text-slate-900">
          4. MCP server for Claude Desktop / Cursor / Cline
        </h3>
        <p className="mt-2 text-slate-700">
          New surface, shipped May 2026. <Link className="underline hover:text-slate-900" href="/mcp">axle-mcp</Link> is the only Model Context Protocol server for WCAG scanning. Wire it into any MCP-compatible agent in two lines:
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
        <p className="mt-3 text-slate-700">
          Now Claude can scan a URL during code review, explain a violation with WCAG mapping, and propose remediation patterns — all in chat, no context-switching to a CLI. For teams using Cursor / Claude Desktop as their primary surface, this is the only way to get accessibility into the loop without breaking flow.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          <strong>ROI calc:</strong> Hard to put a number on agent ergonomics. But every team we&apos;ve shown this to has installed it within 30 seconds of seeing the demo. Try the free tier (5 scans/day, no API key) before paying.
        </p>

        <hr className="my-12 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          When NOT to pay for axle
        </h2>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>You ship to one repo, US-only, and don&apos;t need AI-generated fixes.</strong>{" "}
            The free tier covers you. Use it forever. No upsell pressure, no degradation.
          </li>
          <li>
            <strong>You already use axe DevTools Pro and the team budget is there.</strong>{" "}
            Deque&apos;s product is mature; axle isn&apos;t trying to replace it for established enterprise customers. Run both in CI for a month, see what each catches.
          </li>
          <li>
            <strong>You want a managed dashboard with multi-user RBAC, SAML, audit logs.</strong>{" "}
            That&apos;s not what we built. Look at Tenon.io or axe Watcher.
          </li>
          <li>
            <strong>You believe an overlay widget fixes accessibility.</strong>{" "}
            It doesn&apos;t. <Link className="underline hover:text-slate-900" href="/why-not-overlay">Here&apos;s the FTC settlement</Link>.
          </li>
        </ul>

        <hr className="my-12 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          The honest social-proof signal
        </h2>
        <p className="mt-3 text-slate-700">
          axle is <strong>30 days old</strong>. As of writing: 12 distribution surfaces shipped (GitHub Action, npm CLI, 3 hosting plugins, WordPress plugin, VSCode extension, Storybook addon, MCP server, ChatGPT GPT, integrations recipes). <strong>0 paid customers yet</strong>. We&apos;re telling you that because if you&apos;re looking for &ldquo;1,000 teams trust us,&rdquo; we don&apos;t have that signal yet.
        </p>
        <p className="mt-3 text-slate-700">
          What we do have: the FTC settled against accessiBe for $1M in January 2025; EAA 2025 enforcement kicked in June 2025; ADA Title III lawsuits hit 4,000+ federal filings in 2024. The tooling that exists for handling these regulatory pressures is either expensive ($5-20K/year overlays that don&apos;t work; $40K+ audit firms) or free-and-DIY (Pa11y, axe-core CLI, no support, no statements, no AI). axle is the middle tier for teams that need to ship and not get sued.
        </p>

        <hr className="my-12 border-slate-300" />

        <div className="rounded-lg border border-slate-300 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Try the free tier first</h2>
          <p className="mt-3 text-slate-700">
            One repo, unlimited scans, all the same axe-core 4.11 engine. No signup, no credit card. Install the{" "}
            <Link className="underline hover:text-slate-900" href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci" target="_blank">
              GitHub Action
            </Link>{" "}
            or run a one-off scan at{" "}
            <Link className="underline hover:text-slate-900" href="/free-scan">
              /free-scan
            </Link>
            . Upgrade only when the value math actually shows up in your situation.
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Questions? <a className="underline" href="mailto:asaf@amoss.co.il">asaf@amoss.co.il</a>{" "}— or comparison-shop at <Link className="underline" href="/compare">/compare</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}

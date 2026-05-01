import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle vs Pa11y vs Lighthouse vs WAVE vs accessiBe — honest comparison",
  description:
    "Side-by-side comparison of axle, Pa11y, Lighthouse CI, WAVE, axe-core CLI, and accessiBe. Engine, CI integration, AI fixes, regulator-graded artifacts, pricing, what each is actually for. Built by axle but written for engineering teams choosing tools.",
  keywords: [
    "axle vs Pa11y",
    "Pa11y vs axe-core",
    "Lighthouse vs Pa11y",
    "axe-core vs Pa11y",
    "WAVE vs Pa11y",
    "accessiBe vs axe",
    "accessibility tool comparison",
    "a11y tool comparison",
    "axle",
  ],
  openGraph: {
    title: "axle vs Pa11y vs Lighthouse vs WAVE vs accessiBe — honest comparison",
    description:
      "Engine, CI, AI fixes, artifacts, pricing. Side-by-side. Written by axle but written for teams choosing.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/compare" },
};

type Tool = {
  name: string;
  url: string;
  engine: string;
  ci: string;
  ai: string;
  reports: string;
  artifacts: string;
  price: string;
  bestFor: string;
};

const tools: Tool[] = [
  {
    name: "axle",
    url: "https://axle-iota.vercel.app",
    engine: "axe-core 4.11 (same as below)",
    ci: "GitHub Action + npm CLI + Netlify / Cloudflare / Vercel / WordPress plugins",
    ai: "Claude Sonnet code-fix diffs in PR comments",
    reports: "Sticky PR comment + JSON + Markdown + public /r/<id> shareable URL",
    artifacts: "Per-PR scan history, statement generator (EAA / ADA / 35), VPAT-grade evidence",
    price: "Free 1 repo · $49/mo Team · $299/mo Business",
    bestFor: "Continuous compliance for teams that ship to EAA / ADA / Section 508 markets",
  },
  {
    name: "Pa11y",
    url: "https://pa11y.org",
    engine: "axe-core or HTML CodeSniffer",
    ci: "Pa11y CI (npm) + Pa11y Dashboard (self-host)",
    ai: "None",
    reports: "JSON / CSV; Dashboard for trend tracking (self-hosted)",
    artifacts: "Self-hosted history; nothing pre-built for regulators",
    price: "Free / open source; self-host costs",
    bestFor: "Open-source teams who want full control + self-hosted dashboard, no AI fixes, no SaaS",
  },
  {
    name: "Lighthouse CI",
    url: "https://github.com/GoogleChrome/lighthouse-ci",
    engine: "axe-core (subset) + custom rules; performance-focused",
    ci: "Lighthouse CI Action; chromium-based",
    ai: "None",
    reports: "Lighthouse score, JSON output",
    artifacts: "Performance + best practice + a11y blended score; not WCAG-mappable line-by-line",
    price: "Free / open source",
    bestFor: "Teams that already use Lighthouse for perf and want a11y as a side metric",
  },
  {
    name: "WAVE (WebAIM)",
    url: "https://wave.webaim.org",
    engine: "Proprietary; widely used by plaintiff firms",
    ci: "Browser extension; WAVE API (paid) for programmatic",
    ai: "None",
    reports: "Visual annotated overlay on the page",
    artifacts: "Manual screenshots; no native CI integration",
    price: "Free browser tool · paid API for automation",
    bestFor: "Manual single-page audits with visual feedback; lawyers cite it",
  },
  {
    name: "axe DevTools (Deque)",
    url: "https://www.deque.com/axe/devtools",
    engine: "axe-core (Deque is the maintainer)",
    ai: "Intelligent Guided Tests, no fix-diff generation",
    ci: "axe-core CLI (open source) + paid Pro / Watcher tiers",
    reports: "JSON, browser DevTools panel, dashboard (Pro+)",
    artifacts: "Audit history (Pro+); enterprise ARM compliance reports",
    price: "axe-core CLI free; axe DevTools Pro $40/mo per dev; Watcher enterprise (call for quote)",
    bestFor: "Enterprise teams with budget for the full Deque stack and per-seat pricing",
  },
  {
    name: "accessiBe / UserWay / AudioEye",
    url: "https://axle-iota.vercel.app/why-not-overlay",
    engine: "Runtime overlay widget — not a scanner",
    ci: "Doesn't apply",
    ai: "Auto-injected ARIA at runtime",
    reports: "Vendor-published 'compliance score' (questioned by regulators)",
    artifacts: "Vendor-issued statement; FTC fined accessiBe $1M for accuracy in Jan 2025",
    price: "$5K-$20K/year typical",
    bestFor: "Marketing demos. Not for actual compliance — see /why-not-overlay.",
  },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · honest comparison
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          axle vs Pa11y vs Lighthouse vs WAVE vs axe DevTools vs accessiBe
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Built by axle, but written for teams choosing tools. The page below is
          honest about what each tool is for — including where alternatives are
          better. The big idea: most accessibility tools are built on the same
          engine (<code>axe-core 4.11</code>); the real differentiation is{" "}
          <strong>delivery surface</strong>, <strong>CI integration</strong>,{" "}
          <strong>AI-assisted remediation</strong>, and <strong>regulator-
          ready artifacts</strong>.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Side-by-side — pick the right tool for the job
          </h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tool</th>
                  <th className="px-4 py-3">Engine</th>
                  <th className="px-4 py-3">CI</th>
                  <th className="px-4 py-3">AI fixes</th>
                  <th className="px-4 py-3">Reports</th>
                  <th className="px-4 py-3">Regulator artifacts</th>
                  <th className="px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 [&_td]:border-t [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top">
                {tools.map((t) => (
                  <tr key={t.name}>
                    <td>
                      <strong className="text-slate-900">{t.name}</strong>
                      <br />
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-emerald-700 underline"
                      >
                        site →
                      </a>
                    </td>
                    <td>{t.engine}</td>
                    <td>{t.ci}</td>
                    <td>{t.ai}</td>
                    <td>{t.reports}</td>
                    <td>{t.artifacts}</td>
                    <td>{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">When to pick which</h2>

          <Pick
            tool="Pa11y"
            scenario="You want full control, self-hosted, OSS-only, no SaaS, no AI"
            note="Pa11y Dashboard is genuinely good for teams with the operations capacity to host it. No AI fix generation, no PR-comment integration out of the box (you'd build that yourself), but the engine is the same axe-core under the hood."
          />

          <Pick
            tool="Lighthouse CI"
            scenario="You already use Lighthouse for performance and a11y is one of several quality bars"
            note="Lighthouse blends performance + a11y + best-practices into one score. Great for general quality regression but not WCAG-mappable line-by-line — it lumps issues. If you need to report 'we passed WCAG 4.1.2 specifically', Lighthouse won't tell you that."
          />

          <Pick
            tool="WAVE (WebAIM)"
            scenario="Single-page manual audits with visual feedback; lawyer / auditor reference"
            note="WAVE's annotated overlay is excellent for understanding violations visually. Plaintiff firms cite WAVE alongside axe-core. Use it for one-off audits, not CI — the WAVE API is paid + their CI story is rough."
          />

          <Pick
            tool="axe DevTools (Deque)"
            scenario="You're a Fortune 500 with a budget and want the canonical Deque stack"
            note="Deque maintains axe-core. The Pro / Watcher tiers add intelligent guided tests, dashboards, Issue tracking. Per-seat pricing means it scales with engineer headcount, not site count. Best fit if you have deep pockets and lots of engineers."
          />

          <Pick
            tool="accessiBe / UserWay / AudioEye"
            scenario="You want an overlay widget"
            note="Don't. The FTC fined accessiBe $1M in January 2025 for deceptive compliance claims. EAA 2025 / EN 301 549 evaluate served HTML, not runtime ARIA. See the full breakdown at /why-not-overlay."
          />

          <Pick
            tool="axle"
            scenario="You want CI scans on every PR + AI fix diffs + the regulator-graded artifacts (statement, audit trail) for under $300/mo"
            note="The use case axle was designed for. Free for one repo, $49/mo for hosted AI fixes + multi-repo, $299/mo for unlimited repos + EAA language pack. Same axe-core engine as Pa11y / Lighthouse / Deque axe DevTools, just packaged for the compliance workflow rather than as a developer-experience tool."
          />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>

          <details className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Aren&apos;t most of these the same engine?
            </summary>
            <p className="mt-3 text-sm text-slate-700">
              Yes — axle, Pa11y (in axe-core mode), Lighthouse, axe DevTools,
              and Microsoft Accessibility Insights all use <code>axe-core</code>.
              The differentiation is the <em>delivery surface</em>: how the
              violations are surfaced to engineers, how they integrate with CI,
              what artifacts they produce, and what AI-assisted remediation
              they offer. Same engine in different boxes.
            </p>
          </details>

          <details className="mt-3 rounded-lg border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Can I use multiple tools together?
            </summary>
            <p className="mt-3 text-sm text-slate-700">
              Yes — common stacks: Lighthouse CI for performance + a11y blended
              score, axle for the deep WCAG view + statement / audit-trail. Or
              Pa11y self-hosted for the dashboard + axle Action for the AI fix
              suggestions on PR. The engines are compatible because they&apos;re
              the same engine under the hood.
            </p>
          </details>

          <details className="mt-3 rounded-lg border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Is axle just &ldquo;Pa11y with AI&rdquo;?
            </summary>
            <p className="mt-3 text-sm text-slate-700">
              Roughly accurate but missing the regulator-artifacts piece. axle
              ships the things a compliance officer asks for after the scan —
              accessibility statement generator (EAA, ADA, Israeli תקנה 35),
              VPAT-grade evidence chain, public shareable scan results. Pa11y
              is positioned as a developer tool; axle is positioned as a
              compliance workflow that happens to also be a developer tool.
            </p>
          </details>

          <details className="mt-3 rounded-lg border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Why don&apos;t you compare against accessiBe properly?
            </summary>
            <p className="mt-3 text-sm text-slate-700">
              Because it&apos;s not in the same category. Overlay widgets are a
              different product class — they don&apos;t produce CI reports,
              don&apos;t scan source HTML, and the FTC just fined the largest
              vendor $1M for deceptive marketing in January 2025. The honest
              comparison is &ldquo;accessibility scanner + CI&rdquo; vs
              &ldquo;runtime overlay widget&rdquo;, not &ldquo;axle vs
              accessiBe&rdquo;. See{" "}
              <Link href="/why-not-overlay" className="underline">
                /why-not-overlay
              </Link>
              .
            </p>
          </details>
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Try axle before deciding
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            The fastest way to evaluate axle is the same way you&apos;d evaluate
            Pa11y or Lighthouse: run it once. The free scan returns the full
            WCAG 2.2 AA report by email; no signup, no credit card.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/free-scan"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Free scan →
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              GitHub Action →
            </a>
            <Link
              href="/pricing"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Docs
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclosure:</strong> this comparison is published by axle.
            Where alternatives are genuinely better for a specific scenario,
            we&apos;ve said so above. Factual corrections / disagreements:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
          <p className="mt-3">Updated: 1 May 2026.</p>
        </footer>
      </article>
    </main>
  );
}

function Pick({
  tool,
  scenario,
  note,
}: {
  tool: string;
  scenario: string;
  note: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Pick {tool} when
      </p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{scenario}</h3>
      <p className="mt-2 text-sm text-slate-700">{note}</p>
    </div>
  );
}

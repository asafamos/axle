import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle vs UserWay — real fixes, not an overlay widget",
  description:
    "UserWay widget injects JavaScript over broken HTML and doesn't fix source-level accessibility. axle scans every PR, suggests source-code fixes via Claude, and produces lawyer-ready compliance artifacts.",
  keywords: [
    "UserWay alternative",
    "accessibility widget alternative",
    "UserWay WCAG compliance",
    "real WCAG fixes",
    "EAA 2025 alternative",
    "axle",
  ],
  alternates: { canonical: "/alternatives/userway" },
  openGraph: {
    title: "axle vs UserWay — the source-code alternative",
    description:
      "Real code fixes in every PR. Lawyer-ready artifacts. No overlay widget.",
    type: "article",
  },
};

export default function UserWayAlternativePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Comparison
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            axle is the source-code alternative to UserWay.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            UserWay sells an accessibility overlay: a JavaScript widget that tries to
            retrofit accessibility over broken HTML at runtime. The same category of
            product cost accessiBe a <strong>$1 million FTC settlement</strong> in
            January 2025 for deceptive compliance claims. Plaintiff&apos;s lawyers now
            cite overlay presence as <em>evidence of bad faith</em>, not as mitigation.
          </p>
          <p className="mt-4 max-w-2xl text-slate-700">
            axle takes the opposite approach: scan in CI, propose source-code fix diffs
            via Claude, generate the legal artifacts your compliance officer needs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start free
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Install the GitHub Action
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900">Side-by-side</h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">UserWay widget</th>
                  <th className="px-4 py-3 bg-emerald-50 font-semibold text-emerald-900">
                    axle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium">What it does</td>
                  <td className="px-4 py-3 text-slate-700">
                    Injects JS at runtime, attempts to add ARIA / adjust contrast / alter
                    keyboard behaviour on top of existing HTML
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Scans in CI, proposes source-code diffs, posts them on your PR, blocks
                    merge on regressions
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Runtime JS on your page</td>
                  <td className="px-4 py-3 text-red-700">Yes — one extra third-party script</td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">No — zero runtime footprint</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Source-level fix suggestions</td>
                  <td className="px-4 py-3 text-red-700">No</td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Yes — Claude-generated diffs, reviewed before merge
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Legal defence value</td>
                  <td className="px-4 py-3 text-red-700">
                    Cited as bad-faith evidence in ADA lawsuits; FTC case law stands
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Audit trail of scan reports + published verified statement URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Screen-reader experience</td>
                  <td className="px-4 py-3 text-red-700">
                    Can actively harm NVDA / JAWS users (Princeton 2023 study)
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    No runtime interference — improves only what&apos;s fixed at source
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Cost</td>
                  <td className="px-4 py-3 text-slate-700">$490/yr starting (public pricing)</td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    $0 free tier · $49/mo Team
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Works for WP / Shopify / headless</td>
                  <td className="px-4 py-3 text-slate-700">Widget script, theme-agnostic</td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    GitHub Action, npm CLI, Netlify / Cloudflare / Vercel plugins, WP plugin
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">Why overlay tooling is dead</h2>
          <p className="mt-4 text-slate-700">
            Four independent pressure points converged on widget-based accessibility in 2024-25:
          </p>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              The <strong>FTC settlement with accessiBe</strong> ($1M, January 2025) over
              deceptive &quot;AI-powered WCAG compliance&quot; claims — legal template for
              future suits against any overlay vendor.
            </li>
            <li>
              The <strong>Princeton study</strong> (Van Lee et al., 2023) documented cases
              where overlay-injected ARIA actively <em>harmed</em> screen-reader users.
            </li>
            <li>
              <strong>EAA 2025</strong> (EU-wide, enforceable 28 June 2025) references EN
              301 549 — which evaluates the served HTML, not runtime behaviour. Overlays
              don&apos;t move the compliance needle.
            </li>
            <li>
              <strong>Plaintiff&apos;s-bar collective experience</strong> — law firms that
              file ADA accessibility suits now have boilerplate that cites overlay
              presence as aggravating rather than mitigating.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Try axle free for as long as you want.
          </h2>
          <p className="mt-4 text-slate-700">
            Unlimited scans on 1 repo, GitHub Action, Hebrew statement generator, and AI
            fixes with your own Anthropic key — all free. Paid plans unlock hosted AI fixes
            and the verified statement URL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              See pricing
            </Link>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate a statement
            </Link>
            <Link
              href="/alternatives/accessibe"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              vs accessiBe →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

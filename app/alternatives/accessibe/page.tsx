import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle vs accessiBe — the overlay-free alternative",
  description:
    "Looking for an alternative to accessiBe after the $1M FTC fine? axle fixes accessibility in source code, generates lawyer-ready artifacts, and never injects overlay widgets. Free to start.",
  keywords: [
    "accessiBe alternative",
    "accessibility overlay alternative",
    "WCAG compliance without widget",
    "FTC accessiBe",
    "real accessibility fixes",
    "EAA compliance",
  ],
  alternates: { canonical: "/alternatives/accessibe" },
  openGraph: {
    title: "axle vs accessiBe — overlay-free accessibility compliance",
    description:
      "Real code fixes. Lawyer-ready artifacts. Built for the EAA 2025 + ADA era. No overlay widget.",
    type: "article",
  },
};

export default function AccessibeAlternativePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Comparison
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            axle is the overlay-free alternative to accessiBe.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            In January 2025 the FTC fined accessiBe <strong>$1 million</strong> for deceptive
            claims about its AI-powered overlay widget. Overlay tooling is now legally
            radioactive — regulators, plaintiff&apos;s lawyers, and screen-reader users treat it
            as a red flag rather than a fix.
          </p>
          <p className="mt-3 max-w-2xl text-slate-700">
            axle takes the opposite approach: every accessibility violation gets proposed as a
            real source-code diff, reviewed by a human, and merged through your normal PR flow.
            No runtime JavaScript injected into your visitors&apos; browsers. No compliance
            theatre.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start free
            </Link>
            <a
              href="https://github.com/asafamos/axle-action"
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
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Dimension
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    accessiBe
                  </th>
                  <th className="px-5 py-3 font-semibold text-emerald-700">
                    axle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <Row
                  dim="Fix mechanism"
                  theirs="Runtime JavaScript overlay injected on every page load"
                  ours="Source-code PR diffs, merged through your normal review process"
                  theirsWarn
                />
                <Row
                  dim="Legal posture"
                  theirs="$1M FTC fine in Jan 2025 for misleading AI claims"
                  ours="Explicit 'remediation assistance' language, no certification claim"
                  theirsWarn
                />
                <Row
                  dim="Screen-reader user impact"
                  theirs="Often makes the site harder to use; published complaints from NFB, ADA plaintiffs"
                  ours="Zero runtime impact on your users — the fixes live in your code"
                />
                <Row
                  dim="Audit trail for lawyers"
                  theirs="Proprietary dashboard, no exportable audit log"
                  ours="Every scan, fix approval, and statement is timestamped and exportable"
                />
                <Row
                  dim="Pricing (small site)"
                  theirs="$490 / year starting tier"
                  ours="Free — 1 repo, unlimited scans, bring your own API key for AI fixes"
                />
                <Row
                  dim="Pricing (growing team)"
                  theirs="$1,490+ / year, contract required"
                  ours="$49 / month, self-serve, cancel anytime"
                />
                <Row
                  dim="Hebrew compliance (חוק שוויון)"
                  theirs="Generic translated overlay, not aligned to תקנה 35"
                  ours="Free Hebrew accessibility-statement generator aligned to תקנה 35"
                />
                <Row
                  dim="Compliance badge"
                  theirs="Their branded widget, must stay live on your site forever"
                  ours="Optional shields-style badge, just a PNG/SVG link — zero client JS"
                />
                <Row
                  dim="How it reaches your site"
                  theirs="Paste a script tag, trust the overlay"
                  ours="GitHub Action on PR, CLI, Netlify plugin, or hosted web scan"
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">
            Who switched from accessiBe to axle?
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            If you&apos;re here, it&apos;s probably because:
          </p>
          <ul className="mt-6 space-y-3 text-slate-200">
            <li className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              Legal or compliance forwarded you the FTC settlement and asked what
              we&apos;re doing about it.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              A customer with assistive tech filed a complaint about the overlay
              breaking their flow.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              The European Accessibility Act came into force (June 2025) and your
              EU revenue now needs WCAG 2.1 AA with a real audit trail, not a
              marketing page.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              Your engineering team refuses to keep an opaque third-party script on
              every page.
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Start on axle (free)
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-700 px-5 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Scan a URL first
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-xs text-slate-500">
        axle provides remediation assistance, not a compliance certificate. Sources: FTC
        settlement <span className="font-mono">FTC v. accessiBe Ltd.</span>, Jan 2025; W3C WCAG
        2.1 / 2.2; European Accessibility Act (EU 2019/882).
      </footer>
    </main>
  );
}

function Row({
  dim,
  theirs,
  ours,
  theirsWarn,
}: {
  dim: string;
  theirs: string;
  ours: string;
  theirsWarn?: boolean;
}) {
  return (
    <tr>
      <td className="px-5 py-4 font-medium text-slate-900">{dim}</td>
      <td
        className={`px-5 py-4 text-sm ${
          theirsWarn ? "text-red-700" : "text-slate-700"
        }`}
      >
        {theirs}
      </td>
      <td className="px-5 py-4 text-sm text-emerald-900">{ours}</td>
    </tr>
  );
}

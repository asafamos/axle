import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "./form";

export const metadata: Metadata = {
  title: "Free accessibility scan — full WCAG 2.2 AA report by email",
  description:
    "Free WCAG 2.2 AA accessibility scan of your site. Enter your URL, get a full report with every violation, severity, and a remediation checklist by email within minutes. No signup, no credit card.",
  keywords: [
    "free accessibility scan",
    "free WCAG scan",
    "free a11y scan",
    "free accessibility checker",
    "WCAG 2.2 AA test",
    "accessibility audit free",
    "axle",
  ],
  openGraph: {
    title: "Free a11y / WCAG 2.2 AA scan — full report by email",
    description:
      "Enter your URL, get a full WCAG 2.2 AA accessibility report by email within minutes. No signup.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/free-scan" },
};

export default function FreeScanPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Free · no signup · no credit card
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Free WCAG 2.2 AA accessibility scan
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Enter your URL. We&apos;ll scan it against the same WCAG 2.1 / 2.2 AA
          ruleset that EAA 2025, ADA Title III, and Section 508 reference (axe-core
          4.11). You&apos;ll get a full report by email within minutes — every
          violation, severity, the offending HTML snippet, and a prioritised
          remediation checklist.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <FreeScanForm />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What&apos;s in the report</h2>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Conformance status</strong> — fully / partially / non-conformant
              against WCAG 2.2 AA, mapped to EN 301 549 (the EU harmonised standard).
            </li>
            <li>
              <strong>Per-violation breakdown</strong> — rule ID, WCAG success
              criterion, severity (critical / serious / moderate / minor), affected
              elements with CSS selectors, exact HTML snippets.
            </li>
            <li>
              <strong>Prioritised remediation checklist</strong> — fix the criticals
              first, then serious, then moderate. Estimated effort per category.
            </li>
            <li>
              <strong>Regulatory framing</strong> — which violations would surface in
              a typical ADA Title III demand letter, which would fail an EAA market-
              surveillance check.
            </li>
            <li>
              <strong>Next steps</strong> — how to wire this into CI so regressions
              get caught before merge, and how to publish the accessibility statement
              regulators ask for.
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">What this is and isn&apos;t</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Is</strong>: an automated scan with axe-core 4.11, the same
              engine plaintiff-firm scanners and Microsoft Accessibility Insights use.
            </li>
            <li>
              <strong>Isn&apos;t</strong>: a human audit. Automated tools catch ~57%
              of WCAG issues. The remaining 43% need a qualified human.
            </li>
            <li>
              <strong>Isn&apos;t</strong>: a compliance certificate. Regulators
              require ongoing diligence — an annual audit + continuous CI — not a
              point-in-time PDF.
            </li>
            <li>
              <strong>Isn&apos;t</strong>: an overlay widget. axle never ships
              JavaScript to your visitors. The scan reads the served HTML.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">After the report</h2>
          <p className="mt-3 text-slate-700">
            If you want continuous compliance without paying for an audit every
            quarter:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Install the GitHub Action</strong> on your main repo. It scans
              every PR and blocks merges on serious-severity regressions. Free tier
              covers 1 repo.
            </li>
            <li>
              <strong>Generate your accessibility statement</strong> — free generator
              produces compliant markup for EAA, ADA, or Israeli תקנה 35
              jurisdictions.
            </li>
            <li>
              <strong>Upgrade to Team ($49/mo)</strong> if you want hosted AI fixes,
              up to 10 repos, multi-language statements, and a verified statement
              URL for regulator filings.
            </li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Statement generator
            </Link>
            <Link
              href="/web-accessibility-audit"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Audit guide
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Privacy: the URL you submit is scanned once and the report is emailed to
            you. We do not share your URL or email. See{" "}
            <Link href="/privacy" className="underline">
              privacy policy
            </Link>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

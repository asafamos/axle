import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title: "WCAG checker — free WCAG 2.2 AA accessibility check",
  description:
    "Free WCAG 2.2 AA checker for any URL. Enter your site, get a complete WCAG conformance report by email. Aligned with EN 301 549 (the EU technical standard the EAA references). axe-core 4.11.",
  keywords: [
    "WCAG checker",
    "WCAG 2.2 checker",
    "WCAG 2.1 checker",
    "WCAG validator",
    "WCAG test",
    "WCAG compliance check",
    "EN 301 549 checker",
    "axle",
  ],
  openGraph: {
    title: "WCAG checker — free WCAG 2.2 AA report by email",
    description:
      "Enter your URL, get a full WCAG conformance report by email within minutes.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/wcag-checker" },
};

export default function WCAGCheckerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Free · WCAG 2.2 AA · axe-core 4.11
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          WCAG checker — free WCAG 2.2 AA report
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Free WCAG checker for any public URL. We use axe-core 4.11 — the same
          ruleset Microsoft Accessibility Insights, plaintiff-firm scanners, and
          Google Lighthouse use. Coverage maps directly to WCAG 2.1 / 2.2 Level AA
          and EN 301 549 (the harmonised standard the EU EAA references).
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <FreeScanForm />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            What &ldquo;WCAG 2.2 AA&rdquo; actually means
          </h2>
          <p className="mt-3 text-slate-700">
            The Web Content Accessibility Guidelines 2.2 (W3C, October 2023) are
            organized into four principles — Perceivable, Operable, Understandable,
            Robust — each with success criteria at three conformance levels (A, AA,
            AAA). <strong>AA</strong> is the practical legal target across EAA,
            ADA, and Section 508. WCAG 2.2 added 9 success criteria over 2.1,
            mostly mobile / cognitive-load improvements (target size, dragging
            alternatives, focus-not-obscured).
          </p>
          <p className="mt-3 text-slate-700">
            Automated checkers like this one cover roughly 57% of WCAG criteria
            objectively — contrast, missing alt text, label-input mismatch, ARIA
            misuse. The remaining 43% — meaningful alt text, sensible heading
            order, cognitive-load issues — require human judgement.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Why a one-time check isn&apos;t enough
          </h2>
          <p className="mt-3 text-slate-700">
            Most teams run a WCAG check, fix the violations, and ship. Within a
            quarter the regressions accumulate: a designer changes a button colour,
            a form gets a new field without a label, a marketing page gets a hero
            image without alt text. By the next compliance touchpoint — audit,
            demand letter, EAA market surveillance — the violations are back.
          </p>
          <p className="mt-3 text-slate-700">
            The sustainable model is <strong>continuous</strong>: a CI pipeline
            that runs WCAG checks on every PR and blocks merges on serious-severity
            regressions. axle ships exactly that — same checker, just running on
            every commit instead of once a quarter. Free for one repository.
          </p>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Other free WCAG tools</h2>
          <p className="mt-3 text-sm text-slate-700">
            For completeness — other widely-used free WCAG checkers:
          </p>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-sm text-slate-700">
            <li>WAVE (WebAIM) — browser extension, single-page focus.</li>
            <li>Microsoft Accessibility Insights — Chromium devtools-style flow.</li>
            <li>Lighthouse (Google Chrome) — built into Chrome devtools.</li>
            <li>Pa11y — open-source CLI, similar to axle-cli.</li>
            <li>Tenon — has a free tier.</li>
          </ul>
          <p className="mt-3 text-sm text-slate-700">
            All of these (including axle) use a similar core ruleset; the
            differentiator is delivery surface. axle is built for CI integration
            with PR comments + AI-generated source-code fixes.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">After your report</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Set up continuous WCAG CI →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate accessibility statement
            </Link>
            <Link
              href="/checklist/wcag-2-2-aa"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              WCAG 2.2 AA checklist
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 26 April 2026.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}

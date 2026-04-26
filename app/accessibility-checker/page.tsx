import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title: "Accessibility checker — free a11y / WCAG 2.2 AA scan",
  description:
    "Free accessibility checker for any URL. Test your site against WCAG 2.2 AA, get the full report by email. Built on axe-core 4.11. Aligned with EAA 2025, ADA Title III, Section 508, EN 301 549.",
  keywords: [
    "accessibility checker",
    "a11y checker",
    "website accessibility checker",
    "free accessibility checker",
    "WCAG accessibility checker",
    "online accessibility checker",
    "ADA accessibility checker",
    "axle",
  ],
  openGraph: {
    title: "Accessibility checker — free a11y / WCAG 2.2 AA scan",
    description:
      "Free WCAG 2.2 AA accessibility check. Enter URL, get full report by email.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/accessibility-checker" },
};

export default function AccessibilityCheckerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Free · accessibility checker · WCAG 2.2 AA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Free accessibility checker
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Test any URL against WCAG 2.2 Level AA — the conformance level that EAA
          2025, ADA Title III, and Section 508 reference. We use axe-core 4.11,
          the same engine plaintiff-firm scanners use to flag accessibility
          lawsuits. The full report — every violation, severity, the offending
          HTML, and a remediation checklist — lands in your inbox in 2-5 minutes.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <FreeScanForm />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Who uses an accessibility checker
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Engineering teams</strong> auditing the product before
              launch, a major redesign, or a procurement-driven VPAT requirement.
            </li>
            <li>
              <strong>Founders preparing for EAA 2025</strong> — most non-EU
              operators discovered they were in scope only after the directive
              came into force.
            </li>
            <li>
              <strong>US businesses post-demand-letter</strong> — see{" "}
              <Link href="/ada-demand-letter" className="underline">
                the first-48-hours playbook
              </Link>{" "}
              if you just received one.
            </li>
            <li>
              <strong>Procurement teams</strong> evaluating accessibility before
              committing to a SaaS contract that requires VPAT.
            </li>
            <li>
              <strong>Agencies</strong> doing client work that needs a defensible
              accessibility status before launch.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What gets checked</h2>
          <p className="mt-3 text-slate-700">
            All ~80 WCAG 2.2 AA criteria axe-core can evaluate objectively:
          </p>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-sm text-slate-700">
            <li>Colour contrast (body text 4.5:1, large text 3:1, UI components 3:1)</li>
            <li>Form labels — every input has an accessible name</li>
            <li>Image alt text presence (machine can&apos;t judge meaning, only presence)</li>
            <li>Heading hierarchy (no skipped levels)</li>
            <li>Landmark structure (one main, header / footer / nav appropriately)</li>
            <li>ARIA roles consistent with native semantics</li>
            <li>Keyboard navigability — every interactive element is reachable</li>
            <li>Focus indicators — visible focus on all focusable elements</li>
            <li>HTML language declared, page title meaningful</li>
            <li>Skip links, target sizes, motion preferences, and ~70 more</li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">What automated checks won&apos;t catch</h3>
          <p className="mt-2 text-sm text-amber-900">
            Roughly 43% of WCAG criteria require human judgement — whether alt text
            is meaningful, whether heading order makes semantic sense, whether the
            language is plain enough for cognitive accessibility, whether form
            errors are understandable. After a clean automated check, a human audit
            (annual or post-major-redesign) is still recommended for full
            compliance. See{" "}
            <Link href="/web-accessibility-audit" className="underline">
              the audit guide
            </Link>{" "}
            for what to expect.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Continuous checking, not point-in-time
          </h2>
          <p className="mt-3 text-slate-700">
            A passing checker today doesn&apos;t mean a passing checker next
            quarter. The sustainable model is a CI pipeline that runs the same
            checks on every PR and blocks merges on serious-severity regressions.
            axle&apos;s GitHub Action does that, free for one repository.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Set up continuous a11y CI →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate accessibility statement
            </Link>
            <Link
              href="/web-accessibility-audit"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Audit cost guide
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

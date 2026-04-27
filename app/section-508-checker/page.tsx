import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title: "Section 508 checker — free Revised 508 + WCAG 2.0 AA scan",
  description:
    "Free Section 508 conformance checker. Scan your site against the Revised Section 508 standards (which reference WCAG 2.0 AA) and get the full report by email. Required for US federal procurement and federal contractors. axe-core 4.11.",
  keywords: [
    "Section 508 checker",
    "Section 508 compliance",
    "Section 508 audit",
    "Revised Section 508",
    "504 compliance",
    "federal accessibility",
    "VPAT",
    "ACR",
    "axle",
  ],
  openGraph: {
    title: "Section 508 checker — free Revised 508 + WCAG 2.0 AA scan",
    description:
      "Free Section 508 conformance check. Full report by email. axe-core 4.11.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/section-508-checker" },
};

export default function Section508CheckerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Free · Section 508 · Revised 508 · WCAG 2.0 AA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Free Section 508 checker
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Free conformance check against the <strong>Revised Section 508
          Standards</strong> (29 U.S.C. § 794d, 36 CFR Part 1194). The
          regulation references <strong>WCAG 2.0 Level AA</strong> for web
          content plus a small number of platform-specific criteria. Required
          for US federal agencies and the contractors that sell to them, and
          increasingly used as a procurement gate by state and local
          government and federally-funded universities.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <FreeScanForm />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Who needs Section 508 conformance
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Federal agencies</strong> directly, for any electronic /
              information technology they develop, procure, maintain, or use.
            </li>
            <li>
              <strong>Federal contractors and SaaS vendors</strong> selling to
              federal agencies — Section 508 conformance shows up in nearly
              every federal RFP under the &ldquo;ICT&rdquo; clause.
            </li>
            <li>
              <strong>State + local government</strong> that adopted Section 508
              by reference (most have) or have parallel state laws (CA, NY, MA).
            </li>
            <li>
              <strong>Higher education</strong> receiving federal funding
              (Title VI / Title IX adjacent obligations).
            </li>
            <li>
              <strong>Healthcare</strong> covered entities under Section 504,
              which references many of the same standards.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Section 508 vs WCAG vs ADA
          </h2>
          <p className="mt-3 text-slate-700">
            Common confusion among engineering teams. The short version:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>WCAG 2.0 / 2.1 / 2.2</strong> — international technical
              standard from W3C. Defines success criteria.
            </li>
            <li>
              <strong>Section 508 (Revised, 2018)</strong> — US federal
              regulation. Adopts WCAG 2.0 Level A + AA by reference for web
              content, plus adds a few platform / hardware criteria. Section 508
              is what federal procurement enforces.
            </li>
            <li>
              <strong>ADA Title III</strong> — broader US civil-rights statute
              for &ldquo;places of public accommodation&rdquo;. The DOJ&apos;s
              2024 final rule (24 USC 12182) referenced WCAG 2.1 AA for state /
              local government public-facing websites. ADA is what private-
              sector lawsuits invoke.
            </li>
            <li>
              <strong>EN 301 549</strong> — the EU equivalent of Section 508,
              also WCAG-derived but with EU-specific clauses. The EAA references
              EN 301 549.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            For a SaaS vendor: if you pass <strong>WCAG 2.2 AA</strong>{" "}
            cleanly, you cover Section 508 (which only requires 2.0 AA),
            you cover the ADA practical compliance bar, and you cover EN 301 549
            for EU sales. Build to the highest standard once.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Procurement: VPAT and ACR
          </h2>
          <p className="mt-3 text-slate-700">
            Federal procurement asks for an <strong>Accessibility Conformance
            Report (ACR)</strong>, almost always produced from the{" "}
            <strong>Voluntary Product Accessibility Template (VPAT)</strong>.
            The completed VPAT IS the ACR. Procurement teams verify your VPAT
            claims with their own automated scans — a VPAT that claims
            &ldquo;Supports&rdquo; on criteria your product fails will be
            caught and the bid will be rejected.
          </p>
          <p className="mt-3 text-slate-700">
            Strong VPATs attach: dated automated scan output (axe-core JSON),
            a recent human audit, and a CI-pipeline link showing ongoing
            scans. For the technical evidence side, this checker plus
            continuous CI gives you everything procurement asks for. See the{" "}
            <Link href="/vpat-template" className="underline">
              VPAT template guide
            </Link>{" "}
            for the full breakdown.
          </p>
        </section>

        <section className="mt-10 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            What this checker covers — and doesn&apos;t
          </h3>
          <p className="mt-2 text-sm text-amber-900">
            <strong>Covers:</strong> Section 508 §1194.21 (software) and
            §1194.22 (web) success criteria that map to WCAG 2.0 AA — color
            contrast, alt text presence, keyboard navigability, ARIA
            consistency, form labels, etc.
          </p>
          <p className="mt-2 text-sm text-amber-900">
            <strong>Doesn&apos;t cover (need a human auditor):</strong> meaningful
            alt text quality, heading order semantics, screen-reader UX
            quality, captions for video, audio descriptions, the
            &ldquo;Functional Performance Criteria&rdquo; outcome-based section
            (&ldquo;use without vision&rdquo;, &ldquo;use without hearing&rdquo;,
            etc.).
          </p>
          <p className="mt-2 text-sm text-amber-900">
            About 57% of Section 508 / WCAG criteria are objectively
            machine-detectable. The remaining 43% require human judgement.
            Most federal procurement reviewers know this and expect both an
            automated baseline + a human audit dated within the last 12 months.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Continuous Section 508 in CI
          </h2>
          <p className="mt-3 text-slate-700">
            For federal contractors, Section 508 conformance isn&apos;t a
            point-in-time event — every release that ships during the contract
            period needs to remain conformant. The contract&apos;s ICT clause
            usually says so explicitly. Without a CI gate, regressions
            accumulate between audits and the next renewal cycle finds you
            non-conforming.
          </p>
          <p className="mt-3 text-slate-700">
            axle&apos;s GitHub Action runs the same automated checks on every
            PR and blocks merges on serious-severity regressions. Free for one
            repository. The CI scan history is the most defensible
            ongoing-conformance record in a federal renewal review.
          </p>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Install continuous CI →
          </a>
          <Link
            href="/vpat-template"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            VPAT template guide
          </Link>
          <Link
            href="/web-accessibility-audit"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Audit cost guide
          </Link>
          <Link
            href="/statement"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Accessibility statement generator
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams, not
            federal contracts counsel. Section 508 enforcement varies by
            agency contracting office. Consult your federal contracts
            counsel for binding guidance.
          </p>
          <p className="mt-3">
            Updated: 27 April 2026.{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
          </p>
        </footer>
      </article>
    </main>
  );
}

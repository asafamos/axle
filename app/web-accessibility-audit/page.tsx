import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Web accessibility audit — scope, cost, template, deliverables (2026)",
  description:
    "Practical guide to commissioning or running a web accessibility audit: what's in scope, what a good auditor delivers, typical cost ranges, how to use automated pre-scans to reduce audit hours, and the WCAG 2.1 / 2.2 AA audit template.",
  keywords: [
    "web accessibility audit",
    "WCAG audit",
    "accessibility audit cost",
    "accessibility audit template",
    "a11y audit",
    "accessibility audit scope",
    "axle",
  ],
  openGraph: {
    title: "Web accessibility audit — the practical guide",
    description:
      "Scope, cost, deliverables, and how automated pre-scans reduce billable audit hours.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/web-accessibility-audit" },
};

export default function WebAccessibilityAuditPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Web accessibility audit — the practical guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          A web accessibility audit is the formal process of evaluating a website
          against WCAG 2.1 AA (and increasingly 2.2 AA) and documenting the findings
          in a form that regulators, legal teams, and engineering teams can act on.
          This guide covers what&apos;s in scope, what a credible audit looks like,
          what it typically costs, how to use axe-core pre-scans to reduce billable
          hours by 40-60%, and when to commission one.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#when">When to commission an audit</a></li>
            <li><a className="hover:underline" href="#scope">Scope — what&apos;s actually in</a></li>
            <li><a className="hover:underline" href="#deliverables">Deliverables — what you should get</a></li>
            <li><a className="hover:underline" href="#cost">Cost — realistic ranges</a></li>
            <li><a className="hover:underline" href="#pre-scan">Pre-scan: cut billable hours with automation</a></li>
            <li><a className="hover:underline" href="#template">Audit template — what to ask for</a></li>
            <li><a className="hover:underline" href="#auditors">Choosing an auditor</a></li>
            <li><a className="hover:underline" href="#after">After the audit — remediation and CI</a></li>
          </ol>
        </nav>

        <section id="when" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">When to commission an audit</h2>
          <p className="mt-3 text-slate-700">
            Commission an audit when you need one of:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Regulatory disclosure</strong> — EAA 2025 requires a
              conformance statement with assessment methodology. A human audit is
              the credible version of &ldquo;third-party evaluation&rdquo;.
            </li>
            <li>
              <strong>Demand-letter response</strong> — if you received an ADA
              Title III demand letter, a human audit is usually part of the
              settlement deliverable. See{" "}
              <Link href="/ada-demand-letter" className="underline">
                the first-48-hours playbook
              </Link>
              .
            </li>
            <li>
              <strong>Procurement requirement</strong> — many enterprise buyers,
              especially in government (Section 508), healthcare, and education,
              require a VPAT (Voluntary Product Accessibility Template) with a
              dated third-party audit.
            </li>
            <li>
              <strong>Major redesign or rebrand</strong> — post-launch audits
              catch issues before regulators or plaintiffs do.
            </li>
            <li>
              <strong>Annual re-certification</strong> — continuous
              compliance programs typically fund one audit per year on top of
              continuous CI.
            </li>
          </ul>
        </section>

        <section id="scope" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Scope — what&apos;s actually in
          </h2>
          <p className="mt-3 text-slate-700">
            A well-scoped audit covers:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Representative page sample</strong>: 15-25 URLs covering
              homepage, key landing pages, product / service pages, checkout /
              conversion flows, account / profile, search, forms, and error states.
              A full-site crawl is rarely necessary; sampling covers ~85% of issues.
            </li>
            <li>
              <strong>Multi-viewport evaluation</strong>: desktop (1280px+),
              tablet (768px), mobile (375px). WCAG 1.4.10 (Reflow) and the 2.2
              target-size criterion require mobile evaluation.
            </li>
            <li>
              <strong>Assistive-tech testing</strong>: NVDA on Windows, VoiceOver
              on macOS / iOS, TalkBack on Android, Jaws where the audience includes
              Jaws users (large in US enterprise). Keyboard-only navigation test.
            </li>
            <li>
              <strong>Automated scan coverage</strong>: axe-core 4.x, optionally
              Lighthouse or Pa11y as a cross-check. Automated catches ~57% of
              issues; human review covers the rest.
            </li>
            <li>
              <strong>Colour / contrast analysis</strong>: body text, large text,
              UI components, focus indicators, overlaid text on imagery.
            </li>
            <li>
              <strong>Document accessibility</strong> (if PDFs or Office files
              are consumer-facing): tagged-PDF review, alt text, heading order,
              reading order.
            </li>
          </ul>
        </section>

        <section id="deliverables" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Deliverables — what you should get
          </h2>
          <p className="mt-3 text-slate-700">
            A credible audit produces:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Executive summary</strong> — conformance status (full /
              partial / non-conformant), high-level risk profile, business-impact
              framing.
            </li>
            <li>
              <strong>Per-URL findings</strong> — every violation tied to a
              specific WCAG success criterion, severity (critical / serious /
              moderate / minor), affected assistive tech, and reproduction steps.
            </li>
            <li>
              <strong>Prioritised remediation plan</strong> — realistic dates,
              effort estimates per finding (hours / story points), recommended
              sequencing.
            </li>
            <li>
              <strong>VPAT (where required)</strong> — formal conformance
              declaration in the ITI VPAT 2.x template, ready for procurement
              documentation.
            </li>
            <li>
              <strong>Screenshots / recordings</strong> of key issues —
              especially useful for internal stakeholders who aren&apos;t WCAG
              fluent.
            </li>
            <li>
              <strong>Re-audit scope</strong> — what will be rechecked after
              remediation and the expected timeline.
            </li>
          </ol>
          <p className="mt-3 text-slate-700">
            If the deliverable is a one-page PDF &ldquo;certificate&rdquo; or a
            listicle of generic issues with no success-criterion mapping, it&apos;s
            not a real audit. Walk away.
          </p>
        </section>

        <section id="cost" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Cost — realistic ranges
          </h2>
          <p className="mt-3 text-slate-700">
            Market ranges as of 2026, for a WCAG 2.1 AA audit:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Small site</strong> (5-10 page sample, marketing brochure): $3,000-$7,000.</li>
            <li><strong>Medium site / SaaS</strong> (15-25 page sample, auth flows, key product surfaces): $8,000-$18,000.</li>
            <li><strong>E-commerce or large SaaS</strong> (25-50 URLs, multi-role, checkout, multiple locales): $18,000-$40,000.</li>
            <li><strong>Enterprise / multi-product</strong> (multiple apps, VPATs, re-audits bundled): $40,000-$120,000+.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Regional variation is significant. US auditors skew higher; EU
            auditors (especially Nordic / Iberian) are often 30-50% less for
            comparable rigour. Overlay-vendor &ldquo;audits&rdquo; bundled with
            their widget are not independent and should not substitute.
          </p>
        </section>

        <section id="pre-scan" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Pre-scan: cut billable hours with automation
          </h2>
          <p className="mt-3 text-slate-700">
            Auditors charge by the hour. Every machine-detectable violation a human
            has to find, log, and write up is an hour you&apos;re paying a senior
            accessibility specialist to do clerical work. The most effective
            preparation:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              Run axle against every page in the audit sample. Output the JSON
              report.
            </li>
            <li>
              Hand the auditor the JSON plus the commit SHA that produced it. They
              now skip the ~57% of issues that are already documented and focus on
              the ~43% that require human judgement.
            </li>
            <li>
              Fix the critical and serious findings from the pre-scan before the
              audit starts. Your audit cost drops by 40-60% and the deliverable is
              actionable for the remaining issues.
            </li>
          </ol>
          <p className="mt-3 text-slate-700">
            Good auditors prefer this — it lets them focus on where their expertise
            actually adds value (semantic correctness, heading structure, cognitive
            load, screen-reader experience quality). Auditors who resist pre-scans
            are billing the clerical work; reconsider.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Run a pre-scan via the GitHub Action →
            </a>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              One-off scan (no signup)
            </Link>
          </div>
        </section>

        <section id="template" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Audit template — what to ask for
          </h2>
          <p className="mt-3 text-slate-700">
            A minimal audit statement-of-work should specify:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>WCAG version and level (2.1 AA, 2.2 AA, or AAA if relevant).</li>
            <li>Referenced technical standard: EN 301 549 (EU), Section 508 (US federal), or the WCAG spec directly.</li>
            <li>URL sample list (attach explicitly).</li>
            <li>Viewports to test.</li>
            <li>Assistive technologies to test (list specific screen readers + versions).</li>
            <li>Deliverable format (PDF + CSV + VPAT if applicable).</li>
            <li>Severity taxonomy (map to critical / serious / moderate / minor or equivalent).</li>
            <li>Re-audit inclusion scope and timeline.</li>
            <li>Direct access to the auditor for engineering clarifying questions during remediation.</li>
            <li>NDAs and data-handling expectations for any sensitive pages.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            A VPAT is not the same as an audit; it&apos;s an output format. Ask
            for both if procurement requires VPAT.
          </p>
        </section>

        <section id="auditors" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Choosing an auditor</h2>
          <p className="mt-3 text-slate-700">
            Credibility markers:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>IAAP certification</strong> — CPACC (foundational) or WAS (specialist) — on the individual auditors, not just the firm.</li>
            <li><strong>Published work</strong> — conference talks, books, active public writing. Accessibility is a craft; active craftspeople do work in public.</li>
            <li><strong>Independence</strong> — not affiliated with an overlay-widget vendor. Independence is a dealbreaker; overlay-vendor &ldquo;audits&rdquo; have conflict of interest.</li>
            <li><strong>Reference engagements</strong> — specifically in your industry (fintech, healthcare, e-commerce, etc.) and regulatory context (EAA / ADA / Section 508 / תקנה 35).</li>
            <li><strong>Tooling transparency</strong> — willing to name the automation they use (axe-core, Pa11y, Lighthouse) rather than a proprietary black box.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Notable firms (not endorsements, not exhaustive): Deque, TPGi, Level
            Access (US); Funka, AnySurfer, Hassell Inclusion, Useit (EU); Fundacja
            Widzialni, Integracja (Poland); Instituto Sonae, ACAPO (Portugal).
          </p>
        </section>

        <section id="after" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            After the audit — remediation and CI
          </h2>
          <p className="mt-3 text-slate-700">
            The audit report is a point-in-time snapshot. Without a CI gate, the
            fixes regress on next quarter&apos;s feature work and you pay for
            another audit. The sustainable model:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Remediate the audit findings, prioritising critical / serious.</li>
            <li>Stand up CI accessibility scanning on every PR. Fail PRs on serious-severity regressions.</li>
            <li>Publish the accessibility statement with the audit date, methodology, and named contact.</li>
            <li>Budget for an annual re-audit — less expensive the second time because the regressions that accumulated between audit #1 and audit #2 were caught by CI.</li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
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
              href="/ada-demand-letter"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Got a demand letter? →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> cost ranges reflect 2026 market observation
            and vary by region, scope, and auditor. Not legal advice.
          </p>
          <p className="mt-3">
            Updated: 22 April 2026. Factual corrections:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

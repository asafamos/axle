import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VPAT template — what it is, when you need one, how to fill it",
  description:
    "Voluntary Product Accessibility Template (VPAT) explained for engineering teams: what each section means, what evidence to attach, how to use axe-core scan output to back up your conformance claims. Section 508 + WCAG 2.2 AA + EN 301 549.",
  keywords: [
    "VPAT",
    "VPAT template",
    "VPAT 2.4",
    "VPAT generator",
    "Voluntary Product Accessibility Template",
    "Section 508 VPAT",
    "WCAG VPAT",
    "ACR accessibility",
    "axle",
  ],
  openGraph: {
    title: "VPAT template — what it is, when you need one, how to fill it",
    description:
      "VPAT 2.4 explained for engineering teams. Section 508 + WCAG 2.2 AA + EN 301 549.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/vpat-template" },
};

export default function VPATTemplatePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Procurement · VPAT · ACR
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          VPAT template — the practical guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          A <strong>Voluntary Product Accessibility Template (VPAT)</strong> is
          the document procurement teams ask vendors for to prove their software
          meets accessibility standards. The completed VPAT is called an
          <em> Accessibility Conformance Report (ACR)</em>. Required for almost
          all US federal sales (Section 508), increasingly required by EU public
          tenders (EAA 2025), and standard procurement gating in healthcare,
          higher education, and large enterprise. This guide covers what each
          section means, what evidence to attach, and how to use axe-core scan
          output to back up your conformance claims.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">What is a VPAT</a></li>
            <li><a className="hover:underline" href="#versions">Which version do you use</a></li>
            <li><a className="hover:underline" href="#sections">Sections explained</a></li>
            <li><a className="hover:underline" href="#evidence">Evidence — what to attach</a></li>
            <li><a className="hover:underline" href="#mistakes">Common mistakes</a></li>
            <li><a className="hover:underline" href="#template">Get a template</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What is a VPAT</h2>
          <p className="mt-3 text-slate-700">
            VPAT is a document format published by the Information Technology
            Industry Council (ITI). It maps every accessibility success
            criterion of the relevant standards to your product, and you mark
            each one as <em>Supports</em>, <em>Partially Supports</em>,{" "}
            <em>Does Not Support</em>, <em>Not Applicable</em>, or{" "}
            <em>Not Evaluated</em>, with prose explaining the basis.
          </p>
          <p className="mt-3 text-slate-700">
            The completed VPAT is the <strong>Accessibility Conformance Report
            (ACR)</strong>. In procurement language, &ldquo;send us your
            VPAT&rdquo; usually means &ldquo;send us your ACR&rdquo; — the
            terminology is sloppy but the document is the same.
          </p>
        </section>

        <section id="versions" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Which version do you use</h2>
          <p className="mt-3 text-slate-700">
            Current version is <strong>VPAT 2.5</strong> (2024). It comes in five flavours
            depending on which standards your buyer references:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>VPAT 2.5 WCAG</strong> — for buyers asking only about WCAG conformance.
              Covers WCAG 2.0 + 2.1 + 2.2 success criteria.
            </li>
            <li>
              <strong>VPAT 2.5 508</strong> — for US federal buyers under the Revised
              Section 508 (2018+). Covers WCAG 2.0 AA plus the &ldquo;Other 508&rdquo; criteria.
            </li>
            <li>
              <strong>VPAT 2.5 EU</strong> — for EU buyers under EN 301 549 (2021).
              Covers WCAG 2.1 AA plus EU-specific clauses (ICT, real-time text,
              hardware).
            </li>
            <li>
              <strong>VPAT 2.5 INT</strong> — international, includes all of the above.
              Most commonly requested for global SaaS.
            </li>
            <li>
              <strong>VPAT 2.5 R</strong> — Revised Section 508 only, for federal buyers who
              don&apos;t need EU coverage.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>If you don&apos;t know which</strong>: produce the INT
            version. It covers all three standards, most procurement teams
            accept it, and you don&apos;t maintain three documents.
          </p>
        </section>

        <section id="sections" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Sections explained</h2>
          <p className="mt-3 text-slate-700">
            A VPAT 2.5 INT has these sections:
          </p>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Product information</strong> — name, version, contact,
              evaluation date, evaluation methodology. Be specific:{" "}
              &ldquo;axle web app, v2.3, evaluated 12-Mar-2026 by external IAAP-CPACC
              certified auditor + axe-core 4.11 CI scans&rdquo; beats &ldquo;web app, internal review&rdquo;.
            </li>
            <li>
              <strong>Applicable standards</strong> — tick the standards your
              buyer cares about. Usually WCAG 2.1 AA + Revised 508 + EN 301 549.
              For federal-only, stick to 508.
            </li>
            <li>
              <strong>Terms (definitions)</strong> — copy from ITI&apos;s
              template. Don&apos;t modify.
            </li>
            <li>
              <strong>WCAG criteria table</strong> — every success criterion
              with conformance level (Supports / Partially / Does Not / N/A) and
              a remarks column. <em>This is where you spend 90% of the
              effort.</em>
            </li>
            <li>
              <strong>Revised Section 508 criteria</strong> — only if covering
              508. Most overlap with WCAG; the unique ones are the platform /
              hardware criteria.
            </li>
            <li>
              <strong>EN 301 549 criteria</strong> — only if covering EU. WCAG
              2.1 AA is embedded; the EU-specific criteria are about
              two-way voice communication, real-time text, ICT generally.
            </li>
            <li>
              <strong>Functional Performance Criteria</strong> — outcome-based,
              one row per disability category (without vision, with limited
              vision, without hearing, etc.).
            </li>
          </ol>
        </section>

        <section id="evidence" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Evidence — what to attach
          </h2>
          <p className="mt-3 text-slate-700">
            Procurement teams increasingly reject VPATs that just say
            &ldquo;Supports&rdquo; with no backing. Strong VPATs attach:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Automated scan reports</strong> dated within the last 90
              days (axe-core JSON output covering the product surfaces in scope).
              This is what most criteria like 1.4.3 (Contrast), 1.1.1 (Non-text
              Content), 4.1.2 (Name, Role, Value) get backed by.
            </li>
            <li>
              <strong>Human audit report</strong> from a certified auditor
              (IAAP CPACC / WAS, DHS Section 508 trained, or equivalent) within
              the last 12 months. Required for the ~43% of WCAG criteria
              automated tools can&apos;t evaluate.
            </li>
            <li>
              <strong>Continuous CI evidence</strong> — a link to your CI pipeline
              showing accessibility scans run on every PR. This is the strongest
              defence against &ldquo;but how do you know it&apos;s still
              compliant after the audit&rdquo;. axle CI history is what we use.
            </li>
            <li>
              <strong>Published accessibility statement</strong> with named
              contact and escalation process. The statement&apos;s URL goes in
              the VPAT&apos;s &ldquo;Contact&rdquo; row.
            </li>
            <li>
              <strong>Roadmap for &ldquo;Partially Supports&rdquo; items</strong>{" "}
              — when something doesn&apos;t fully conform, name the workaround
              and the remediation date. &ldquo;Partial&rdquo; with a credible
              date beats &ldquo;Supports&rdquo; that fails verification.
            </li>
          </ul>
        </section>

        <section id="mistakes" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Common mistakes</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Marking everything &ldquo;Supports&rdquo;</strong> with no
              evidence. Procurement teams (especially federal) verify with their
              own automated scan. A scan that contradicts your VPAT kills the
              deal and your credibility.
            </li>
            <li>
              <strong>Marking everything &ldquo;Does Not Apply&rdquo;</strong>.
              Some criteria genuinely don&apos;t apply (3.3.6 if there&apos;s no
              error correction in your product), but more than 30% of
              &ldquo;N/A&rdquo; in a VPAT looks like avoidance.
            </li>
            <li>
              <strong>Outdated VPAT</strong>. If your last VPAT is over 12 months
              old, refresh it before sending. Procurement reads the date.
            </li>
            <li>
              <strong>No remarks column content</strong>. Empty remarks columns
              read as &ldquo;we didn&apos;t look&rdquo;. Even &ldquo;Verified by
              axe-core 4.11 + manual VoiceOver test&rdquo; is better than blank.
            </li>
            <li>
              <strong>Not signed</strong>. The completed VPAT should be signed
              by an officer of the company. Unsigned PDFs get rejected by US
              federal procurement automatically.
            </li>
          </ul>
        </section>

        <section id="template" className="mt-10 rounded-lg border border-emerald-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Get the official template
          </h2>
          <p className="mt-3 text-slate-700">
            ITI publishes the official VPAT 2.5 templates, free, at{" "}
            <a
              className="underline"
              href="https://www.itic.org/policy/accessibility/vpat"
              target="_blank"
              rel="noopener"
            >
              itic.org/policy/accessibility/vpat
            </a>
            . Don&apos;t use third-party &ldquo;VPAT generators&rdquo; that
            charge for access — the template is freely licensed.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>What axle helps with</strong>: the evidence side.
            Continuous axe-core CI gives you scan reports dated to the day,
            covering every surface, with every violation tied to a specific WCAG
            success criterion. Drop the JSON output into your VPAT package as
            an attachment — the format procurement reviewers prefer.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Set up VPAT-grade CI →
            </a>
            <Link
              href="/free-scan"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Run a free scan first
            </Link>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate accessibility statement
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">After the VPAT</h2>
          <p className="mt-3 text-slate-700">
            Procurement is a checkpoint, not a destination. Many SaaS vendors
            produce a VPAT, win the contract, then quietly let the product
            regress over the next 12 months. By renewal time the regressions
            are baked in and the next VPAT looks materially worse.
          </p>
          <p className="mt-3 text-slate-700">
            The continuous-CI model prevents that. Every PR is scanned, every
            regression is caught at merge time, the next VPAT is a delta of
            improvements rather than a list of new failures. That&apos;s also
            what the EAA market-surveillance authorities, the FTC, and ADA
            plaintiff firms increasingly look for as evidence of ongoing
            diligence.
          </p>
          <p className="mt-3 text-slate-700">
            See also:{" "}
            <Link href="/web-accessibility-audit" className="underline">
              accessibility audit guide
            </Link>{" "}
            (cost ranges, scope, choosing an auditor) and{" "}
            <Link href="/ada-demand-letter" className="underline">
              ADA demand-letter playbook
            </Link>{" "}
            (what to do in the first 48 hours if you receive one).
          </p>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer</strong>: written for engineering teams. Not legal
            advice. VPAT requirements vary by purchaser and jurisdiction.
            Federal procurement under Section 508 has specific format and signing
            requirements; consult your federal contracts counsel.
          </p>
          <p className="mt-3">
            Updated: 26 April 2026. Factual corrections:{" "}
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

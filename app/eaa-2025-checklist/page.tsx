import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title: "EAA 2025 checklist — practical compliance steps for engineering teams",
  description:
    "EAA 2025 compliance checklist: scope assessment, technical conformance to EN 301 549 / WCAG 2.1 AA, accessibility statement, complaint procedure, audit-trail evidence. Per-country transposition pointers (DE, FR, IT, ES, IE, NL, BE, AT, SE, PT, PL, DK).",
  keywords: [
    "EAA 2025 checklist",
    "EAA compliance",
    "European Accessibility Act",
    "EN 301 549 checklist",
    "EU accessibility compliance",
    "WCAG 2.1 EAA",
    "axle",
  ],
  openGraph: {
    title: "EAA 2025 checklist — practical compliance for engineering teams",
    description:
      "Engineering-focused checklist for EAA 2025: scope, technical conformance, statement, evidence, audits.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/eaa-2025-checklist" },
};

const items: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "scope",
    title: "1. Confirm you're in scope",
    body: (
      <>
        <p>
          The EAA applies to consumer-facing products and services placed on the
          EU market on or after <strong>28 June 2025</strong>. In-scope services
          include e-commerce, banking, e-books, electronic communications,
          passenger-transport ticketing, and consumer hardware operating systems.
        </p>
        <p className="mt-2">
          <strong>Microenterprise exemption</strong> per Article 4(5): fewer than
          10 employees <em>and</em> annual turnover / balance sheet under €2M,
          providing services. Product manufacturers are not exempt regardless of
          size. If you&apos;re a non-EU operator selling to EU consumers, you are
          in scope.
        </p>
      </>
    ),
  },
  {
    id: "standard",
    title: "2. Lock in the technical standard: EN 301 549 / WCAG 2.1 AA",
    body: (
      <>
        <p>
          The EAA itself is principles-based; the harmonised standard{" "}
          <strong>EN 301 549 v3.2.1</strong> is the technical specification you
          implement against. For web content, it embeds <strong>WCAG 2.1 Level
          AA</strong> directly. Conformance is per-page, per-app-screen, per-PDF.
        </p>
        <p className="mt-2">
          Plan for WCAG 2.2 AA migration — the next harmonised standard update
          is expected to reference 2.2. Building to 2.2 today futures-proofs the
          investment.
        </p>
      </>
    ),
  },
  {
    id: "audit",
    title: "3. Run a baseline audit",
    body: (
      <>
        <p>
          Two parts to a credible baseline:
        </p>
        <ul className="mt-2 list-disc space-y-1 ps-6">
          <li>
            <strong>Automated scan</strong> with axe-core 4.11 against your
            homepage, primary conversion path, account pages, and at least one
            example of each template. Catches ~57% of WCAG issues. Free here:{" "}
            <Link href="/free-scan" className="underline">
              /free-scan
            </Link>
            .
          </li>
          <li>
            <strong>Human audit</strong> by an IAAP-certified auditor (CPACC or
            WAS) for the remaining ~43% — semantic alt text, heading order,
            cognitive load, screen-reader experience quality. Cost ranges in the{" "}
            <Link href="/web-accessibility-audit" className="underline">
              audit guide
            </Link>
            .
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "remediate",
    title: "4. Remediate critical and serious findings",
    body: (
      <p>
        Prioritise in severity order: critical (blocks an entire flow for an
        AT user) first, serious (degrades the experience materially) next,
        moderate / minor as backlog. The single most-missed serious-severity
        item across audits is custom UI controls (variant selectors, custom
        dropdowns, modals) without correct ARIA roles or keyboard handling.
      </p>
    ),
  },
  {
    id: "statement",
    title: "5. Publish an accessibility statement",
    body: (
      <>
        <p>Required elements per the EU Implementing Decision 2018/1523 template:</p>
        <ul className="mt-2 list-disc space-y-1 ps-6">
          <li>Conformance status — <em>fully / partially / non-conformant</em> with EN 301 549.</li>
          <li>List of non-accessible content with reason (disproportionate burden, exemption, in-progress remediation).</li>
          <li>Named accessibility contact (email; phone recommended).</li>
          <li>Escalation procedure pointing to the relevant national authority — varies by country.</li>
          <li>Assessment methodology (self-assessment, third-party audit, or combination) with date.</li>
          <li>Preparation and last-review dates.</li>
        </ul>
        <p className="mt-2">
          Free template generator:{" "}
          <Link href="/statement" className="underline">
            /statement
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "complaint",
    title: "6. Set up a complaint and feedback channel",
    body: (
      <p>
        Article 23 of the EAA requires that consumers can lodge complaints. The
        accessibility statement&apos;s named contact + escalation path covers
        this in most jurisdictions. Ensure the contact mailbox is monitored —
        unanswered complaints escalate to the national authority.
      </p>
    ),
  },
  {
    id: "ci",
    title: "7. Stand up CI to prevent regressions",
    body: (
      <p>
        Without a CI gate, the gains from steps 3–4 reverse within a quarter.
        Install <a className="underline" href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci" target="_blank" rel="noopener">axle&apos;s GitHub Action</a>{" "}
        on your main repo (free for one repo) — it scans every PR and fails
        merges on serious-severity regressions. The CI history is also the
        most defensible &ldquo;ongoing diligence&rdquo; record in any market-
        surveillance enquiry.
      </p>
    ),
  },
  {
    id: "evidence",
    title: "8. Retain audit-trail evidence",
    body: (
      <p>
        Keep at minimum: the human audit report, the per-PR CI scan history,
        the dated accessibility statement(s), records of accessibility
        complaints and how you responded. Five-year retention is the EU norm
        for compliance evidence.
      </p>
    ),
  },
  {
    id: "country",
    title: "9. Check the country-specific transposition",
    body: (
      <>
        <p>
          Each EU member state transposed the EAA into national law with its
          own enforcement authority, fining structure, and (sometimes) language
          requirements:
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-1 ps-6 text-sm">
          <li><Link href="/guides/eaa-germany" className="underline">Germany — BFSG</Link></li>
          <li><Link href="/guides/eaa-france" className="underline">France — RGAA</Link></li>
          <li><Link href="/guides/eaa-italy" className="underline">Italy — Legge Stanca</Link></li>
          <li><Link href="/guides/eaa-spain" className="underline">Spain — Ley 11/2023</Link></li>
          <li><Link href="/guides/eaa-ireland" className="underline">Ireland — S.I. 636/2023</Link></li>
          <li><Link href="/guides/eaa-netherlands" className="underline">Netherlands</Link></li>
          <li><Link href="/guides/eaa-belgium" className="underline">Belgium</Link></li>
          <li><Link href="/guides/eaa-austria" className="underline">Austria — BaFG</Link></li>
          <li><Link href="/guides/eaa-sweden" className="underline">Sweden</Link></li>
          <li><Link href="/guides/eaa-portugal" className="underline">Portugal</Link></li>
          <li><Link href="/guides/eaa-poland" className="underline">Poland</Link></li>
          <li><Link href="/guides/eaa-denmark" className="underline">Denmark</Link></li>
        </ul>
        <p className="mt-2">
          Full overview:{" "}
          <Link href="/guides/eaa-2025" className="underline">
            EAA 2025 — the directive, the obligations, the timeline
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "annual",
    title: "10. Schedule the annual audit refresh",
    body: (
      <p>
        EAA conformance is a continuous obligation, not a one-time stamp.
        Budget for one human audit per year (or after any major redesign), and
        update the accessibility statement&apos;s methodology + date annually
        even if findings are minor. The CI evidence sits between audits.
      </p>
    ),
  },
];

export default function EAA2025ChecklistPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          EAA 2025 · 10-step checklist
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA 2025 compliance checklist
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          A practical 10-step checklist for engineering and product teams
          shipping consumer-facing products or services into the EU under the
          European Accessibility Act (Directive 2019/882). Not legal advice —
          written for the team that has to actually build and ship.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Quick start</h2>
          <p className="mt-2 text-sm text-slate-700">
            If you only have 5 minutes today, scan your homepage now. The free
            scan covers steps 3 (baseline) at no cost. The full report by email
            includes the WCAG-tagged violations you&apos;ll need for steps 4-7.
          </p>
          <div className="mt-4">
            <FreeScanForm />
          </div>
        </div>

        <ol className="mt-10 space-y-6">
          {items.map((it) => (
            <li
              key={it.id}
              id={it.id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <h2 className="text-lg font-bold text-slate-900">{it.title}</h2>
              <div className="mt-2 text-slate-700 [&_p]:leading-relaxed">{it.body}</div>
            </li>
          ))}
        </ol>

        <section className="mt-12 flex flex-wrap gap-3">
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
            Audit cost guide
          </Link>
          <Link
            href="/vpat-template"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            VPAT template guide
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 26 April 2026. Not legal advice.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}

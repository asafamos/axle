import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Ireland — EAA SI 636/2023 compliance for developers",
  description:
    "Ireland transposed the EAA via S.I. No. 636/2023. NDA is the competent authority. Fines up to €60,000 + possible director imprisonment in egregious cases. A practical engineering guide for teams shipping to the Irish market.",
  keywords: [
    "EAA Ireland",
    "S.I. 636/2023",
    "National Disability Authority accessibility",
    "Irish accessibility law",
    "WCAG 2.1 Ireland",
    "axle",
  ],
  openGraph: {
    title: "EAA in Ireland — a practical compliance guide",
    description:
      "What Irish law requires, who it applies to, penalty structure, and how to build accessibility into your CI pipeline.",
    type: "article",
    locale: "en_IE",
  },
  alternates: { canonical: "/guides/eaa-ireland" },
};

export default function IrelandPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Ireland · EAA compliance guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Ireland — S.I. 636/2023 for developers
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Ireland transposed the European Accessibility Act through{" "}
          <strong>S.I. No. 636 of 2023</strong> (European Union (Accessibility
          Requirements of Products and Services) Regulations 2023). Enforced on{" "}
          <strong>28 June 2025</strong>. The <strong>National Disability Authority
          (NDA)</strong> coordinates compliance guidance, while market surveillance is
          split between the Competition and Consumer Protection Commission (CCPC) for
          consumer products and sector regulators for services. Penalties include fines
          up to <strong>€60,000 per offence</strong>, and — unusually in EU
          transpositions — potential imprisonment of company directors for serious
          repeat breaches.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Legal framework</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties and director liability</a></li>
            <li><a className="hover:underline" href="#statement">Accessibility statement requirements</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Legal framework</h2>
          <p className="mt-3 text-slate-700">
            The Irish legal stack consists of:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>S.I. 358/2020</strong> — earlier transposition of Directive (EU) 2016/2102 for public-sector bodies.</li>
            <li><strong>S.I. 636/2023</strong> — transposition of the EAA (Directive 2019/882) to private-sector operators.</li>
            <li><strong>EN 301 549</strong> — referenced harmonised standard; incorporates WCAG 2.1 Level AA for web content.</li>
            <li><strong>Disability Act 2005</strong> — pre-existing framework that created the NDA and established broader accessibility duties for public services.</li>
          </ul>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Ireland:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, marketplaces, booking services.</li>
            <li>Consumer-facing banking and financial services.</li>
            <li>E-books, e-readers, and related software.</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, emergency calls).</li>
            <li>Passenger transport ticketing and real-time information.</li>
            <li>Consumer hardware and operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) of the EAA: fewer
            than 10 employees <em>and</em> annual turnover / balance sheet under €2M
            providing services. Product manufacturers are not exempt regardless of size.
          </p>
          <p className="mt-3 text-slate-700">
            Any operator — Irish or non-Irish — offering covered services to Irish
            consumers falls within the scope. Given Ireland hosts many multinational
            tech headquarters, the effective reach is broader than the population would
            suggest.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            S.I. 636/2023 references EN 301 549 v3.2.1, which incorporates WCAG 2.1 AA.
            The key conformance targets for web content:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast.</li>
            <li>Operable — keyboard-only operation, no flashing above 3 Hz, focus-visible.</li>
            <li>Understandable — <code>&lt;html lang=&quot;en-IE&quot;&gt;</code> (or the relevant language), predictable navigation, explicit form labels and error messages.</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties and director liability
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Summary conviction: fine up to <strong>€5,000</strong> and/or up to 12 months imprisonment.</li>
            <li>Conviction on indictment: fine up to <strong>€60,000</strong> and/or up to 18 months imprisonment.</li>
            <li>Continuing offence: additional daily fine up to €1,000 per day of non-compliance.</li>
            <li>
              <strong>Director personal liability</strong> (§35): where an offence is
              committed by a body corporate with the consent, connivance, or wilful
              neglect of a director, manager, or similar officer, that person is also
              guilty of the offence. This is rare in EU transpositions and raises the
              stakes for persistent non-compliance.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Enforcement is complaint-led in practice. Recognised consumer and disability
            organisations (DPO) have standing to initiate enforcement proceedings.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Accessibility statement requirements
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status (fully / partially / not conformant with EN 301 549).</li>
            <li>Non-accessible content with reason (disproportionate burden, exemption, or in-progress remediation).</li>
            <li>Named contact for accessibility feedback (email + phone recommended).</li>
            <li>Enforcement procedure pointing to the NDA / relevant sector regulator for escalation.</li>
            <li>Methodology of assessment (self-assessment, third-party audit) with date.</li>
            <li>Date of preparation and last review.</li>
            <li>The statement must itself be accessible; published in English (and, where relevant, Irish).</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against home + critical paths. A typical untuned site shows 30-80 violations.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549; regulators and consumer organisations will evaluate the served HTML.</li>
            <li><strong>CI pipeline</strong> — fail PRs on severity-serious regressions to keep the site clean between audits.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues; for the rest engage a certified auditor (IAAP CPACC or similar).</li>
            <li><strong>Publish the statement</strong> with NDA / regulator escalation details.</li>
            <li><strong>Retain evidence</strong> — CI scan history is the most defensible record of ongoing diligence.</li>
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
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← EU-wide EAA overview
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams. Not legal advice.
            For exposure specific to S.I. 636/2023, consult a solicitor admitted in
            Ireland. Penalty figures cited are statutory maxima.
          </p>
          <p className="mt-3">
            Updated: 21 April 2026. Factual corrections:{" "}
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

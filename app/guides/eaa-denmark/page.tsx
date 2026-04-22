import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Denmark — Lov om tilgængelighed for developers",
  description:
    "Denmark transposed the EAA via the Lov om tilgængelighedskrav. Digitaliseringsstyrelsen coordinates; Forbrugerombudsmanden enforces consumer-facing fines. A practical engineering guide for the Danish market.",
  keywords: [
    "EAA Denmark",
    "Lov om tilgængelighed",
    "Digitaliseringsstyrelsen",
    "dansk tilgængelighed",
    "WCAG Danmark",
    "tilgængelighedserklæring",
    "axle",
  ],
  openGraph: {
    title: "EAA in Denmark — Lov om tilgængelighed",
    description:
      "What Danish law requires, who it applies to, Digitaliseringsstyrelsen oversight, CI-first compliance.",
    type: "article",
    locale: "da_DK",
  },
  alternates: { canonical: "/guides/eaa-denmark" },
};

export default function DenmarkPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Danmark · EAA-vejledning
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Denmark — Lov om tilgængelighed
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Denmark transposed the European Accessibility Act through the{" "}
          <strong>Lov om tilgængelighedskrav til visse produkter og tjenester</strong>{" "}
          (the Accessibility Requirements Act), effective{" "}
          <strong>28 June 2025</strong>. The coordinating authority is{" "}
          <strong>Digitaliseringsstyrelsen (Danish Agency for Digital
          Government)</strong>, which also runs public-sector oversight under the
          2018 web-accessibility act. Consumer-service enforcement sits with{" "}
          <strong>Forbrugerombudsmanden</strong> (Consumer Ombudsman), with sector
          regulators <strong>Finanstilsynet</strong> (financial services) and{" "}
          <strong>Energistyrelsen</strong> / <strong>ENS</strong> (communications
          infrastructure) covering their domains. Administrative fines
          (<em>bøder</em>) scale with turnover; aggravated cases carry potential
          criminal sanctions under the consumer-protection framework.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Indhold
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Retsgrundlag — legal framework</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties and enforcement</a></li>
            <li><a className="hover:underline" href="#statement">Tilgængelighedserklæring</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Retsgrundlag — legal framework
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Lov om tilgængelighed af offentlige organers websteder og mobilapplikationer</strong> (2018) — transposition of Directive 2016/2102 for public-sector bodies.</li>
            <li><strong>Lov om tilgængelighedskrav</strong> (2024, effective 28 June 2025) — transposition of the EAA (Directive 2019/882) to private-sector operators.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard, embeds WCAG 2.1 Level AA.</li>
            <li><strong>Ligebehandlingsloven</strong> — general equal-treatment framework enabling private-action claims via Ligebehandlingsnævnet (the Equal Treatment Board).</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Denmark&apos;s Ligebehandlingsnævnet enables a low-friction
            complaint pathway for individuals — unlike many EU member states where
            discrimination claims require a civil suit. This makes consumer
            complaints a meaningful enforcement channel in parallel with
            Forbrugerombudsmanden action.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Denmark:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, marketplaces (Zalando DK, Coolshop), booking platforms.</li>
            <li>Consumer-facing banking and financial services (Danske Bank, Nykredit, MobilePay).</li>
            <li>E-books, e-readers, and associated software (Saxo.com, Mofibo).</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calls).</li>
            <li>DSB, Movia passenger-transport ticketing, Rejsekort terminals.</li>
            <li>Consumer hardware terminals (ATMs, check-in machines, package lockers) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA: fewer
            than 10 employees <em>and</em> annual turnover / balance sheet under
            €2M, providing services. Product manufacturers are not exempt regardless
            of size.
          </p>
          <p className="mt-3 text-slate-700">
            Non-Danish operators serving Danish consumers fall within
            Forbrugerombudsmanden reach. Nordic-region operators (Swedish, Norwegian,
            Finnish) should evaluate Denmark alongside home-country transposition.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            EN 301 549 v3.2.1 is the referenced harmonised standard. For web content,
            WCAG 2.1 Level AA is the conformance target. Key expectations:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast, 3:1 large text.</li>
            <li>Operable — full keyboard navigability, no flashing above 3 Hz, visible focus indicator.</li>
            <li>Understandable — <code>&lt;html lang=&quot;da&quot;&gt;</code>, predictable navigation, explicit form labels in Danish (CPR-nummer format DDMMYY-XXXX, postal-code format NNNN, Danish address structure).</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Danish-specific UX patterns to get right: MitID login flows (successor to
            NemID), CPR-nummer input, handling of å/æ/ø in names. Note that Danish
            and Swedish/Norwegian diverge in phonology; declare <code>lang</code>{" "}
            correctly or screen-reader pronunciation breaks.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties and enforcement
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Forbrugerombudsmanden administrative fines, scaled by company turnover and violation severity; aggravated cases can escalate to criminal referral.</li>
            <li>Ligebehandlingsnævnet discrimination decisions awarding compensation (typically DKK 2,500-25,000 per affected complainant).</li>
            <li>Public decision publication via Forbrugerombudsmanden&apos;s press office and the Nævnet&apos;s decision database — meaningful reputational cost.</li>
            <li>Finanstilsynet (financial services) applies separate sanctioning with significantly higher ceilings.</li>
            <li>Continued non-compliance after administrative order triggers ongoing daily penalties.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Danish enforcement tends toward the pragmatic — Forbrugerombudsmanden
            frequently accepts remediation plans with specific dates in lieu of
            immediate fine. A credible CI-scan record + published statement is
            usually sufficient to de-escalate.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Tilgængelighedserklæring
          </h2>
          <p className="mt-3 text-slate-700">
            Required elements of the Danish accessibility statement:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>fuldt i overensstemmelse / delvis i overensstemmelse / ikke i overensstemmelse</em> with EN 301 549.</li>
            <li>List of non-accessible content with justification (<em>uforholdsmæssig byrde</em>, exemption, pending remediation).</li>
            <li>Named accessibility contact (email required; phone recommended).</li>
            <li>Escalation procedure — Digitaliseringsstyrelsen / Forbrugerombudsmanden for Lov-om-tilgængelighedskrav matters, Ligebehandlingsnævnet for discrimination claims, sector regulator where relevant.</li>
            <li>Assessment methodology (self-assessment, third-party audit, or combination) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>Statement itself must be accessible; published in Danish.</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against the Danish-locale homepage and 10 critical flows.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549; Forbrugerombudsmanden evaluates the served HTML.</li>
            <li><strong>CI gate</strong> — fail PRs on serious-severity regressions.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues. Commission an IAAP-certified auditor. Danish auditors (Sensus, Inklude) are established references.</li>
            <li><strong>Publish the tilgængelighedserklæring</strong> with Digitaliseringsstyrelsen / Forbrugerombudsmanden escalation in Danish.</li>
            <li><strong>Retain evidence</strong> — per-PR axe-core scan history is the most defensible ongoing-diligence record.</li>
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
              href="/guides/eaa-sweden"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Tillgänglighetslagen (Sweden) →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams. Not legal
            advice. For exposure specific to Lov om tilgængelighedskrav, consult a
            Danish advokat. Penalty figures reflect statutory maxima.
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

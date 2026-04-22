import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Belgium — Loi du 28 novembre 2022 / Wet 28 november 2022",
  description:
    "Belgium transposed the EAA via the federal law of 28 November 2022. SPF Économie / FOD Economie enforces across the Dutch, French, and German-speaking regions. A practical engineering guide for teams shipping to the Belgian market.",
  keywords: [
    "EAA Belgium",
    "Loi 28 novembre 2022 accessibilité",
    "Wet toegankelijkheid België",
    "FOD Economie toegankelijkheid",
    "SPF Économie accessibilité",
    "BOSA accessibility",
    "WCAG Belgium",
    "axle",
  ],
  openGraph: {
    title: "EAA in Belgium — a practical compliance guide",
    description:
      "How Belgium transposed the EAA across three language regions, SPF/FOD enforcement, and how to build accessibility into your CI pipeline.",
    type: "article",
    locale: "fr_BE",
  },
  alternates: { canonical: "/guides/eaa-belgium" },
};

export default function BelgiumPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Belgique · Belgïe · EAA compliance guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Belgium — the 28 November 2022 law for developers
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Belgium transposed the European Accessibility Act through the federal{" "}
          <strong>Loi du 28 novembre 2022</strong> /{" "}
          <strong>Wet van 28 november 2022</strong> relating to the accessibility of
          products and services. Enforcement took effect{" "}
          <strong>28 June 2025</strong>. Market surveillance and administrative fines
          fall primarily to the <strong>SPF Économie / FOD Economie</strong>{" "}
          (Inspection économique / Economische Inspectie), with sector authorities
          covering banking (BNB/NBB, FSMA) and telecoms (BIPT/IBPT). Penalties run to{" "}
          <strong>€80,000 per violation</strong> and can escalate to criminal sanctions
          in egregious cases, given Belgium&apos;s broader Code de droit économique /
          Wetboek van economisch recht enforcement machinery.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents · Sommaire · Inhoud
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Legal framework — three regions, one federal law</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties and enforcement</a></li>
            <li><a className="hover:underline" href="#statement">Accessibility statement — three languages</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Legal framework — three regions, one federal law
          </h2>
          <p className="mt-3 text-slate-700">
            Belgian accessibility law operates across two levels:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Public sector — Loi / Wet 19 juillet / 19 juli 2018</strong>: transposed Directive 2016/2102. BOSA (<em>Service public fédéral Stratégie et Appui</em> / <em>Federale Overheidsdienst Beleid en Ondersteuning</em>) publishes the register of public-sector accessibility statements.</li>
            <li><strong>Private sector — Loi / Wet 28 novembre / 28 november 2022</strong>: transposes Directive 2019/882 (the EAA). Effective 28 June 2025.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard referenced by both laws; embeds WCAG 2.1 Level AA for web content.</li>
            <li><strong>Code de droit économique / Wetboek van economisch recht</strong> — the SPF/FOD&apos;s general fining and criminal-sanction toolkit.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            The federal level defines the substantive accessibility requirements. The
            regions (Flanders, Wallonia, Brussels-Capital, German-speaking Community)
            apply the law through their own enforcement channels for sector-specific
            public services, but the consumer-facing private-sector surface — covered
            by the EAA — is uniformly federal.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services offered to consumers in Belgium:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, online marketplaces, booking platforms.</li>
            <li>Consumer-facing banking and financial services.</li>
            <li>E-books, e-readers, and associated software.</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calls).</li>
            <li>Passenger transport ticketing, real-time info, NMBS/SNCB self-service terminals.</li>
            <li>Consumer hardware terminals and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA: fewer than
            10 employees <em>and</em> annual turnover / balance sheet under €2M,
            providing services. Product manufacturers are not exempt regardless of
            size.
          </p>
          <p className="mt-3 text-slate-700">
            Non-Belgian operators serving Belgian consumers fall within SPF/FOD reach.
            Given Belgium hosts EU institutions and attracts cross-border consumer
            spend, the practical reach is broader than the resident population
            suggests.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            EN 301 549 v3.2.1 is the referenced harmonised standard. For web content,
            WCAG 2.1 Level AA is the conformance target. Key technical expectations:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast, 3:1 large text.</li>
            <li>Operable — full keyboard navigation, no flashing above 3 Hz, visible focus indicator.</li>
            <li>Understandable — <code>&lt;html lang=&quot;fr-BE&quot;&gt;</code>, <code>&quot;nl-BE&quot;</code>, or <code>&quot;de-BE&quot;</code> as appropriate; predictable navigation; explicit form labels and error messages.</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Multi-language sites must declare the correct language per page / per
            content block (<code>lang</code> attributes on mixed-language fragments).
            Screen readers rely on this to switch pronunciation profiles.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Penalties and enforcement</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Administrative fines from the Inspection économique / Economische Inspectie: up to <strong>€80,000 per violation</strong>.</li>
            <li>Transactional fines (<em>amendes administratives</em>) settled without court proceedings — common outcome for first-offence non-compliance.</li>
            <li>Criminal referral under the Code de droit économique for repeat or aggravated offences — fines can exceed €1M with corporate-multiplier provisions.</li>
            <li>Public decision publication via SPF Économie press pages — reputational cost comparable to a GDPR APD/GBA decision.</li>
            <li>Sector regulators (FSMA for investment services, BNB/NBB for banks, BIPT/IBPT for telecoms) apply separate fining frameworks on top.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Belgian DPOs (<em>associations représentatives</em> / <em>representatieve
            verenigingen</em>) including Unia and the Conseil Supérieur National des
            Personnes Handicapées have standing to lodge complaints with the SPF/FOD.
            Expect complaint volume to skew toward high-traffic e-commerce and banking
            consumer apps.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Accessibility statement — three languages
          </h2>
          <p className="mt-3 text-slate-700">
            The statement (<em>déclaration d&apos;accessibilité</em> /{" "}
            <em>toegankelijkheidsverklaring</em> / <em>Erklärung zur Barrierefreiheit</em>)
            must be published in the language(s) of the region(s) you operate in.
            National consumer brands typically publish all three: French, Dutch, and
            German. Content requirements:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>conforme / partiellement conforme / non conforme</em> to EN 301 549.</li>
            <li>List of non-accessible content with justification (disproportionate burden, pending remediation, exemption).</li>
            <li>Named accessibility contact (email recommended; phone optional).</li>
            <li>Escalation procedure — SPF Économie / FOD Economie as default federal escalation; sector regulator where applicable.</li>
            <li>Assessment methodology (self-assessment, third-party audit) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>The statement itself must be accessible and linked from the site footer.</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against the homepage and 10 critical consumer flows, per language variant. Cross-language issues surface best with per-locale scan passes.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549; the Inspection économique evaluates the served HTML.</li>
            <li><strong>CI gate</strong> — fail PRs that add serious-severity regressions; prevents drift between audits.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues; commission an IAAP-certified auditor to cover the rest. Belgium-based auditors (AnySurfer, BlindSurfer) are established references.</li>
            <li><strong>Publish statements</strong> in FR, NL, and DE as relevant, with SPF/FOD escalation details.</li>
            <li><strong>Retain evidence</strong> — per-PR axe-core scan history is the most defensible ongoing-diligence record in an SPF/FOD proceeding.</li>
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
            For exposure specific to the Loi / Wet 28 novembre / 28 november 2022,
            consult a Belgian avocat / advocaat. Penalty ceilings cited reflect
            statutory maxima under the Code de droit économique / Wetboek van
            economisch recht.
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Austria — Barrierefreiheitsgesetz (BaFG) for developers",
  description:
    "Austria transposed the EAA via the Barrierefreiheitsgesetz (BaFG). Sozialministeriumservice enforces. Fines up to €80,000 per breach. A practical engineering guide for teams shipping to the Austrian market.",
  keywords: [
    "EAA Austria",
    "Barrierefreiheitsgesetz",
    "BaFG",
    "Sozialministeriumservice Barrierefreiheit",
    "österreichische Barrierefreiheit",
    "WCAG Österreich",
    "Barrierefreiheitserklärung",
    "axle",
  ],
  openGraph: {
    title: "EAA in Austria — Barrierefreiheitsgesetz (BaFG)",
    description:
      "What Austrian law requires, who it applies to, Sozialministeriumservice enforcement, and CI-first compliance.",
    type: "article",
    locale: "de_AT",
  },
  alternates: { canonical: "/guides/eaa-austria" },
};

export default function AustriaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Österreich · EAA-Leitfaden
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Austria — Barrierefreiheitsgesetz (BaFG)
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Austria transposed the European Accessibility Act through the{" "}
          <strong>Barrierefreiheitsgesetz (BaFG)</strong>, published in the
          Bundesgesetzblatt and in force from <strong>28 June 2025</strong>. The
          enforcing authority is the <strong>Sozialministeriumservice (SMS)</strong>,
          which handles both guidance and administrative penalties. Under the
          Austrian <abbr title="Verwaltungsstrafgesetz">VStG</abbr> penalty framework,
          fines for persistent non-compliance reach{" "}
          <strong>up to €80,000 per offence</strong>, applied separately per violation
          and per responsible person. Austrian transposition sits alongside the
          pre-existing <em>Bundes-Behindertengleichstellungsgesetz (BGStG)</em>, which
          enables private-law discrimination claims — a double exposure not shared by
          all EU member states.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Inhalt
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Rechtsgrundlage — the legal stack</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties — VStG + BGStG double exposure</a></li>
            <li><a className="hover:underline" href="#statement">Barrierefreiheitserklärung — the statement</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Rechtsgrundlage — the legal stack</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Web-Zugänglichkeitsgesetz (WZG)</strong> (2019) — transposition of Directive 2016/2102 for federal public-sector bodies. Uses EN 301 549 as the technical standard.</li>
            <li><strong>Barrierefreiheitsgesetz (BaFG)</strong> (2024, effective 28 June 2025) — transposition of Directive 2019/882 (the EAA) to private-sector operators.</li>
            <li><strong>Bundes-Behindertengleichstellungsgesetz (BGStG)</strong> — pre-existing federal disability-equality framework, enables private civil claims for discrimination through inaccessible services. Still enforceable in parallel.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard, embeds WCAG 2.1 Level AA.</li>
            <li><strong>Verwaltungsstrafgesetz (VStG)</strong> — general administrative-penalty framework SMS invokes for fining.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            The double-track exposure (BaFG administrative fines <em>plus</em> BGStG civil
            claims) means a single accessibility failure can generate both a SMS
            procedure and a private-action claim from an affected user.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Austria:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, online marketplaces, booking platforms (Booking.com type).</li>
            <li>Consumer-facing banking, payment, and financial services.</li>
            <li>E-books, e-readers, and associated software.</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calls).</li>
            <li>ÖBB-style passenger-transport ticketing, real-time info, self-service terminals.</li>
            <li>Consumer hardware terminals (Bankomat ATMs, check-in machines) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA, transposed
            directly into BaFG: fewer than 10 employees <em>and</em> annual turnover /
            balance sheet under €2M, providing services. Product manufacturers are
            not exempt regardless of size.
          </p>
          <p className="mt-3 text-slate-700">
            Non-Austrian operators serving Austrian consumers fall within SMS reach.
            German-language sites marketed to DACH users should treat Austrian
            compliance alongside BFSG (Germany) and BehiG (Switzerland, EU-adjacent).
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            BaFG references EN 301 549 v3.2.1. For web content, WCAG 2.1 Level AA is
            the conformance target. Key technical expectations:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast, 3:1 large text.</li>
            <li>Operable — full keyboard navigability, no flashing above 3 Hz, visible focus indicator.</li>
            <li>Understandable — <code>&lt;html lang=&quot;de-AT&quot;&gt;</code>, predictable navigation, explicit form labels in Austrian German (address format, date format, postal code patterns differ from DE).</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Austrian-specific patterns to get right: postal code validation (4
            digits), phone-number format (<code>+43</code>), address format (PLZ before
            city, not after), and the handling of <em>ß</em> vs <em>ss</em> (Austrian
            German uses <em>ß</em> like German German, unlike Swiss German).
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties — VStG + BGStG double exposure
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Administrative fines (SMS via VStG)</strong>: up to <strong>€80,000 per offence</strong>, applied per violation and per responsible natural person (managing director, executive).</li>
            <li><strong>Continuing-offence multiplier</strong>: each day of continued non-compliance after notice can count as a separate offence.</li>
            <li><strong>Public decision register</strong> via the Sozialministeriumservice — Austrian consumer advocates (Behindertenrat, AK) publicise findings.</li>
            <li>
              <strong>BGStG civil claims</strong> — disabled users and representative
              associations can bring private actions for damages, including non-pecuniary
              damages for discrimination through inaccessible services. Settlements
              commonly sit in €500-€5,000 per individual claimant; class-style claims
              through the Klagsverband can aggregate significantly higher.
            </li>
            <li>
              <strong>Sector overlays</strong>: FMA (financial services) and RTR
              (telecoms) apply separate enforcement frameworks on top.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            The BGStG civil-claim route is distinctive. In Germany the BFSG is
            primarily enforced administratively; in Austria the private-action route
            sits in parallel and is actively used by the Klagsverband (an accredited
            litigation association). This makes ongoing CI evidence especially
            valuable in Austria.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Barrierefreiheitserklärung — the statement
          </h2>
          <p className="mt-3 text-slate-700">
            Required elements of the Austrian accessibility statement
            (<em>Barrierefreiheitserklärung</em>):
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>vollständig konform / teilweise konform / nicht konform</em> to EN 301 549.</li>
            <li>List of non-accessible content with justification (<em>unverhältnismäßige Belastung</em>, exemption, pending remediation).</li>
            <li>Named accessibility contact (email required; phone recommended).</li>
            <li>Escalation procedure — Sozialministeriumservice for BaFG matters, Schlichtungsstelle (BMAW) for BGStG matters, plus sector regulator where relevant.</li>
            <li>Assessment methodology (self-assessment, third-party audit) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>Statement must itself be accessible; published in German (Austrian German conventions preferred — <em>Jänner</em> not <em>Januar</em>, <em>Feber</em> not <em>Februar</em>).</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against homepage + 10 critical flows. Most untuned Austrian DTC sites return 30-80 violations.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549. SMS evaluates the served HTML. The Klagsverband will too.</li>
            <li><strong>CI gate</strong> — fail PRs on serious-severity regressions. Prevents drift between audits.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues. Commission an IAAP-certified auditor for the remainder. Austrian-based auditors (HilfsgemeinschaftderBlinden, integriert) are known references.</li>
            <li><strong>Publish the Barrierefreiheitserklärung</strong> with SMS escalation + Schlichtungsstelle details in Austrian German.</li>
            <li><strong>Retain evidence</strong> — CI scan history is the most defensible ongoing-diligence record in a SMS or Klagsverband proceeding.</li>
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
              href="/guides/eaa-germany"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              BFSG (Germany) →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams. Not legal
            advice. For exposure specific to BaFG or BGStG, consult an Austrian
            Rechtsanwalt. Penalty figures cited reflect statutory maxima under the
            VStG penalty framework.
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

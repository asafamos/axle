import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in the Netherlands — Implementatiewet toegankelijkheid for developers",
  description:
    "The Netherlands transposed the EAA via the Implementatiewet toegankelijkheidsvoorschriften producten en diensten. ACM enforces. Fines up to €900,000 per breach. A practical engineering guide for teams shipping to the Dutch market.",
  keywords: [
    "EAA Netherlands",
    "Implementatiewet toegankelijkheid",
    "Nederlandse toegankelijkheid",
    "ACM accessibility",
    "WCAG 2.1 Nederland",
    "toegankelijkheidsverklaring",
    "axle",
  ],
  openGraph: {
    title: "EAA in the Netherlands — Implementatiewet toegankelijkheid",
    description:
      "What the Dutch law requires, who it applies to, ACM enforcement structure, and how to build accessibility into your CI pipeline.",
    type: "article",
    locale: "nl_NL",
  },
  alternates: { canonical: "/guides/eaa-netherlands" },
};

export default function NetherlandsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nederland · EAA-nalevingsgids
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in the Netherlands — Implementatiewet toegankelijkheid
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          The Netherlands transposed the European Accessibility Act through the{" "}
          <strong>Implementatiewet toegankelijkheidsvoorschriften producten en
          diensten</strong> (Implementation Act for accessibility requirements of
          products and services), entering into force on{" "}
          <strong>28 June 2025</strong>. Market surveillance sits primarily with the{" "}
          <strong>Autoriteit Consument & Markt (ACM)</strong> for most consumer services,
          with sector authorities (<abbr title="De Nederlandsche Bank">DNB</abbr>,{" "}
          <abbr title="Autoriteit Financiële Markten">AFM</abbr>,{" "}
          <abbr title="Rijksinspectie Digitale Infrastructuur">RDI</abbr>) covering
          banking, financial services, and telecoms respectively. Penalties via the
          ACM&apos;s general enforcement powers reach up to <strong>€900,000 per breach
          or 1% of annual turnover</strong>, whichever is higher.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Legal framework</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties and enforcement</a></li>
            <li><a className="hover:underline" href="#statement">Toegankelijkheidsverklaring — the statement</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Legal framework</h2>
          <p className="mt-3 text-slate-700">
            The Dutch legal stack:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Tijdelijk besluit digitale toegankelijkheid overheid</strong> (2018) — transposed Directive 2016/2102 for public-sector bodies; requires conformance with EN 301 549 and published toegankelijkheidsverklaring.</li>
            <li><strong>Implementatiewet toegankelijkheidsvoorschriften producten en diensten</strong> (2024) — transposes EAA to the private sector, effective 28 June 2025.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — the harmonised technical standard; embeds WCAG 2.1 Level AA for web content.</li>
            <li><strong>Wet handhaving consumentenbescherming (Whc)</strong> — the consumer-protection enforcement act that ACM uses to impose fines.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            The Dutch government-sector registry <strong>Dashboard Digitoegankelijk</strong>{" "}
            (dashboard.digitoegankelijk.nl) publishes status per public-sector site.
            Private-sector operators are not required to register there, but the
            Dashboard is useful to study what a conformant toegankelijkheidsverklaring
            looks like in practice.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in the Netherlands:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, online marketplaces, booking platforms.</li>
            <li>Consumer-facing banking and financial services (payment accounts, credit).</li>
            <li>E-books, e-readers, and associated software.</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calling).</li>
            <li>Passenger transport ticketing, real-time information, check-in services.</li>
            <li>Consumer hardware terminals (ATMs, ticket machines, check-in kiosks) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA as transposed:
            fewer than 10 employees <em>and</em> annual turnover / balance sheet under
            €2M, providing services. Product manufacturers are <em>not</em> exempt
            regardless of size.
          </p>
          <p className="mt-3 text-slate-700">
            Scope is determined by where consumers are served, not by where the company
            is registered. A non-Dutch operator selling to Dutch consumers falls within
            ACM&apos;s reach.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            The Dutch transposition references EN 301 549 v3.2.1 directly. For web
            content, WCAG 2.1 Level AA is the de facto conformance target. The key
            technical expectations:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast, 3:1 for large text.</li>
            <li>Operable — full keyboard operability, no flashing above 3 Hz, visible focus indicator.</li>
            <li>Understandable — <code>&lt;html lang=&quot;nl&quot;&gt;</code>, predictable navigation, explicit form labels and error messaging in Dutch (or the user&apos;s selected language).</li>
            <li>Robust — valid HTML, ARIA used consistently with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Note: the government sector is already piloting WCAG 2.2 Level AA via
            updates to the Besluit digitale toegankelijkheid overheid. Private-sector
            operators should expect WCAG 2.2 AA to become the reference target within
            the next harmonised-standard update.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Penalties and enforcement</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>ACM administrative fines up to <strong>€900,000 per breach</strong> or <strong>1% of annual turnover</strong>, whichever is higher.</li>
            <li>Last bod (periodic penalty payments) per day of continued non-compliance until remediation.</li>
            <li>Public naming via ACM&apos;s decision database (acm.nl/nl/publicaties) — reputational cost is significant for consumer brands.</li>
            <li>
              Sector regulators apply their own fining regimes — DNB / AFM for banking
              and investment services can exceed ACM ceilings by multiples.
            </li>
            <li>
              <strong>Consumer / disability-organisation complaints</strong> — Ieder(in),
              the Oogvereniging, and similar <abbr title="belangenbehartiger">DPOs</abbr>
              have established escalation pathways to the ACM.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            ACM enforcement historically escalates: informal contact → formal warning →
            last-onder-dwangsom → fine. Early remediation signalled through a credible
            toegankelijkheidsverklaring + CI scan evidence usually stops escalation at
            the warning stage.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Toegankelijkheidsverklaring — the statement
          </h2>
          <p className="mt-3 text-slate-700">
            The Dutch accessibility statement (<em>toegankelijkheidsverklaring</em>) is
            expected to follow the template established for the government sector —
            which in turn follows the EU model. Required elements:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status — <em>voldoet volledig / voldoet gedeeltelijk / voldoet niet</em> to EN 301 549.</li>
            <li>List of non-accessible content with reason (disproportionate burden, pending remediation, exemption).</li>
            <li>Named accessibility contact (email, ideally phone).</li>
            <li>Escalation procedure — reference to ACM (consumer sector) or the relevant sector regulator.</li>
            <li>Assessment methodology (self-assessment, third-party audit, or combination) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>The statement itself must be accessible. Published in Dutch (mandatory); English secondary version recommended for international operators.</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — run axe-core 4.11 against the homepage and 10 critical consumer flows. Most untuned Dutch DTC sites return 30-80 violations.</li>
            <li><strong>Fix at source</strong> — overlay widgets (accessiBe, UserWay, EqualWeb) do not satisfy EN 301 549; ACM evaluates the served HTML, not what a runtime script overlays.</li>
            <li><strong>CI gate</strong> — fail PRs that add serious-severity regressions. Prevents drift between audits.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues; commission a <abbr title="Internationaal Accessibility Professional">IAAP</abbr>-certified auditor for the remainder.</li>
            <li><strong>Publish the toegankelijkheidsverklaring</strong> with ACM escalation details, named contact, date, methodology.</li>
            <li><strong>Retain evidence</strong> — per-PR axe-core scan history is the most defensible ongoing-diligence record in an ACM proceeding.</li>
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
            For exposure specific to the Implementatiewet toegankelijkheid, consult a
            Dutch advocaat. Penalty figures cited reflect ACM&apos;s statutory maxima
            under the Whc enforcement framework.
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

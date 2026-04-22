import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Poland — Ustawa o dostępności for developers",
  description:
    "Poland transposed the EAA via the Ustawa o zapewnianiu spełniania wymagań dostępności. Ministry of Digital Affairs + UOKiK enforce. A practical engineering guide for teams shipping to the Polish market.",
  keywords: [
    "EAA Poland",
    "Ustawa dostępność",
    "dostępność cyfrowa",
    "UOKiK dostępność",
    "WCAG Polska",
    "deklaracja dostępności",
    "axle",
  ],
  openGraph: {
    title: "EAA in Poland — Ustawa o dostępności",
    description:
      "What Polish law requires, who it applies to, Ministry of Digital Affairs + UOKiK enforcement, CI-first compliance.",
    type: "article",
    locale: "pl_PL",
  },
  alternates: { canonical: "/guides/eaa-poland" },
};

export default function PolandPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Polska · przewodnik EAA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Poland — Ustawa o dostępności
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Poland transposed the European Accessibility Act through the{" "}
          <strong>Ustawa z dnia 26 kwietnia 2024 r. o zapewnianiu spełniania
          wymagań dostępności niektórych produktów i usług</strong>, effective{" "}
          <strong>28 June 2025</strong>. The lead coordinating authority is the{" "}
          <strong>Ministerstwo Cyfryzacji (Ministry of Digital Affairs)</strong>,
          building on infrastructure from the earlier <em>Ustawa o dostępności
          cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych</em>{" "}
          (2019) for the public sector. Market surveillance of consumer services
          falls to <strong>UOKiK (Urząd Ochrony Konkurencji i Konsumentów)</strong>,
          with sector regulators KNF (banking / financial services) and UKE (telecoms)
          covering their domains. Administrative fines reach up to{" "}
          <strong>10% of annual turnover</strong> for severe or persistent breaches
          under UOKiK&apos;s consumer-protection powers.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Spis treści
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Podstawa prawna</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties — UOKiK + sector regulators</a></li>
            <li><a className="hover:underline" href="#statement">Deklaracja dostępności</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Podstawa prawna</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Ustawa o dostępności cyfrowej (2019)</strong> — transposition of Directive 2016/2102 for public-sector bodies. Ministerstwo Cyfryzacji maintains the monitoring system.</li>
            <li><strong>Ustawa o zapewnianiu spełniania wymagań dostępności (2024)</strong> — transposition of the EAA (Directive 2019/882) to private-sector operators. Effective 28 June 2025.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard, embeds WCAG 2.1 Level AA.</li>
            <li><strong>Ustawa o ochronie konkurencji i konsumentów</strong> — UOKiK&apos;s general enforcement framework; gives turnover-based fining powers.</li>
          </ul>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Poland:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce (Allegro, Empik, Zalando PL), marketplaces, booking platforms.</li>
            <li>Consumer-facing banking and financial services (mBank, PKO BP, Revolut PL).</li>
            <li>E-books, e-readers, and associated software (Legimi, Empik Go).</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calls).</li>
            <li>PKP Intercity, Koleje Mazowieckie, ZTM Warszawa, etc. passenger-transport ticketing and real-time info.</li>
            <li>Consumer hardware terminals (Euronet ATMs, Paczkomaty InPost, check-in machines) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA: fewer than
            10 employees <em>and</em> annual turnover / balance sheet under €2M,
            providing services. Product manufacturers are not exempt regardless of
            size.
          </p>
          <p className="mt-3 text-slate-700">
            With 38M consumers and the EU&apos;s fastest-growing e-commerce market
            (~14% YoY), Poland is a priority target for cross-border retailers. Any
            non-Polish operator selling to Polish consumers falls within UOKiK reach.
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
            <li>Understandable — <code>&lt;html lang=&quot;pl&quot;&gt;</code>, predictable navigation, explicit form labels in Polish (PESEL validation, NIP format, postal code <em>NN-NNN</em> pattern).</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Polish-specific UX patterns to get right: PESEL (11-digit national ID)
            validation with checksum, NIP (tax ID) with checksum, diacritics handling
            (ą, ć, ę, ł, ń, ó, ś, ź, ż) in names and addresses, and BLIK payment UX
            (which requires screen-reader-friendly code announcement). The Polish
            screen-reader market skews toward NVDA + Jaws; test both.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties — UOKiK + sector regulators
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>UOKiK administrative fines up to <strong>10% of annual turnover</strong> for severe or persistent breaches under the Consumer Protection Act.</li>
            <li>Per-day penalties (<em>kary okresowe</em>) for continued non-compliance after administrative order.</li>
            <li>Public decision register via UOKiK — reputational cost significant for consumer brands and regulated sectors.</li>
            <li><strong>KNF (financial services)</strong> — separate sanctioning framework, can reach tens of millions PLN for systemic breaches.</li>
            <li><strong>UKE (telecoms)</strong> — separate framework with its own administrative fining.</li>
            <li>Affected consumers and <em>organizacje pozarządowe</em> (Fundacja Widzialni, Integracja) have standing to lodge complaints.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            UOKiK enforcement is typically graduated: informal contact →
            postępowanie wyjaśniające → decyzja z nałożeniem kary. Fundacja Widzialni
            publishes periodic reports on Polish digital accessibility; expect
            complaint volume to concentrate where their published gap-analyses
            highlight poor performance.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Deklaracja dostępności
          </h2>
          <p className="mt-3 text-slate-700">
            The Polish accessibility statement follows the template established by
            the 2019 public-sector law. Required elements:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>całkowicie zgodny / częściowo zgodny / niezgodny</em> with EN 301 549.</li>
            <li>List of non-accessible content with justification (<em>nieproporcjonalne obciążenie</em>, exemption, pending remediation).</li>
            <li>Named accessibility contact (<em>koordynator ds. dostępności</em> — email required; phone recommended).</li>
            <li>Escalation procedure — UOKiK for consumer matters, KNF / UKE for sector-specific, Rzecznik Praw Obywatelskich (Ombudsman) for discrimination.</li>
            <li>Assessment methodology (self-assessment, third-party audit, or combination) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>The deklaracja must itself be accessible; published in Polish.</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against the Polish-locale homepage and 10 critical flows. Most untuned Polish DTC sites return 30-80 violations.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549; UOKiK evaluates the served HTML.</li>
            <li><strong>CI gate</strong> — fail PRs on serious-severity regressions.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues. Commission an IAAP-certified auditor. Polish auditors (Fundacja Widzialni, Utilitia) are established references.</li>
            <li><strong>Publish the deklaracja</strong> with UOKiK / sector-regulator escalation in Polish.</li>
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
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← EU-wide EAA overview
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams. Not legal
            advice. For exposure specific to the Ustawa o zapewnianiu spełniania
            wymagań dostępności, consult a Polish radca prawny. Penalty figures
            reflect statutory maxima under the Consumer Protection Act framework.
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

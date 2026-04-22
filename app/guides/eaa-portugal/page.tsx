import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Portugal — Decreto-Lei 82/2022 for developers",
  description:
    "Portugal transposed the EAA via Decreto-Lei n.º 82/2022. AMA (Agência para a Modernização Administrativa) coordinates. ASAE enforces consumer-protection fines. A practical engineering guide for teams shipping to the Portuguese market.",
  keywords: [
    "EAA Portugal",
    "Decreto-Lei 82/2022",
    "AMA acessibilidade",
    "acessibilidade portuguesa",
    "WCAG Portugal",
    "declaração de acessibilidade",
    "axle",
  ],
  openGraph: {
    title: "EAA in Portugal — Decreto-Lei 82/2022",
    description:
      "What Portuguese law requires, who it applies to, AMA / ASAE enforcement, and CI-first compliance.",
    type: "article",
    locale: "pt_PT",
  },
  alternates: { canonical: "/guides/eaa-portugal" },
};

export default function PortugalPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Portugal · guia de conformidade EAA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Portugal — Decreto-Lei 82/2022
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Portugal transposed the European Accessibility Act through{" "}
          <strong>Decreto-Lei n.º 82/2022, de 6 de dezembro</strong>, followed by
          complementary <em>Decreto-Lei n.º 103/2024</em> for private-sector operators,
          effective <strong>28 de junho de 2025</strong>. The lead coordinating
          authority is the <strong>Agência para a Modernização Administrativa (AMA)</strong>,
          which also runs the public-sector accessibility oversight under{" "}
          <em>Decreto-Lei n.º 83/2018</em>. Market surveillance for consumer services
          is handled by <strong>ASAE (Autoridade de Segurança Alimentar e Económica)</strong>,
          with <strong>Banco de Portugal</strong> and <strong>ANACOM</strong> covering
          banking and electronic communications respectively. Penalties include
          <em> contraordenações económicas</em> of up to <strong>€44,891.81 per breach</strong> —
          the Portuguese statutory ceiling for <em>contraordenação muito grave</em>.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Índice
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Enquadramento legal</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Contraordenações — penalty structure</a></li>
            <li><a className="hover:underline" href="#statement">Declaração de acessibilidade</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Enquadramento legal</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Decreto-Lei n.º 83/2018</strong> — transposition of Directive 2016/2102 for public-sector bodies. AMA runs oversight via <a className="underline" href="https://acessibilidade.gov.pt" target="_blank" rel="noopener">acessibilidade.gov.pt</a>.</li>
            <li><strong>Decreto-Lei n.º 82/2022</strong> — base transposition of EAA for products.</li>
            <li><strong>Decreto-Lei n.º 103/2024</strong> — complementary regulation extending the framework to private-sector services, effective 28 June 2025.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard, embeds WCAG 2.1 Level AA.</li>
            <li><strong>Regime Geral das Contraordenações Económicas</strong> (RGCE) — sets the statutory ceilings AMA/ASAE apply.</li>
          </ul>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Portugal:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce, marketplaces, booking platforms.</li>
            <li>Consumer-facing banking, payment services, and financial products.</li>
            <li>E-books, e-readers, and associated software.</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112).</li>
            <li>CP, Carris, Metro passenger-transport ticketing and real-time info.</li>
            <li>Consumer hardware terminals (Multibanco ATMs, check-in machines) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA as
            transposed: fewer than 10 employees <em>and</em> annual turnover / balance
            sheet under €2M, providing services. Product manufacturers are not
            exempt regardless of size.
          </p>
          <p className="mt-3 text-slate-700">
            Non-Portuguese operators serving Portuguese consumers fall within AMA /
            ASAE reach. Brazilian-market operators using the pt_BR locale should
            note that Portuguese (pt_PT) compliance requires Portuguese-Portuguese
            conventions in the declaração (<em>não</em> the Brazilian variants).
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
            <li>Understandable — <code>&lt;html lang=&quot;pt-PT&quot;&gt;</code>, predictable navigation, explicit form labels in Portuguese (NIF validation, postal-code <em>NNNN-NNN</em> format, Portuguese name-order conventions).</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            AMA&apos;s public-sector tooling (<em>AccessMonitor</em>) is freely available
            and useful as a secondary check alongside axe-core. It evaluates slightly
            different checkpoints, surfaced as a complementary signal.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Contraordenações — penalty structure
          </h2>
          <p className="mt-3 text-slate-700">
            Portuguese penalties under the RGCE framework have four tiers
            (<em>leve / grave / muito grave</em>):
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Contraordenação leve</strong>: fines from €250 to €3,740.98.</li>
            <li><strong>Contraordenação grave</strong>: fines from €650 to €44,891.81.</li>
            <li><strong>Contraordenação muito grave</strong>: fines up to <strong>€44,891.81</strong> for natural persons, up to <strong>€44,891.81 × 3</strong> for collective persons in aggravated cases.</li>
            <li>Ancillary sanctions: temporary prohibition of activity, suspension of authorisations, publication of the sanction decision.</li>
            <li><strong>Sector regulators</strong> (Banco de Portugal, ANACOM) apply their own — generally higher — sanction ceilings in their respective domains.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            ASAE enforcement typically proceeds via inspection → notice → fine. A
            published declaração with a named contact usually stops escalation at
            the notice stage, provided an observable remediation plan exists.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Declaração de acessibilidade
          </h2>
          <p className="mt-3 text-slate-700">
            Required elements:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>totalmente conforme / parcialmente conforme / não conforme</em> with EN 301 549.</li>
            <li>List of non-accessible content with justification (<em>encargo desproporcionado</em>, exemption, pending remediation).</li>
            <li>Named accessibility contact (email required; phone recommended).</li>
            <li>Escalation procedure — AMA / ASAE for Tillgänglighetslagen equivalents; Banco de Portugal or ANACOM for sector matters.</li>
            <li>Assessment methodology (self-assessment, third-party audit, or combination) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>The declaração must itself be accessible; published in Portuguese (pt_PT).</li>
          </ol>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against the Portuguese-locale homepage and 10 critical flows.</li>
            <li><strong>Complementary AccessMonitor check</strong> — AMA&apos;s tool provides a Portuguese-flavoured second reading on published URLs.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549. ASAE evaluates served HTML.</li>
            <li><strong>CI gate</strong> — fail PRs on serious-severity regressions.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues. Commission an IAAP-certified auditor. Portuguese auditors (ACAPO, Instituto Sonae) are known references.</li>
            <li><strong>Publish the declaração</strong> with AMA / ASAE escalation details in Portuguese.</li>
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
              href="/guides/eaa-spain"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Ley 11/2023 (Spain) →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> written for engineering teams. Not legal
            advice. For exposure specific to Decreto-Lei 82/2022 or DL 103/2024,
            consult a Portuguese advogado. Penalty figures reflect statutory maxima
            under the RGCE framework.
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

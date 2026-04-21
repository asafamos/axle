import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legge Stanca + EAA 2025 — guida pratica per sviluppatori in Italia",
  description:
    "L'Italia recepisce l'EAA aggiornando la Legge Stanca (4/2004). AgID controlla la conformità. Sanzioni fino al 5% del fatturato. Guida tecnica per integrare l'accessibilità nel CI.",
  keywords: [
    "Legge Stanca",
    "AgID accessibilità",
    "EAA Italia",
    "accessibilità web Italia",
    "decreto legislativo accessibilità",
    "WCAG 2.1 Italia",
    "dichiarazione di accessibilità",
    "axle",
  ],
  openGraph: {
    title: "Legge Stanca e EAA — guida pratica per sviluppatori",
    description:
      "Cosa richiede la legge italiana, a chi si applica, quadro sanzionatorio, e come integrare l'accessibilità nella pipeline CI.",
    type: "article",
    locale: "it_IT",
  },
  alternates: { canonical: "/guides/eaa-italy" },
};

export default function ItalyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Italia · Guida di conformità
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Legge Stanca + EAA 2025 — guida per sviluppatori (Italia)
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          L&apos;Italia ha aggiornato la storica <strong>Legge Stanca</strong> (Legge n. 4/2004)
          per recepire la Direttiva UE 2019/882 sull&apos;accessibilità. Il Decreto Legislativo n.
          82/2022, integrato dal D.lgs. 68/2023, estende gli obblighi al settore privato a
          partire dal <strong>28 giugno 2025</strong>. Le sanzioni arrivano fino al{" "}
          <strong>5% del fatturato annuo</strong> nei casi più gravi — tra le più severe
          dell&apos;UE.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Indice
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Cornice normativa</a></li>
            <li><a className="hover:underline" href="#who">A chi si applica</a></li>
            <li><a className="hover:underline" href="#technical">Requisiti tecnici — Linee guida AgID</a></li>
            <li><a className="hover:underline" href="#penalties">Sanzioni e controlli</a></li>
            <li><a className="hover:underline" href="#agid">Ruolo di AgID</a></li>
            <li><a className="hover:underline" href="#dichiarazione">Dichiarazione di accessibilità</a></li>
            <li><a className="hover:underline" href="#how">Come conformarsi — approccio CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Cornice normativa</h2>
          <p className="mt-3 text-slate-700">
            Il percorso normativo italiano:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Legge n. 4/2004</strong> (&quot;Legge Stanca&quot;) — disposizioni originarie sull&apos;accesso ai sistemi informatici dei soggetti pubblici.</li>
            <li><strong>D.lgs. 106/2018</strong> — recepimento della direttiva UE 2016/2102 sui siti web del settore pubblico.</li>
            <li><strong>D.lgs. 82/2022 e D.lgs. 68/2023</strong> — recepimento dell&apos;EAA, estensione degli obblighi al settore privato.</li>
            <li><strong>Linee guida AgID</strong> — documento tecnico che operazionalizza i requisiti, allineato a EN 301 549 e WCAG 2.1 AA.</li>
          </ul>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">A chi si applica</h2>
          <p className="mt-3 text-slate-700">
            Dal 28 giugno 2025, gli obblighi riguardano anche:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Operatori economici privati con <strong>fatturato superiore a 500 milioni di euro</strong> (soglia italiana specifica).</li>
            <li>E-commerce e piattaforme di prenotazione rivolte a consumatori.</li>
            <li>Servizi bancari e finanziari al consumo.</li>
            <li>E-book, lettori di e-book e relativi software.</li>
            <li>Servizi di comunicazione elettronica al consumo.</li>
            <li>Servizi di trasporto passeggeri (biglietteria, informazioni in tempo reale).</li>
            <li>Produttori di terminali di pagamento, totem self-service, e-book reader.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Esenzione micro-imprese:</strong> meno di 10 dipendenti e fatturato annuo
            fino a 2 M€ sono esenti dagli obblighi di servizio. L&apos;esenzione non si applica ai
            produttori di prodotti.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Società estere:</strong> chi vende a consumatori in Italia rientra
            nell&apos;ambito di applicazione, a prescindere dalla sede legale.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Requisiti tecnici — Linee guida AgID
          </h2>
          <p className="mt-3 text-slate-700">
            Le Linee guida AgID rimandano a <strong>EN 301 549</strong>, che incorpora WCAG 2.1
            Level AA. I requisiti chiave:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Percepibile</strong> — alternative testuali, sottotitoli, contrasto 4,5:1.</li>
            <li><strong>Utilizzabile</strong> — accesso completo da tastiera, nessuna trappola da tastiera, niente contenuti che lampeggiano più di tre volte al secondo.</li>
            <li><strong>Comprensibile</strong> — lingua della pagina dichiarata (<code>&lt;html lang=&quot;it&quot;&gt;</code>), navigazione coerente, messaggi di errore chiari.</li>
            <li><strong>Robusto</strong> — HTML valido, ARIA coerente con il DOM, compatibilità con tecnologie assistive.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            EN 301 549 copre anche le applicazioni mobili native e i software di authoring —
            rilevante se distribuite un&apos;app iOS / Android accanto al sito web.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Sanzioni e controlli</h2>
          <p className="mt-3 text-slate-700">
            Il quadro sanzionatorio italiano è articolato:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Sanzione pecuniaria fino al 5% del fatturato annuo</strong> per i casi di
              non conformità grave e protratta nel tempo.
            </li>
            <li>
              <strong>Sanzione base</strong>: da 5.000 a 40.000 € per mancata pubblicazione
              della dichiarazione di accessibilità o per informazioni fuorvianti.
            </li>
            <li>
              <strong>Diffida amministrativa</strong> — AgID notifica un termine di adeguamento;
              il mancato rispetto fa scattare la sanzione pecuniaria.
            </li>
            <li>
              <strong>Class action dei consumatori</strong> — la Legge n. 31/2019 consente
              azioni collettive; un&apos;associazione di tutela può avviare un procedimento per
              conto di un numero indeterminato di utenti.
            </li>
          </ul>
        </section>

        <section id="agid" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Ruolo di AgID</h2>
          <p className="mt-3 text-slate-700">
            L&apos;<strong>Agenzia per l&apos;Italia Digitale (AgID)</strong> è l&apos;autorità di
            vigilanza designata. Compiti principali:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Pubblicare e aggiornare le Linee guida sull&apos;accessibilità.</li>
            <li>Gestire il portale <strong>form.agid.gov.it</strong> per le segnalazioni dei cittadini.</li>
            <li>Condurre il monitoraggio campione dei siti web dei soggetti obbligati.</li>
            <li>Infliggere le sanzioni amministrative in caso di accertamento di non conformità.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            La dichiarazione di accessibilità deve contenere un link di reindirizzamento al
            portale AgID per consentire agli utenti di escalare in caso di mancata risposta del
            fornitore entro 30 giorni.
          </p>
        </section>

        <section id="dichiarazione" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Dichiarazione di accessibilità
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Stato di conformità: &quot;conforme&quot;, &quot;parzialmente conforme&quot; o &quot;non conforme&quot; ai requisiti di EN 301 549.</li>
            <li>Contenuti non accessibili, con motivazione (onere sproporzionato, esenzione di ambito, o lavori di remediation in corso con tempistica).</li>
            <li>Contatti per segnalazioni — email, telefono, indirizzo postale.</li>
            <li>Procedura di reclamo — link a form.agid.gov.it e tempistica di risposta (30 giorni).</li>
            <li>Metodologia di valutazione — autovalutazione, audit di terzi, o entrambe, con data.</li>
            <li>Data di elaborazione e ultimo aggiornamento.</li>
            <li>La dichiarazione deve essere essa stessa accessibile e in lingua italiana.</li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Il generatore di axle produce una dichiarazione strutturata conforme a EN 301 549. Il{" "}
            <strong>template italiano specifico</strong> (con link al form AgID e localizzazione
            completa) è previsto nel roadmap del piano Team.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Come conformarsi — approccio CI-first
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Scan iniziale</strong> — axe-core 4.11 su home + percorsi critici: tipicamente 30-80 non conformità.</li>
            <li><strong>Correzioni a livello sorgente</strong> — template HTML/CSS, mai overlay runtime. AgID guarda l&apos;HTML servito.</li>
            <li><strong>Integrazione CI</strong> — bloccare PR con regressioni &quot;critical&quot; o &quot;serious&quot;.</li>
            <li><strong>Audit umano annuale</strong> — axe-core intercetta circa il 57% dei problemi WCAG; il resto richiede revisione umana (carichi cognitivi, flusso screen-reader).</li>
            <li><strong>Pubblicazione della dichiarazione</strong> — italiana, con link AgID e processo di reclamo.</li>
            <li><strong>Tracciabilità</strong> — conservate i report CI come prova di diligenza in caso di controllo AgID.</li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Installa la GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generatore di dichiarazione
            </Link>
            <Link
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← Panoramica EAA UE
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Avvertenza:</strong> questa guida è rivolta ai team di sviluppo. Non
            costituisce consulenza legale. Per una valutazione dell&apos;esposizione specifica al
            D.lgs. 82/2022, consultate un avvocato abilitato in Italia. I massimali citati
            sono i limiti di legge; la sanzione effettiva dipende dal caso specifico.
          </p>
          <p className="mt-3">
            Aggiornato: 21 aprile 2026. Rivisto quando evolvono le normative. Correzioni
            fattuali benvenute:{" "}
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RGAA et EAA 2025 — guide pratique pour développeurs en France",
  description:
    "La France transpose l'EAA via la Loi du 9 mars 2023. Référentiel RGAA 4.1.2 (WCAG 2.1 AA). Sanctions jusqu'à 25 000 € par non-conformité. Guide technique pour intégrer l'accessibilité en CI.",
  keywords: [
    "RGAA",
    "RGAA 4",
    "EAA France",
    "accessibilité numérique France",
    "loi accessibilité 2023",
    "schéma pluriannuel accessibilité",
    "WCAG 2.1 France",
    "axle",
  ],
  openGraph: {
    title: "RGAA & EAA — guide pour développeurs en France",
    description:
      "Ce que la loi française exige, à qui elle s'applique, le barème des sanctions, et comment intégrer l'accessibilité au pipeline CI.",
    type: "article",
    locale: "fr_FR",
  },
  alternates: { canonical: "/guides/eaa-france" },
};

export default function FrancePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          France · Guide de conformité RGAA / EAA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          RGAA et EAA 2025 — guide pour développeurs (France)
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          La France a transposé l&apos;EAA via la <strong>Loi n° 2023-171 du 9 mars 2023</strong> et
          renvoie au <strong>Référentiel Général d&apos;Amélioration de l&apos;Accessibilité (RGAA 4.1.2)</strong>,
          qui s&apos;aligne sur WCAG 2.1 niveau AA. Les sanctions administratives atteignent{" "}
          <strong>25 000 € par manquement</strong>, avec cumul possible. Si vous servez des
          consommateurs en France, cet article s&apos;applique à vous — que votre société soit
          française ou non.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sommaire
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Le cadre légal en clair</a></li>
            <li><a className="hover:underline" href="#who">À qui la loi s&apos;applique</a></li>
            <li><a className="hover:underline" href="#rgaa">Exigences techniques du RGAA 4.1.2</a></li>
            <li><a className="hover:underline" href="#penalties">Sanctions et procédures</a></li>
            <li><a className="hover:underline" href="#arcom">Rôle de l&apos;Arcom et de la DINUM</a></li>
            <li><a className="hover:underline" href="#declaration">Déclaration d&apos;accessibilité — contenu obligatoire</a></li>
            <li><a className="hover:underline" href="#how">Mise en conformité — approche CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Le cadre légal en clair</h2>
          <p className="mt-3 text-slate-700">
            Trois textes cohabitent en France :
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>L&apos;article 47 de la loi n° 2005-102</strong> — obligation historique
              d&apos;accessibilité pour le secteur public et les grandes entreprises.
            </li>
            <li>
              <strong>La Loi n° 2023-171 du 9 mars 2023</strong> — transposition de l&apos;EAA pour le
              secteur privé, entrée en vigueur le <strong>28 juin 2025</strong>.
            </li>
            <li>
              <strong>Le RGAA 4.1.2</strong> (référentiel publié par la DINUM) — le document
              technique qui opérationnalise WCAG 2.1 AA pour le contexte français, avec
              106 critères et méthodologie de test.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Le RGAA est plus strict que WCAG 2.1 AA sur certains points de test : il exige
            un taux de conformité chiffré (généralement ≥ 75 % pour « partiellement conforme »)
            plutôt qu&apos;un simple pass / fail.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">À qui la loi s&apos;applique</h2>
          <p className="mt-3 text-slate-700">
            L&apos;EAA français couvre les services fournis à des consommateurs situés en France :
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce et plateformes de réservation.</li>
            <li>Services bancaires et financiers grand public.</li>
            <li>Livres numériques et liseuses.</li>
            <li>Communications électroniques (messagerie, téléphonie IP).</li>
            <li>Billetterie et services d&apos;information des transports.</li>
            <li>Matériel informatique grand public et systèmes d&apos;exploitation.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Exemption micro-entreprise :</strong> moins de 10 salariés et chiffre
            d&apos;affaires annuel / bilan inférieur à 2 M€. L&apos;exemption ne s&apos;applique pas aux
            fabricants de produits.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Effet extraterritorial :</strong> toute société — française ou étrangère —
            qui vend à des consommateurs en France relève du dispositif.
          </p>
        </section>

        <section id="rgaa" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Exigences techniques du RGAA 4.1.2
          </h2>
          <p className="mt-3 text-slate-700">
            Le RGAA impose 106 critères regroupés en 13 thématiques. Les blocs de contrôle
            critiques :
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Images</strong> — alternatives textuelles sur toutes les images porteuses d&apos;information ; <code>alt=&quot;&quot;</code> sur les images décoratives.</li>
            <li><strong>Cadres</strong> — chaque <code>&lt;iframe&gt;</code> dispose d&apos;un titre pertinent.</li>
            <li><strong>Couleurs</strong> — contraste 4,5:1 pour le texte courant, 3:1 pour le texte large et les composants d&apos;interface.</li>
            <li><strong>Multimédia</strong> — transcription textuelle pour l&apos;audio, sous-titres synchronisés pour la vidéo.</li>
            <li><strong>Tableaux</strong> — distinction données / mise en forme, en-têtes associés.</li>
            <li><strong>Liens</strong> — intitulés explicites hors contexte (pas de « cliquez ici »).</li>
            <li><strong>Scripts</strong> — fonctionnalité au clavier, pas de piège clavier, ARIA correctement appliqué.</li>
            <li><strong>Éléments obligatoires</strong> — langue du document (<code>&lt;html lang=&quot;fr&quot;&gt;</code>), titre de page unique.</li>
            <li><strong>Structuration de l&apos;information</strong> — hiérarchie de titres cohérente.</li>
            <li><strong>Présentation</strong> — zoom 200 % sans perte d&apos;information.</li>
            <li><strong>Formulaires</strong> — étiquettes associées, messages d&apos;erreur clairs.</li>
            <li><strong>Navigation</strong> — plan du site ou barre de navigation sur toutes les pages.</li>
            <li><strong>Consultation</strong> — temps suffisant, contrôle de l&apos;utilisateur sur les animations.</li>
          </ul>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Sanctions et procédures</h2>
          <p className="mt-3 text-slate-700">
            Le dispositif de sanctions combine plusieurs leviers :
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Sanction administrative</strong> jusqu&apos;à <strong>25 000 € par
              manquement</strong> (doublé en cas de récidive).
            </li>
            <li>
              <strong>Cumul possible</strong> — chaque service non conforme génère une
              sanction distincte, sans plafond global explicite.
            </li>
            <li>
              <strong>Actions collectives</strong> — les associations de défense des personnes
              handicapées agréées peuvent saisir le juge, avec possibilité de dommages-intérêts
              pour préjudice subi.
            </li>
            <li>
              <strong>Procédure de « mise en demeure »</strong> — l&apos;autorité notifie un délai
              de mise en conformité ; dépassement = sanction.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Les associations françaises d&apos;accessibilité (Valentin Haüy, APF France handicap,
            etc.) sont historiquement très actives. Un signalement par l&apos;une d&apos;elles peut
            déclencher une enquête en quelques semaines.
          </p>
        </section>

        <section id="arcom" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Rôle de l&apos;Arcom et de la DINUM</h2>
          <p className="mt-3 text-slate-700">
            La <strong>DINUM</strong> (Direction interministérielle du numérique) publie le RGAA
            et outille le contrôle pour le secteur public. L&apos;<strong>Arcom</strong> (autorité
            qui a fusionné le CSA et l&apos;Hadopi) intervient sur les services audiovisuels et
            de communication électronique. Pour le secteur privé, le dispositif de contrôle
            relève de la DGCCRF (Direction générale de la concurrence, de la consommation et
            de la répression des fraudes) avec coordination interministérielle.
          </p>
        </section>

        <section id="declaration" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Déclaration d&apos;accessibilité — contenu obligatoire
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>État de conformité : « conforme », « partiellement conforme », « non conforme ».</li>
            <li>Taux de conformité au RGAA 4.1.2 (pourcentage des critères respectés).</li>
            <li>Contenus non accessibles, avec motif (dérogation pour charge disproportionnée, dérogation hors champ, ou correction prévue avec délai).</li>
            <li>Coordonnées du contact accessibilité (email + téléphone recommandé).</li>
            <li>Procédure de saisine du Défenseur des droits si le fournisseur ne répond pas.</li>
            <li>Méthodologie d&apos;évaluation (auto-évaluation, audit tiers, ou les deux, avec date).</li>
            <li>Date d&apos;établissement et de dernière mise à jour.</li>
            <li><strong>Schéma pluriannuel de mise en accessibilité</strong> — obligation spécifique : plan triennal avec calendrier de remédiation.</li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Le générateur d&apos;axle produit aujourd&apos;hui une déclaration structurée conforme à
            EN 301 549. Le <strong>gabarit français complet</strong> (avec taux de conformité et
            schéma pluriannuel) est sur la feuille de route du plan Team.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Mise en conformité — approche CI-first
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Audit initial</strong> — un scan axe-core 4.1 sur la home + parcours critiques révèle en général 30 à 80 critères non conformes.</li>
            <li><strong>Correction à la source</strong> — pas de overlay widget. Le RGAA regarde le HTML servi.</li>
            <li><strong>Intégration CI</strong> — bloquer les PR qui introduisent des régressions « critical » ou « serious ».</li>
            <li><strong>Audit humain annuel</strong> — axe-core détecte ~57 % des problèmes WCAG ; un auditeur certifié Opquast pour le reste.</li>
            <li><strong>Publication de la déclaration</strong> — en français, avec taux de conformité et schéma triennal.</li>
            <li><strong>Traçabilité</strong> — les rapports CI sont votre preuve de diligence en cas de saisine associative.</li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Installer le GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Générateur de déclaration
            </Link>
            <Link
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← Vue EAA européenne
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Avertissement :</strong> ce guide s&apos;adresse aux équipes techniques. Il ne
            constitue pas un avis juridique. Pour une évaluation d&apos;exposition précise,
            consultez un avocat inscrit au barreau français. Les montants de sanctions cités
            sont les plafonds légaux ; la sanction effective dépend de la gravité et de la
            récurrence.
          </p>
          <p className="mt-3">
            Mis à jour : 21 avril 2026. Révisé lorsque les textes évoluent. Corrections
            factuelles bienvenues :{" "}
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

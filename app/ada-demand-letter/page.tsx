import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "I got an ADA demand letter — what to do in the first 48 hours",
  description:
    "Practical first-48-hours playbook for US businesses hit with an ADA Title III website accessibility demand letter. What to do, what not to do, what lawyers will want, what scan evidence to pull.",
  keywords: [
    "ADA demand letter",
    "ADA website lawsuit response",
    "ADA Title III demand letter",
    "website accessibility lawsuit",
    "WCAG demand letter response",
    "accessibility audit evidence",
    "axle",
  ],
  openGraph: {
    title: "I got an ADA demand letter — the first 48 hours",
    description:
      "A practical playbook for US businesses hit with an ADA Title III website accessibility demand letter.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/ada-demand-letter" },
};

export default function ADADemandLetterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Emergency playbook · ADA Title III
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          I got an ADA demand letter — what to do in the first 48 hours
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          An ADA Title III website-accessibility demand letter lands in your inbox or
          on the registered agent&apos;s desk. The letter cites WCAG violations on your
          site, claims discriminatory design, and demands remediation + attorney fees.
          What you do in the first 48 hours materially changes the cost of resolving
          this. Here&apos;s the playbook — written for founders and engineering leads,
          not legal teams.
        </p>

        <div className="mt-6 rounded-lg border-l-4 border-rose-500 bg-rose-50 p-4 text-sm text-rose-900">
          <strong>This is not legal advice.</strong> Consult an ADA-admitted attorney in
          your jurisdiction immediately. What follows is the engineering-side
          playbook your attorney will ask you to execute in parallel.
        </div>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#dont">What NOT to do</a></li>
            <li><a className="hover:underline" href="#hour-0">Hour 0 — preserve the evidence</a></li>
            <li><a className="hover:underline" href="#hour-4">Hour 4 — scan and inventory</a></li>
            <li><a className="hover:underline" href="#hour-8">Hour 8 — engage counsel</a></li>
            <li><a className="hover:underline" href="#hour-24">Hour 24 — remediation plan</a></li>
            <li><a className="hover:underline" href="#hour-48">Hour 48 — CI + statement</a></li>
            <li><a className="hover:underline" href="#landscape">The lawsuit landscape</a></li>
            <li><a className="hover:underline" href="#mistakes">Typical mistakes that make it worse</a></li>
          </ol>
        </nav>

        <section id="dont" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What NOT to do</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Do not install an accessibility overlay widget in a panic.</strong>{" "}
              Plaintiff&apos;s firms specifically flag overlay sites (accessiBe,
              UserWay, AudioEye, EqualWeb) as evidence of bad-faith compliance. The
              FTC fined accessiBe $1M in January 2025 for deceptive claims. Installing
              one after receiving a letter is among the worst signals you can send.
            </li>
            <li>
              <strong>Do not reply directly to the plaintiff&apos;s attorney</strong>{" "}
              without counsel. Anything you say can become part of the proof of
              willful non-compliance.
            </li>
            <li>
              <strong>Do not modify the accessed pages before documenting them.</strong>{" "}
              You need a snapshot of the site as the plaintiff saw it. Fix later.
            </li>
            <li>
              <strong>Do not assume it&apos;s a scam.</strong> Even when the letter
              reads boilerplate, the underlying ADA exposure is real. The mill approach
              is a feature, not a fraud.
            </li>
            <li>
              <strong>Do not ignore the timeline.</strong> Most letters specify a
              7-14 day response window. Silence triggers filing.
            </li>
          </ul>
        </section>

        <section id="hour-0" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Hour 0 — preserve the evidence
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Archive the current live site.</strong> Submit the landing page
              and the specific URLs cited to the <a className="underline" href="https://web.archive.org/save" target="_blank" rel="noopener">Wayback Machine Save Page Now</a>. This
              creates a third-party-timestamped snapshot that can&apos;t be
              retroactively altered.
            </li>
            <li>
              <strong>Screenshot everything.</strong> Full-page screenshots of the
              cited URLs, the checkout flow, the login flow. macOS:{" "}
              <code>Cmd+Shift+5</code>. Linux: <code>scrot --full</code>.
            </li>
            <li>
              <strong>Save the rendered HTML.</strong> View source on the cited pages
              and save the HTML to a dated folder. This is your authoritative record of
              what the served markup was on the date of the demand.
            </li>
            <li>
              <strong>Retain the letter itself.</strong> Scan it if paper. Do not
              annotate or reformat.
            </li>
            <li>
              <strong>Capture analytics for the cited pages.</strong> Session volume,
              bounce rate, conversion metrics. Useful later for proportionality
              arguments.
            </li>
          </ol>
        </section>

        <section id="hour-4" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Hour 4 — scan and inventory
          </h2>
          <p className="mt-3 text-slate-700">
            You need to understand what the plaintiff is actually seeing. Plaintiff&apos;s
            firms typically run one of two tools: axe-core (open source, same engine
            axle uses) or WAVE (WebAIM). Reproduce their scan locally.
          </p>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Run axe-core against the cited pages</strong> using the{" "}
              <Link href="/" className="underline">
                homepage scan form
              </Link>{" "}
              or the CLI:{" "}
              <code>npx axle-cli scan https://your-site.com</code>.
            </li>
            <li>
              <strong>Save the full JSON output</strong>. Per cited URL, capture the
              rule ID, severity, node count, target selector, and HTML snippet.
              Anchor every claim in the letter to a specific rule in your scan.
            </li>
            <li>
              <strong>Compare against the letter&apos;s allegations.</strong> Letters
              usually cite 5-20 specific violations. Check: are they real? Are they
              still present? Were some misidentified? Plaintiff&apos;s firms sometimes
              include false positives or issues that were already fixed.
            </li>
            <li>
              <strong>Add to the inventory any violations the letter missed.</strong>{" "}
              Your counsel will want the complete picture, not just what was cited.
            </li>
          </ol>
          <p className="mt-3 text-slate-700">
            The scan output is evidence in two directions: it documents what needs
            fixing and it anchors any future &ldquo;this was already remediated&rdquo;
            claim in timestamped data.
          </p>
        </section>

        <section id="hour-8" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Hour 8 — engage counsel
          </h2>
          <p className="mt-3 text-slate-700">
            If you don&apos;t already have an attorney, now is the time. What to look
            for:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>ADA Title III experience specifically.</strong> General
              employment or litigation counsel will likely refer out. Ask about
              comparable matters in the last 24 months.
            </li>
            <li>
              <strong>Jurisdiction match.</strong> Most website-accessibility filings
              concentrate in the Southern District of New York (SDNY), the Eastern
              District of New York (EDNY), Florida (SD FL), and California (CD CA).
              Counsel admitted in the plaintiff&apos;s filing venue is essential.
            </li>
            <li>
              <strong>Willingness to negotiate vs. litigate.</strong> In most cases,
              settlement is cheaper than discovery. A counsel who defaults to
              scorched-earth will add six figures to your bill for minimal benefit.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Counsel will usually handle the response letter directly. Your job is to
            give them the technical facts: the scan, the inventory, the remediation
            plan, and the CI evidence that the regressions won&apos;t recur.
          </p>
        </section>

        <section id="hour-24" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Hour 24 — remediation plan
          </h2>
          <p className="mt-3 text-slate-700">
            By hour 24 you should have a written remediation plan with real dates.
            Typical structure:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li><strong>Cited violations</strong> — remediate within 30 days.</li>
            <li><strong>Critical/serious axe-core severities not cited</strong> — remediate within 60 days.</li>
            <li><strong>Moderate/minor severities</strong> — remediate within 90-120 days.</li>
            <li><strong>Human audit</strong> — scheduled with a certified auditor (IAAP CPACC or similar) within 60 days. Covers the ~43% of WCAG issues automated tools can&apos;t detect.</li>
            <li><strong>CI gate</strong> — pre-merge accessibility check deployed within 14 days to prevent regressions.</li>
          </ol>
          <p className="mt-3 text-slate-700">
            The dated plan is often what settles the matter. Plaintiff&apos;s firms
            want either money or observable compliance; a credible dated plan
            delivers the latter. The CI gate is the part they rarely see from
            defendants and it&apos;s the clearest signal this won&apos;t recur.
          </p>
        </section>

        <section id="hour-48" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Hour 48 — CI + statement
          </h2>
          <p className="mt-3 text-slate-700">
            By hour 48 two pieces of long-term infrastructure should be in place:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              <strong>CI pipeline scanning every PR</strong> for WCAG 2.1 AA
              regressions. Install the{" "}
              <a
                className="underline"
                href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
                target="_blank"
                rel="noopener"
              >
                axle GitHub Action
              </a>{" "}
              (or equivalent). Run it on main. Run it on every PR. This creates a
              continuous evidence trail.
            </li>
            <li>
              <strong>Published accessibility statement</strong> at{" "}
              <code>/accessibility</code> with conformance status, named contact
              (email + phone), assessment methodology, preparation date. Use the{" "}
              <Link href="/statement" className="underline">
                statement generator
              </Link>{" "}
              to produce the markup.
            </li>
          </ol>
          <p className="mt-3 text-slate-700">
            Both are cited in virtually every settlement as required deliverables. Get
            ahead of the requirement by having them live before the response letter
            goes out.
          </p>
        </section>

        <section id="landscape" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The lawsuit landscape</h2>
          <p className="mt-3 text-slate-700">
            Context to calibrate severity: approximately 4,000 ADA website-accessibility
            lawsuits were filed in US federal courts in 2024, with an estimated further
            8,000+ demand letters that settled privately. Most filings concentrate in
            four venues:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>SDNY / EDNY (New York)</strong> — highest filing volume, plaintiff-friendly precedent.</li>
            <li><strong>CD CA (Los Angeles, Unruh Act crossover)</strong> — California&apos;s Unruh Civil Rights Act statutory damages ($4,000 per violation) layer on top of ADA.</li>
            <li><strong>SD FL (Florida)</strong> — growing volume, mixed precedent.</li>
            <li><strong>Federal courts in Illinois and Pennsylvania</strong> — emerging.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            The most-targeted industries: e-commerce (~70% of filings), hospitality,
            restaurant chains, professional services with consumer-facing booking,
            and higher education. Sites on Shopify, WooCommerce, Magento, and
            Salesforce Commerce Cloud disproportionately appear; the underlying theme
            inventory usually does.
          </p>
          <p className="mt-3 text-slate-700">
            Typical settlements in the $8,000-$40,000 range for a first-time defendant
            who remediates promptly. Contested cases can reach six figures in
            attorney fees alone.
          </p>
        </section>

        <section id="mistakes" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Typical mistakes that make it worse
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Installing an overlay after the letter arrives.</strong> As
              above — signals bad faith and is specifically targeted by sophisticated
              plaintiff&apos;s firms.
            </li>
            <li>
              <strong>Replying &ldquo;we&apos;re working on it&rdquo; without dates.</strong>{" "}
              Undated commitments are treated as evasion. Always pair commitments with
              specific remediation dates backed by an engineering plan.
            </li>
            <li>
              <strong>Partial fixes without CI</strong>. Fixing the cited pages and
              leaving the rest of the site untouched produces the next demand letter
              within the year, from the same or different plaintiff. The CI gate is
              what prevents letter #2.
            </li>
            <li>
              <strong>Assuming a manual audit PDF is enough.</strong> A human audit
              from Q1 2025 doesn&apos;t prove the site was accessible in Q4 2025.
              Continuous CI evidence does.
            </li>
            <li>
              <strong>Not publishing a statement.</strong> A published statement with
              named contact and escalation path is among the most-cited required
              deliverables in consent decrees and settlement agreements. Publish it
              proactively.
            </li>
          </ul>
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            What axle does, specifically, for this scenario
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Scans the cited pages and returns a rule-by-rule inventory matched to the letter&apos;s allegations.</li>
            <li>Proposes Claude-generated source-code fixes as PR suggestions — your team reviews and merges.</li>
            <li>Installs as a GitHub Action that gates every future PR against regressions (the CI evidence counsel will cite).</li>
            <li>Generates a compliant accessibility statement with named contact and jurisdictional escalation.</li>
            <li>Publishes a tamper-evident verified statement URL on the Team plan for settlement / consent-decree reference.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
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
              href="/why-not-overlay"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Why NOT to install an overlay →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> this is an engineering-side playbook. It is
            not legal advice. ADA exposure varies by jurisdiction, letter content,
            and the specific facts of your site. Consult an ADA-admitted attorney
            immediately upon receiving a demand letter.
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

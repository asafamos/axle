import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle for ADA defense / plaintiff law firms — recommend it to clients",
  description:
    "axle is the indie alternative to overlay widgets and $40K audit firms. ADA Title III defense and plaintiff lawyers can recommend axle to clients during settlement / consent decree negotiation as the continuous-compliance evidence layer the court increasingly expects.",
  keywords: [
    "ADA Title III defense",
    "ADA settlement compliance",
    "consent decree accessibility",
    "ADA lawyer tool",
    "WCAG settlement evidence",
    "axle",
  ],
  openGraph: {
    title: "axle for ADA defense / plaintiff law firms",
    description:
      "Continuous compliance evidence layer for ADA settlement / consent decree negotiation.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/lawyers" },
};

export default function LawyersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          For: ADA Title III defense + plaintiff law firms
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          The continuous-compliance evidence layer your settlements need
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          When a website-accessibility ADA case settles, the consent decree
          almost always specifies remediation timelines and ongoing-compliance
          obligations. The defendant&apos;s side has to demonstrate, six and
          twelve months later, that they actually did the work and stayed
          compliant. axle is the tool that makes that demonstration cheap and
          credible.
        </p>

        <p className="mt-3 text-lg text-slate-700">
          We&apos;re not selling to lawyers — we&apos;re asking lawyers to
          <strong> recommend axle to their clients</strong> during settlement
          negotiation. It&apos;s the same recommendation that already happens
          for &ldquo;hire an auditor&rdquo;, just for the continuous-monitoring
          piece between audits.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#defense">For defense counsel</a></li>
            <li><a className="hover:underline" href="#plaintiff">For plaintiff counsel</a></li>
            <li><a className="hover:underline" href="#consent-decree">Consent-decree-friendly language</a></li>
            <li><a className="hover:underline" href="#evidence">What axle produces (the audit-trail)</a></li>
            <li><a className="hover:underline" href="#firm-program">Firm program: 30% recurring on referrals</a></li>
          </ol>
        </nav>

        <section id="defense" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">For defense counsel</h2>
          <p className="mt-3 text-slate-700">
            Your client just got served. They&apos;re weighing settlement vs
            litigation. Settlement is almost always cheaper, but the
            settlement agreement will require:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Remediation of the cited violations within 60-180 days.</li>
            <li>An accessibility audit by a certified third party.</li>
            <li>Ongoing compliance monitoring with periodic reports — usually 6 and 12 months out.</li>
            <li>An accessibility statement with named contact and escalation channel.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            axle covers items 3 and 4 directly. The client installs axle&apos;s
            GitHub Action; every PR is scanned automatically; the scan history
            is the &ldquo;ongoing compliance monitoring&rdquo; the consent
            decree asks for. Cost: $49/mo. Replaces a quarterly $5K-$10K
            consultancy retainer.
          </p>
          <p className="mt-3 text-slate-700">
            See the{" "}
            <Link href="/ada-demand-letter" className="underline">
              first-48-hours playbook
            </Link>{" "}
            for the engineering-side checklist your client can hand their
            CTO.
          </p>
        </section>

        <section id="plaintiff" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">For plaintiff counsel</h2>
          <p className="mt-3 text-slate-700">
            The risk in plaintiff-side settlement is the defendant agrees to
            remediate, then quietly regresses six months later. By then the
            settlement is closed, your client has moved on, and the next
            plaintiff has to start over.
          </p>
          <p className="mt-3 text-slate-700">
            Including a CI-monitoring obligation in the consent decree
            (with axle named as one acceptable provider) gives you a defensible
            way to show the court that the defendant maintained compliance.
            If they regressed and didn&apos;t remediate within the grace
            period, the CI scan history is admissible evidence of bad faith.
          </p>
        </section>

        <section id="consent-decree" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Consent-decree-friendly language
          </h2>
          <p className="mt-3 text-slate-700">
            Drop-in clause for the Continuous Monitoring section of an ADA
            Title III consent decree. Adapt to your jurisdiction:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-slate-200 bg-white p-4 text-xs text-slate-800">
{`§X.X CONTINUOUS COMPLIANCE MONITORING

Defendant shall implement automated WCAG 2.1 AA conformance scanning
on every code deployment to its primary consumer-facing web property
(the "Site"), beginning no later than thirty (30) days after entry of
this Decree.

Acceptable automated scanning solutions include but are not limited to
axle (axle-iota.vercel.app), Pa11y, Deque axe DevTools, or any other
tool that:

  (a) evaluates the Site against the WCAG 2.1 AA success criteria using
      a publicly-documented engine;
  (b) produces dated, reproducible scan reports retained for the
      duration of this Decree;
  (c) flags new violations introduced by code changes within seven (7)
      days of merge.

Defendant shall produce scan reports to Plaintiff or Plaintiff's
counsel upon written request, with no more than one (1) such request
per quarter. Reports may be redacted to protect proprietary code
patterns but shall not be redacted as to the rule violated, severity,
or affected URL pattern.`}
          </pre>
          <p className="mt-3 text-slate-700">
            This language is provided as a starting point for your own legal
            judgement. We are not your lawyers and this is not legal advice.
            Adapt to the jurisdiction and the facts of the case.
          </p>
        </section>

        <section id="evidence" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            What axle produces (the audit-trail)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li><strong>Per-PR scan reports</strong>, dated and reproducible. JSON + Markdown.</li>
            <li><strong>Public verified scan URLs</strong> at <code>/r/&lt;id&gt;</code> — third-party-timestamped, tamper-evident.</li>
            <li><strong>Per-rule violation breakdown</strong> mapped to WCAG success criteria — directly maps to a VPAT.</li>
            <li><strong>Continuous compliance trend</strong> over time — show the court the defendant stayed at zero serious violations for the period.</li>
            <li><strong>Named contact published</strong> on the accessibility statement at the defendant&apos;s site, satisfying the &ldquo;accessibility coordinator&rdquo; obligation.</li>
            <li><strong>Statement generator</strong> ({" "}
              <Link href="/statement" className="underline">
                /statement
              </Link>
              ) produces the consent-decree-required accessibility statement in the regulator&apos;s preferred format.
            </li>
          </ol>
        </section>

        <section id="firm-program" className="mt-10 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-900">
            Firm program — 30% recurring on referrals
          </h2>
          <p className="mt-3 text-sm text-emerald-900">
            If you systematically recommend axle in settlements / consent
            decrees, the firm earns 30% recurring on every Team or Business
            plan that signs up. No cap, no per-referral limit, monthly payouts.
            Same as our existing{" "}
            <Link href="/partners" className="underline">
              partner program
            </Link>
            .
          </p>
          <p className="mt-3 text-sm text-emerald-900">
            For high-volume firms (say, &gt;10 ADA cases per quarter): we&apos;ll
            white-label the consent-decree language with your firm&apos;s
            template + provide a dedicated integration point for retrieving
            scan reports during ongoing-compliance review. Email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il?subject=axle%20-%20law%20firm%20partnership">
              asaf@amoss.co.il
            </a>{" "}
            to discuss.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Why this is different from referring to overlay widgets
          </h2>
          <p className="mt-3 text-slate-700">
            Some firms have been recommending overlay widgets (accessiBe,
            UserWay, AudioEye) to clients during settlement. This is becoming
            risky:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>The FTC fined accessiBe $1M in January 2025 for deceptive compliance claims.</li>
            <li>Multiple federal courts have rejected overlay-widget defenses in subsequent ADA cases.</li>
            <li>Overlays create a documented trail of &ldquo;we tried to hide the problem&rdquo; that opposing counsel can subpoena.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Recommending a CI-grade scanner (axle, Pa11y, or Deque) instead is
            the defensible path. axle&apos;s differentiator is the consent-
            decree-aligned artifact set + the price point ($49/mo vs $40K/yr
            audit retainer). See the full overlay analysis at{" "}
            <Link href="/why-not-overlay" className="underline">
              /why-not-overlay
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 flex flex-wrap gap-3">
          <a
            href="mailto:asaf@amoss.co.il?subject=axle%20-%20law%20firm%20partnership"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Email re: firm partnership
          </a>
          <Link
            href="/ada-demand-letter"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            First-48-hours client playbook →
          </Link>
          <Link
            href="/partners"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Partner program (30% recurring)
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> we are not your lawyers, and nothing
            on this page is legal advice. Sample consent-decree language is
            provided as a drafting starting point; adapt to your jurisdiction
            and the facts of your case.
          </p>
          <p className="mt-3">Updated: 7 May 2026.</p>
        </footer>
      </article>
    </main>
  );
}

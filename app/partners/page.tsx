import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle partners — 30% recurring affiliate program",
  description:
    "Partner with axle. Earn 30% recurring on every Team and Business plan you refer, for the lifetime of the subscription. Built for agencies, devrel, accessibility auditors, and content creators in the WCAG / EAA / ADA space.",
  keywords: [
    "axle partners",
    "axle affiliate",
    "accessibility affiliate program",
    "WCAG affiliate",
    "EAA partners",
    "axle",
  ],
  openGraph: {
    title: "axle partners — 30% recurring affiliate program",
    description:
      "Earn 30% recurring on every Team / Business plan referred. For agencies, devrel, auditors.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          axle · partners program
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Partner with axle
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Earn <strong>30% recurring</strong> on every Team ($49/mo) and Business
          ($299/mo) plan you refer, for the lifetime of the subscription. No cap,
          no clawback after 90 days, monthly payouts via Stripe Connect or Wise.
          Built for accessibility auditors, agencies serving multiple clients,
          DevRel professionals, and content creators in the WCAG / EAA / ADA
          space.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">The math</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-2">Plan</th>
                <th className="pb-2 text-right">Monthly price</th>
                <th className="pb-2 text-right">Your cut / month</th>
                <th className="pb-2 text-right">Per year</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-2">Team</td>
                <td className="py-2 text-right">$49</td>
                <td className="py-2 text-right font-semibold">$14.70</td>
                <td className="py-2 text-right">$176.40</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Business</td>
                <td className="py-2 text-right">$299</td>
                <td className="py-2 text-right font-semibold">$89.70</td>
                <td className="py-2 text-right">$1,076.40</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-sm text-slate-600">
            Refer 10 Team accounts that stay 12 months: $1,764 to you. Refer 3
            Business accounts that stay 12 months: $3,229. Same audience that
            already needs WCAG / EAA tooling.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who this is for</h2>
          <ul className="mt-4 list-disc space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Accessibility auditors and consultancies</strong> — recommend
              axle to clients as the CI piece between your audits. You charge for
              the audit; axle handles the continuous monitoring; both are needed.
            </li>
            <li>
              <strong>Web agencies</strong> serving multiple clients. axle is the
              piece that lets you ship accessible work consistently without
              hiring a full-time accessibility specialist per project.
            </li>
            <li>
              <strong>DevRel professionals</strong> at frameworks (Next.js, React,
              Nuxt, etc.) — your stack guides cite axle alongside the other CI
              tooling and you earn on every team that adopts.
            </li>
            <li>
              <strong>Content creators</strong> writing about WCAG, EAA 2025, ADA,
              or Section 508. The 50+ guide pages on this site link well; your
              content explains the regulation, axle solves the implementation.
            </li>
            <li>
              <strong>Compliance / legal advisors</strong> — when clients ask
              &ldquo;how do we operationalise this?&rdquo;, axle is the answer.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Apply.</strong> Email{" "}
              <a className="underline" href="mailto:asaf@amoss.co.il?subject=axle%20partners%20application">
                asaf@amoss.co.il
              </a>{" "}
              with a link to your work, audience, and the channels you&apos;d use
              to refer (blog, podcast, conference, agency newsletter, etc.).
            </li>
            <li>
              <strong>Get your link.</strong> Personalised <code>?ref=...</code>{" "}
              code that tracks signups for 90 days after the click. No cookie
              tricks — clean attribution.
            </li>
            <li>
              <strong>Refer.</strong> Mention axle where it&apos;s genuinely
              relevant. We provide brand assets, screenshots, and pre-written copy
              for blog posts / newsletter blurbs / talk slides.
            </li>
            <li>
              <strong>Get paid.</strong> Monthly via Stripe Connect or Wise. We
              show you a live dashboard of referrals, conversion rate, and lifetime
              earnings. No per-referral cap.
            </li>
          </ol>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">The fine print</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-sm text-slate-700">
            <li>30% recurring for the lifetime of the subscription. If the customer downgrades, your cut adjusts. If they cancel, your cut ends.</li>
            <li>90-day attribution window after the click. After that, the referral expires.</li>
            <li>No fraud, no incentivised signups, no self-referrals. Detected fraud forfeits earnings.</li>
            <li>Annual subscriptions count fully — your cut is paid monthly across the year.</li>
            <li>Refunds (within 14 days) reverse the corresponding commission.</li>
            <li>Brand restrictions: no &ldquo;axle&rdquo;-prefixed domains, no copying landing pages verbatim, attribution required.</li>
            <li>You can&apos;t bid on &ldquo;axle&rdquo; as a paid search keyword (Google Ads, etc.) — natural search and content only.</li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-900">
            Apply: 1 paragraph, 1 link
          </h2>
          <p className="mt-2 text-sm text-emerald-900">
            No formal application. Email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il?subject=axle%20partners%20application">
              asaf@amoss.co.il
            </a>{" "}
            with: who you are, your audience / channel, and a link to your work.
            We approve manually within 2 business days. Quality over volume.
          </p>
          <a
            href="mailto:asaf@amoss.co.il?subject=axle%20partners%20application"
            className="mt-4 inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Apply by email →
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-lg border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">
                Can I be a partner if I&apos;m a competitor?
              </summary>
              <p className="mt-2 text-sm text-slate-700">
                If your tool serves the same use case (a11y CI), no — the
                referral model implies an honest recommendation. If you&apos;re
                adjacent (audit firm, agency, framework devrel), yes —
                that&apos;s exactly the audience this is for.
              </p>
            </details>
            <details className="rounded-lg border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">
                What if a customer signs up Open (free) plan?
              </summary>
              <p className="mt-2 text-sm text-slate-700">
                No commission on free plans. If they upgrade to Team or Business
                later within the 90-day attribution window, your cut starts then.
              </p>
            </details>
            <details className="rounded-lg border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">
                Do I need a website / company to be a partner?
              </summary>
              <p className="mt-2 text-sm text-slate-700">
                No. A newsletter, a YouTube channel, a podcast, or a conference
                talk all count. We need to see consistent reach to the kind of
                audience that needs accessibility CI — engineering teams, agencies,
                compliance advisors.
              </p>
            </details>
            <details className="rounded-lg border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">
                Can my agency white-label axle?
              </summary>
              <p className="mt-2 text-sm text-slate-700">
                Not currently. The Business plan covers most agency needs (unlimited
                repos, your team manages multiple client accounts). For genuine
                white-label or reseller arrangements, email and we&apos;ll discuss
                terms.
              </p>
            </details>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Partners program is in early-access mode. Terms may evolve; current
          partners are grandfathered into the rate at signup time.
        </footer>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PricingClient from "./client";

export const metadata: Metadata = {
  title: "axle pricing — free, $49/mo Team, $299/mo Business",
  description:
    "Open plan: free forever, 1 repo, bring your own Anthropic key. Team: $49/mo, hosted AI fixes, up to 10 repos. Business: $299/mo, unlimited repos + EAA-language statement pack + SLA. Annual saves ~17%.",
  keywords: [
    "axle pricing",
    "accessibility CI pricing",
    "WCAG CI cost",
    "a11y CI pricing",
    "axle plans",
  ],
  openGraph: {
    title: "axle pricing — free, $49/mo Team, $299/mo Business",
    description:
      "Three plans. Open is free forever for 1 repo. Team adds hosted AI fixes + multi-repo. Business adds unlimited repos + EAA pack + SLA.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · pricing
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Simple, no-seat pricing
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Three plans. No per-developer fees. No artificial PR limits. Cancel
          anytime. Annual billing saves about 17% (two months free) on Team and
          Business.
        </p>

        <PricingClient />

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">What&apos;s included in every plan</h2>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-700">
            <li>WCAG 2.1 / 2.2 AA scanning via axe-core 4.11 (the same engine plaintiff-firm scanners use).</li>
            <li>GitHub Action, npm CLI, Netlify / Cloudflare Pages / Vercel / WordPress plugins. Same engine on every surface.</li>
            <li>Sticky PR comment with violations grouped by severity, downloadable JSON + markdown report artifact.</li>
            <li>Public compliance badge for your README (passing / issues / failing / pending).</li>
            <li>Hebrew accessibility statement generator (runs locally in your browser, no signup).</li>
            <li>EN 301 549 / EAA / ADA / Section 508 reference guides.</li>
            <li>No runtime overlay widget injection — ever.</li>
          </ul>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <Detail
            title="Plan limits explained"
            body={
              <ul className="list-disc space-y-1 ps-5">
                <li><strong>1 repo</strong> on Open is per GitHub user / org.</li>
                <li><strong>Up to 10 repos</strong> on Team is the hard cap.</li>
                <li><strong>Unlimited repos</strong> on Business covers all your orgs.</li>
                <li>Each plan includes unlimited PR scans, no per-scan fee.</li>
              </ul>
            }
          />
          <Detail
            title="AI fixes — what you actually pay for"
            body={
              <>
                <p>Open uses your own Anthropic key — Claude calls billed to you directly. Team and Business include hosted AI fixes (we manage the key + the prompt cache).</p>
                <p className="mt-2">Hosted-fix budget per plan:</p>
                <ul className="mt-2 list-disc space-y-1 ps-5">
                  <li>Team: ~500 fixes / month (covers ~50 active PRs).</li>
                  <li>Business: ~5,000 fixes / month.</li>
                </ul>
              </>
            }
          />
          <Detail
            title="Statement pack languages"
            body={
              <>
                <p>Open: English + Hebrew.</p>
                <p className="mt-2">Team: + German, French, Italian, Spanish.</p>
                <p className="mt-2">Business: full EU pack — DE / FR / IT / ES / NL / PT / DA / SV / FI / PL / CS / HU + EN / HE.</p>
                <p className="mt-2">Each language uses native regulator references (DINUM, AgID, OAW, ACM, etc.).</p>
              </>
            }
          />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
          <div className="mt-6 space-y-4">
            <Faq
              q="Can I switch plans later?"
              a="Yes. Upgrades are immediate, downgrades take effect at the end of the current billing period. No proration penalty."
            />
            <Faq
              q="What payment methods do you accept?"
              a="Credit cards via Polar (our merchant of record). Polar handles VAT for EU buyers automatically. SEPA / wire on Business plan upon request."
            />
            <Faq
              q="Do you offer a free trial of paid plans?"
              a={
                <>
                  Yes — every paid plan starts with a 14-day full refund window.
                  Try it, cancel within 14 days for any reason and you owe
                  nothing.{" "}
                  <Link href="/free-scan" className="underline">
                    The free scan
                  </Link>{" "}
                  also works without any signup if you just want to see what we
                  detect.
                </>
              }
            />
            <Faq
              q="Self-hosted?"
              a={
                <>
                  The free tier is already self-hosted (the GitHub Action runs
                  in your runner, the CLI runs anywhere). For air-gapped /
                  on-prem AI-fix backends, contact{" "}
                  <a className="underline" href="mailto:asaf@amoss.co.il">
                    asaf@amoss.co.il
                  </a>
                  .
                </>
              }
            />
            <Faq
              q="Affiliate / partner program?"
              a={
                <>
                  Yes — 30% recurring on every Team / Business plan you refer.
                  See{" "}
                  <Link href="/partners" className="underline">
                    /partners
                  </Link>
                  .
                </>
              }
            />
            <Faq
              q="GDPR / data processing?"
              a="Hosted on Vercel + Upstash Redis (Frankfurt / Dublin regions). DPA available on request. Source code submitted for AI fixes is sent to Anthropic's API with zero-retention pass-through; no other third parties."
            />
            <Faq
              q="What happens if I exceed the AI-fix budget?"
              a="Scans continue normally. AI fix generation pauses for the rest of the billing month with a clear PR-comment notice. You can buy a top-up or upgrade. Scans never stop — only the AI fix-suggestion flow does."
            />
            <Faq
              q="Money-back guarantee?"
              a="14-day no-questions-asked refund on every paid plan. After that, monthly cancellation. No annual lock-in."
            />
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-slate-200 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Still deciding?
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Run a free scan first — no signup, no credit card. Get the full
            WCAG 2.2 AA report by email and see what axle would catch.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/free-scan"
              className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Free scan →
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Install GitHub Action (Open) →
            </a>
            <Link
              href="/docs"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Read the docs
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 27 April 2026. Prices in USD. Polar.sh is the merchant of
          record and handles VAT, sales-tax compliance, and reverse-charge for
          EU buyers automatically.
        </footer>
      </article>
    </main>
  );
}

function Detail({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      <div className="mt-3 text-sm text-slate-700">{body}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white p-5">
      <summary className="cursor-pointer font-semibold text-slate-900">{q}</summary>
      <div className="mt-3 text-sm text-slate-700">{a}</div>
    </details>
  );
}

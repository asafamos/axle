"use client";

import { useState } from "react";
import Link from "next/link";

type Cycle = "monthly" | "annual";

const SITE_MONTHLY = 19;
const SITE_ANNUAL_TOTAL = 190; // ~17% off — 12 months for the price of ~10
const TEAM_MONTHLY = 49;
const TEAM_ANNUAL_TOTAL = 470; // ~17% off — 12 months for the price of ~9.6
const BUSINESS_MONTHLY = 299;
const BUSINESS_ANNUAL_TOTAL = 2870; // ~17% off

export default function PricingClient({
  siteEnabled = false,
}: {
  // The Site tier only renders once its Polar product is configured, so a
  // visitor never clicks "Subscribe" on a plan whose checkout isn't wired yet.
  siteEnabled?: boolean;
}) {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const sitePrice = cycle === "annual" ? SITE_ANNUAL_TOTAL / 12 : SITE_MONTHLY;
  const teamPrice = cycle === "annual" ? TEAM_ANNUAL_TOTAL / 12 : TEAM_MONTHLY;
  const businessPrice =
    cycle === "annual" ? BUSINESS_ANNUAL_TOTAL / 12 : BUSINESS_MONTHLY;

  const siteSaving = SITE_MONTHLY * 12 - SITE_ANNUAL_TOTAL;
  const teamSaving = TEAM_MONTHLY * 12 - TEAM_ANNUAL_TOTAL;
  const businessSaving = BUSINESS_MONTHLY * 12 - BUSINESS_ANNUAL_TOTAL;

  return (
    <>
      <div className="mt-8 inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 text-sm font-medium">
        <button
          onClick={() => setCycle("monthly")}
          className={`rounded-md px-4 py-2 transition ${
            cycle === "monthly"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setCycle("annual")}
          className={`rounded-md px-4 py-2 transition ${
            cycle === "annual"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Annual
          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
            Save ~17%
          </span>
        </button>
      </div>

      <div
        className={`mt-8 grid gap-6 ${
          siteEnabled ? "md:grid-cols-2 lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        <Plan
          tier="Open"
          price={0}
          cycle={cycle}
          highlight={false}
          tagline="Free forever for solo developers and OSS"
          features={[
            "1 repository",
            "Unlimited PR scans",
            "axe-core 4.11 engine",
            "Sticky PR comments",
            "Public compliance badge",
            "Hebrew + EN statement generator",
            "Bring-your-own Anthropic key (AI fixes billed to you)",
          ]}
          cta={{
            label: "Install GitHub Action →",
            href: "https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci",
            external: true,
          }}
        />
        {siteEnabled ? (
          <Plan
            tier="Site"
            price={sitePrice}
            cycle={cycle}
            highlight={false}
            tagline="One website. AI fixes + compliance — no code, no keys."
            saving={cycle === "annual" ? `Save $${siteSaving} / year` : undefined}
            features={[
              "1 website",
              "Hosted AI fixes — no Anthropic key needed",
              "Unlock inside the WordPress plugin (paste your key)",
              "Accessibility statement (EN / HE)",
              "Public compliance badge",
              "Unlimited scans",
            ]}
            cta={{
              label:
                cycle === "annual"
                  ? "Subscribe annually →"
                  : "Subscribe monthly →",
              href: `/api/polar/checkout?plan=site&cycle=${cycle}`,
              external: false,
              startCheckout: { plan: "site", cycle },
            }}
          />
        ) : null}
        <Plan
          tier="Team"
          price={teamPrice}
          cycle={cycle}
          highlight={true}
          tagline="Most teams. Hosted AI fixes + multi-repo."
          saving={cycle === "annual" ? `Save $${teamSaving} / year` : undefined}
          features={[
            "Up to 10 repositories",
            "Hosted AI fixes (~500/month)",
            "Multi-language statement pack (EN/HE/DE/FR/IT/ES)",
            "Verified statement URL (tamper-evident, timestamped)",
            "Trend history across scans",
            "Email support",
            "All Open features",
          ]}
          cta={{
            label: cycle === "annual" ? "Subscribe annually →" : "Subscribe monthly →",
            // The /api/polar/checkout endpoint accepts plan + cycle in body. The
            // /pricing page POSTs directly so we don't have to leave the page.
            href: `/api/polar/checkout?plan=team&cycle=${cycle}`,
            external: false,
            startCheckout: { plan: "team", cycle },
          }}
        />
        <Plan
          tier="Business"
          price={businessPrice}
          cycle={cycle}
          highlight={false}
          tagline="Agencies, multi-product, EU enterprise"
          saving={cycle === "annual" ? `Save $${businessSaving} / year` : undefined}
          features={[
            "Unlimited repositories",
            "Hosted AI fixes (~5,000/month)",
            "Full EU statement pack (12 languages)",
            "Per-org access control",
            "Priority email + Slack support",
            "SLA: 24h response, 99.5% uptime",
            "All Team features",
          ]}
          cta={{
            label: cycle === "annual" ? "Subscribe annually →" : "Subscribe monthly →",
            href: `/api/polar/checkout?plan=business&cycle=${cycle}`,
            external: false,
            startCheckout: { plan: "business", cycle },
          }}
        />
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        14-day money-back guarantee on every paid plan. Cancel anytime.{" "}
        <Link href="/partners" className="underline">
          Affiliate program: 30% recurring →
        </Link>
      </p>
    </>
  );
}

type CTA = {
  label: string;
  href: string;
  external: boolean;
  startCheckout?: { plan: "site" | "team" | "business"; cycle: Cycle };
};

function Plan(props: {
  tier: string;
  price: number;
  cycle: Cycle;
  highlight: boolean;
  tagline: string;
  saving?: string;
  features: string[];
  cta: CTA;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [errContact, setErrContact] = useState<string | null>(null);

  async function startCheckout() {
    if (!props.cta.startCheckout) return;
    setSubmitting(true);
    setErr(null);
    setErrContact(null);
    try {
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: props.cta.startCheckout.plan,
          cycle: props.cta.startCheckout.cycle,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        // data.error is written for the customer's eyes by the route; the
        // internal detail stays in the server log.
        if (typeof data.contact === "string") setErrContact(data.contact);
        throw new Error(data.error || "Could not start checkout. Please try again.");
      }
      window.location.href = data.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start checkout");
      setSubmitting(false);
    }
  }

  const priceDisplay =
    props.price === 0
      ? "$0"
      : `$${props.price % 1 === 0 ? props.price : props.price.toFixed(2)}`;

  return (
    <div
      className={`flex flex-col rounded-xl border-2 bg-white p-6 ${
        props.highlight
          ? "border-emerald-500 shadow-lg ring-1 ring-emerald-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-bold text-slate-900">{props.tier}</h3>
        {props.highlight ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            Most popular
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <span className="text-4xl font-bold tracking-tight text-slate-900">
          {priceDisplay}
        </span>
        {props.price !== 0 ? (
          <span className="text-slate-500">/mo</span>
        ) : (
          <span className="ml-1 text-slate-500">forever</span>
        )}
      </div>
      {props.saving ? (
        <p className="mt-1 text-xs font-semibold text-emerald-700">
          {props.saving}
        </p>
      ) : props.cycle === "annual" && props.price === 0 ? (
        <p className="mt-1 text-xs text-slate-500">No annual discount needed</p>
      ) : (
        <p className="mt-1 text-xs text-slate-500">&nbsp;</p>
      )}

      <p className="mt-3 text-sm text-slate-700">{props.tagline}</p>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
        {props.features.map((f) => (
          <li key={f} className="flex items-start">
            <span className="mt-0.5 mr-2 inline-block text-emerald-700">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {props.cta.external ? (
          <a
            href={props.cta.href}
            target="_blank"
            rel="noopener"
            className={`block w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition ${
              props.highlight
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "border border-slate-900 text-slate-900 hover:bg-slate-50"
            }`}
          >
            {props.cta.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={startCheckout}
            disabled={submitting}
            className={`block w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              props.highlight
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "border border-slate-900 text-slate-900 hover:bg-slate-50"
            }`}
          >
            {submitting ? "Loading..." : props.cta.label}
          </button>
        )}
        {err ? (
          <p className="mt-2 text-xs text-rose-700" role="alert">
            {err}
            {errContact ? (
              <>
                {" "}
                <a
                  href={`mailto:${errContact}?subject=${encodeURIComponent(
                    `axle ${props.tier} — ${props.cycle} plan`,
                  )}`}
                  className="font-semibold underline"
                >
                  Email {errContact}
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

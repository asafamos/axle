import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Early adopters & signals — axle in production (pre-launch, honest numbers)",
  description:
    "axle is 30 days old. Here are the real adoption signals we have so far: VSCode installs, GitHub stars, npm downloads, and where the early users are coming from. No fake testimonials — the actual state of where we are.",
  keywords: [
    "axle case studies",
    "axle adoption",
    "axle real users",
    "axle early adopters",
    "axle",
  ],
  openGraph: {
    title: "axle — early adopter signals and real numbers",
    description:
      "30 days old. No fake testimonials. Real downloads, real installs, real first review.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · adoption signals (pre-launch)
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Early adopters & signals
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          axle is <strong>30 days old</strong>. We don&apos;t have fake
          testimonials. We&apos;re telling you exactly what real adoption
          signals we have so you can calibrate whether axle is the right
          stage of product for your situation. If you need
          &ldquo;1,000 teams trust us,&rdquo; we&apos;re not there yet —
          come back in six months, or look at axe DevTools / Tenon.io.
        </p>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          What we can measure today
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stat
            label="VS Code installs"
            value="7"
            sub="asafamos.axle-a11y · Microsoft Marketplace"
            link="https://marketplace.visualstudio.com/items?itemName=asafamos.axle-a11y"
          />
          <Stat
            label="VS Code rating"
            value="5.0 ★"
            sub="1 review · weighted 4.50"
            link="https://marketplace.visualstudio.com/items?itemName=asafamos.axle-a11y&ssr=false#review-details"
          />
          <Stat
            label="GitHub stars (axle-action)"
            value="5"
            sub="organic — no promotion yet"
            link="https://github.com/asafamos/axle-action"
          />
          <Stat
            label="npm downloads (axle-mcp)"
            value="127"
            sub="first 24h post-publish · mix of mirror crawlers + real installs"
            link="https://www.npmjs.com/package/axle-mcp"
          />
          <Stat
            label="Distribution surfaces shipped"
            value="12"
            sub="GH Action · CLI · 3 hosting plugins · WP · VSCode · Storybook · MCP · GPT · integrations"
            link="/integrations"
          />
          <Stat
            label="Paid customers"
            value="0"
            sub="We haven&apos;t started serious outbound yet. First cold-email batch this week."
            link="/why-axle"
          />
        </div>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          Where the early users come from
        </h2>
        <p className="mt-3 text-slate-700">
          We tracked source attribution for the first 30 days. Honest
          breakdown — no spin:
        </p>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>GitHub Marketplace search</strong> — the largest source by
            volume. People search &ldquo;accessibility CI&rdquo; on the
            GitHub Marketplace and the axle-action listing surfaces. 4 of the
            5 stars on the action repo came in via this path with zero
            outbound effort.
          </li>
          <li>
            <strong>npm registry crawlers + mirror traffic</strong> — most of
            the published-package download counts are not real human eyes.
            The 127 first-day downloads for axle-mcp are largely npm&apos;s
            own crawlers + CI systems testing the package. Treat npm
            downloads as &ldquo;not zero&rdquo; rather than &ldquo;real
            adoption.&rdquo;
          </li>
          <li>
            <strong>VS Code Marketplace category browsing</strong> — the 7
            installs and the 5★ review came in within 48 hours of publishing
            the extension, with no promotion. Microsoft&apos;s
            &ldquo;Accessibility&rdquo; tag is a real organic surface.
          </li>
          <li>
            <strong>Direct from /r/&lt;id&gt; certificate URLs</strong> —
            when someone shares an axle scan in a Slack channel or Jira
            ticket, the recipients land on the result page and ~15% of
            those page-visits convert to a free scan of their own URL.
            Viral primitive, real signal.
          </li>
        </ul>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          The one real review we have so far
        </h2>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-2xl font-semibold text-slate-900">★★★★★</p>
          <p className="mt-2 text-sm text-slate-600">
            VS Code Marketplace, 5/5, weighted rating 4.50. The reviewer
            chose not to leave a name or comment — only the star rating.
            We&apos;re listing it as-is rather than dressing it up as a
            testimonial.
          </p>
        </div>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          What we&apos;re looking for from the next 30 days
        </h2>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>3-5 paying customers</strong> on the Team or Business
            tier — to validate the pricing thesis and to put real names + use
            cases here.
          </li>
          <li>
            <strong>1 case study with an accessibility consultant or
            agency</strong> — the highest-LTV segment. Adrian Roselli, Funka,
            TPGi, AnySurfer, Hassell Inclusion are the cold-outreach targets
            this week.
          </li>
          <li>
            <strong>5+ public adopters who let us list them</strong> — even
            free-tier users running the GitHub Action on a real repo
            counts. If you&apos;re willing to be named here, mail us; we&apos;ll
            do a 30-min audit of your CI setup as a thank-you.
          </li>
        </ul>

        <hr className="my-12 border-slate-300" />

        <div className="rounded-lg border border-slate-300 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Want to be on this page in 30 days?
          </h2>
          <p className="mt-3 text-slate-700">
            We&apos;re actively looking for early adopters who&apos;ll let us
            tell their story honestly — including the parts where axle
            wasn&apos;t the right fit. Easiest path: book a 15-min demo on
            your actual codebase.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
            >
              📅 Book a 15-min demo
            </Link>
            <a
              href="mailto:asaf@amoss.co.il?subject=axle%20early%20adopter%20%E2%80%94%20list%20us"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-900 hover:bg-slate-100"
            >
              Email instead
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Comparison-shopping?{" "}
            <Link className="underline" href="/why-axle">
              /why-axle
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/compare">
              /compare
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/pricing">
              /pricing
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/roadmap">
              /roadmap
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  link,
}: {
  label: string;
  value: string;
  sub: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      target={link.startsWith("http") ? "_blank" : undefined}
      rel={link.startsWith("http") ? "noopener" : undefined}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-600">{sub}</p>
    </Link>
  );
}

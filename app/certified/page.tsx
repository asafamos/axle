import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle Certified — public directory of accessible sites",
  description:
    "axle Certified is a free public directory of websites that pass WCAG 2.2 AA in axle's continuous CI scan. Each listing links to a verified scan result. Apply for free; verification is automated.",
  keywords: [
    "axle certified",
    "WCAG certified",
    "accessibility certified directory",
    "WCAG 2.2 AA verified",
    "accessible websites directory",
    "axle",
  ],
  openGraph: {
    title: "axle Certified — public directory of accessible sites",
    description:
      "Free public directory of WCAG 2.2 AA conformant sites verified by axle's continuous scan.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/certified" },
};

// Manually curated for now — keeps quality high during the bootstrap. As
// volume grows we'll move to a Redis-backed directory keyed off /r/<id>
// scan results that meet the bar (passing + scanned within 30 days +
// applicant has confirmed they want to be listed).
const certified: {
  domain: string;
  description: string;
  category: string;
  scanUrl?: string;
  certifiedAt: string;
}[] = [
  {
    domain: "axle-iota.vercel.app",
    description: "axle's own marketing site — eat our own dogfood. Continuous CI on every PR.",
    category: "Developer tools",
    scanUrl: "/r/PCFp1QGemnC184g2",
    certifiedAt: "2026-05-07",
  },
];

export default function CertifiedPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          axle Certified · public directory
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Sites that pass WCAG 2.2 AA continuously
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          axle Certified is a free public directory of websites that pass
          axle&apos;s WCAG 2.2 AA scan and maintain that status via continuous CI.
          Each listing links to a verified scan result. The directory is
          curated — submission is free, verification is automated, listing is
          permanent as long as your site continues to pass.
        </p>

        <section className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-900">
            Why certify a site?
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-sm text-emerald-900">
            <li>
              <strong>A real verified mark</strong> — not a self-reported
              checkbox. The directory link goes to a public timestamped scan
              result anyone can verify.
            </li>
            <li>
              <strong>Public proof for procurement</strong> — link the certified
              listing in your VPAT or accessibility statement. Buyers see a
              third-party-verifiable claim instead of an empty &ldquo;we are
              compliant&rdquo;.
            </li>
            <li>
              <strong>SEO + backlinks</strong> — certified listings include a
              do-follow link to your site. The directory itself is indexable.
            </li>
            <li>
              <strong>Free</strong> — no paid &ldquo;featured&rdquo; slots, no
              tier system. Everyone who passes is listed equally.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            How to get certified
          </h2>
          <ol className="mt-4 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Run a scan.</strong>{" "}
              <Link href="/free-scan" className="underline">
                Free scan
              </Link>{" "}
              if you don&apos;t already have one. Pass at WCAG 2.2 AA — zero
              critical, zero serious violations.
            </li>
            <li>
              <strong>Install continuous CI.</strong> Set up the{" "}
              <a
                className="underline"
                href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
                target="_blank"
                rel="noopener"
              >
                axle GitHub Action
              </a>{" "}
              on your main repo so the &ldquo;continuous&rdquo; part is real.
              Free for one repo.
            </li>
            <li>
              <strong>Apply.</strong> Email{" "}
              <a className="underline" href="mailto:asaf@amoss.co.il?subject=axle%20Certified%20application">
                asaf@amoss.co.il
              </a>{" "}
              with: domain, description (under 200 chars), category, and a
              link to your most recent <code>/r/&lt;id&gt;</code> scan result.
              We verify within 2 business days.
            </li>
            <li>
              <strong>Listing.</strong> Approved sites are added with their
              scan-result link as proof. We re-verify automatically every 30
              days. Sites that drop below the bar get a 14-day grace period to
              re-pass before being de-listed.
            </li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Currently certified ({certified.length})
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Bootstrap mode — directory is small while we curate. Sorted by
            certification date (most recent first).
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {certified.map((c) => (
              <div
                key={c.domain}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={`https://${c.domain}`}
                    target="_blank"
                    rel="noopener"
                    className="text-base font-semibold text-emerald-700 underline hover:text-emerald-900"
                  >
                    {c.domain}
                  </a>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    Verified
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  {c.category}
                </p>
                <p className="mt-3 text-sm text-slate-700">{c.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Certified {c.certifiedAt}</span>
                  {c.scanUrl ? (
                    <Link
                      href={c.scanUrl}
                      className="underline hover:text-slate-700"
                    >
                      Scan proof →
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            How &ldquo;continuous&rdquo; verification works
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            Every 30 days we re-scan your domain. If it still passes, the
            listing stays as-is. If it drops below the threshold, you get an
            email + 14-day grace period to re-pass. Sites that don&apos;t
            recover are de-listed quietly — no public shaming, just removal.
          </p>
          <p className="mt-3 text-sm text-slate-700">
            This is a deliberate design choice: most accessibility directories
            list sites that passed once and never recheck. The whole point of
            <em> axle</em> is continuous compliance. The directory reflects
            that.
          </p>
        </section>

        <section className="mt-12 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-900">
            Embed the certified badge on your site
          </h2>
          <p className="mt-2 text-sm text-emerald-900">
            Once your domain is certified you get a unique badge URL that
            renders a live shield. Update happens automatically when scans
            re-pass. Sample embed:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-emerald-900 p-3 text-xs text-emerald-100">
{`<a href="https://axle-iota.vercel.app/certified">
  <img
    src="https://axle-iota.vercel.app/api/badge?url=https://yoursite.com&standard=WCAG%202.2%20AA"
    alt="axle Certified — WCAG 2.2 AA"
  />
</a>`}
          </pre>
          <p className="mt-3 text-sm text-emerald-900">
            The badge endpoint is the same as the public compliance badge at{" "}
            <Link href="/badge" className="underline">
              /badge
            </Link>
            . Certified sites get to use it with the &ldquo;axle Certified&rdquo;
            framing in alt text + caption — not just &ldquo;passing&rdquo;.
          </p>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclosure:</strong> certified status is automated against
            axle&apos;s WCAG 2.2 AA scan (axe-core 4.11). It is not a substitute
            for a human accessibility audit, and is not a legal compliance
            certification. See{" "}
            <Link href="/web-accessibility-audit" className="underline">
              the audit guide
            </Link>{" "}
            for what a human audit covers.
          </p>
          <p className="mt-3">Updated: 7 May 2026.</p>
        </footer>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle vs AudioEye — source-level fixes instead of hybrid overlay",
  description:
    "AudioEye blends overlay JavaScript with managed remediation, but the runtime overlay component still carries the legal risk courts flagged in accessiBe. axle fixes in source, builds the audit trail, and costs a fraction.",
  keywords: [
    "AudioEye alternative",
    "AudioEye vs",
    "accessibility compliance without overlay",
    "WCAG CI pipeline",
    "source-level accessibility fixes",
    "axle",
  ],
  alternates: { canonical: "/alternatives/audioeye" },
  openGraph: {
    title: "axle vs AudioEye — source-first accessibility CI",
    description:
      "Same WCAG coverage, without the runtime overlay script and without enterprise pricing.",
    type: "article",
  },
};

export default function AudioEyeAlternativePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Comparison
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            axle is the source-first alternative to AudioEye.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            AudioEye markets itself as a hybrid: automated remediation plus managed
            services. The automated layer is still a runtime overlay — the same category
            of tooling the FTC hit accessiBe over in January 2025. The managed-services
            layer is useful but priced for enterprise. axle is a simpler engineering
            choice: scan in CI, fix in source, publish a verified statement URL for your
            lawyer.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start free
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Install the GitHub Action
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900">Side-by-side</h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">AudioEye</th>
                  <th className="px-4 py-3 bg-emerald-50 font-semibold text-emerald-900">
                    axle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Core approach</td>
                  <td className="px-4 py-3 text-slate-700">
                    Runtime JS overlay + managed remediation service
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    CI-time scan + Claude source-code fix suggestions
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Runtime script on your page</td>
                  <td className="px-4 py-3 text-red-700">
                    Yes — the AudioEye JavaScript is what powers the overlay layer
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Who fixes the source code</td>
                  <td className="px-4 py-3 text-slate-700">
                    Paid managed-services team (slow loop, billed hourly)
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Your devs, with Claude-generated diffs landing directly in PR comments
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Compliance artifacts</td>
                  <td className="px-4 py-3 text-slate-700">
                    Reports included at higher tiers
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Scan reports + published verified statement URL (/s/&lt;id&gt;) on Team
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Pricing</td>
                  <td className="px-4 py-3 text-slate-700">
                    Undisclosed; commonly $1,500+/yr per site at SMB tier
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    Free tier · $49/mo Team · $299/mo Business
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">CI pipeline integration</td>
                  <td className="px-4 py-3 text-slate-700">
                    Not the primary delivery model
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 text-emerald-900">
                    GitHub Action, npm CLI, Netlify / Cloudflare / Vercel plugins, WP plugin
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            If you&apos;re switching because of the overlay concern
          </h2>
          <p className="mt-4 text-slate-700">
            The cleanest migration path is to leave AudioEye&apos;s managed remediation
            intact for the specific tickets you have open with them, add axle to your
            CI to <em>prevent regressions</em> from the moment you switch, and
            gradually pull the overlay script out of your site once the pipeline has
            been green for 30 days. That way you never have a period with neither
            coverage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              See pricing
            </Link>
            <Link
              href="/alternatives/accessibe"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              vs accessiBe
            </Link>
            <Link
              href="/alternatives/userway"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              vs UserWay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

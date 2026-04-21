import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why accessibility overlay widgets don't work — the evidence",
  description:
    "accessiBe, UserWay, AudioEye, EqualWeb all ship JavaScript overlays that claim to fix accessibility at runtime. The FTC fined accessiBe $1M in January 2025. Princeton research shows overlays harm screen-reader users. Here's what actually works.",
  keywords: [
    "accessibility overlay",
    "accessiBe FTC",
    "overlay widget scam",
    "accessibility overlay bad",
    "WCAG overlay widget",
    "EAA overlay compliance",
    "axle",
  ],
  openGraph: {
    title: "Why accessibility overlay widgets don't work",
    description:
      "The FTC $1M settlement. The Princeton study. What regulators and courts actually want to see.",
    type: "article",
  },
  alternates: { canonical: "/why-not-overlay" },
};

export default function WhyNotOverlayPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            The evidence · Updated April 2026
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Why accessibility overlay widgets don&apos;t work.
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            If you&apos;re paying $500-$5,000/year for a JavaScript overlay that claims
            to make your site &quot;WCAG compliant&quot; at the click of a button, this
            page is for you. The short version: the claim is not true, regulators and
            plaintiff&apos;s lawyers now treat overlay presence as <em>bad-faith
            evidence</em>, and the FTC has written the legal playbook against this
            category of product.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            1. The $1M FTC settlement (January 2025)
          </h2>
          <p className="mt-4 text-slate-700">
            The Federal Trade Commission reached a <strong>$1,000,000 settlement</strong>{" "}
            with accessiBe, the largest overlay vendor, in January 2025. The FTC
            complaint alleged two core deceptive practices:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Representing the widget as automatically achieving WCAG compliance when it did not.</li>
            <li>Using paid &quot;testimonials&quot; and review-farm tactics to create the appearance of disability-community support the product did not actually have.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            The settlement is now public case law. Plaintiff&apos;s attorneys in ADA
            accessibility lawsuits routinely cite it to establish that overlay-based
            remediation does not create a reasonable-effort defence.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            2. The Princeton study (2023)
          </h2>
          <p className="mt-4 text-slate-700">
            Van Lee et al., Princeton University Center for Information Technology
            Policy, tested overlay widgets with blind users and screen-reader software in
            2023. Their findings:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              Overlay-injected ARIA attributes <strong>conflicted</strong> with the
              underlying HTML semantics, causing NVDA and JAWS to announce wrong
              element roles.
            </li>
            <li>
              In multiple scenarios, users with screen readers completed tasks{" "}
              <strong>more slowly and with more errors</strong> when the overlay was
              active than when it was disabled.
            </li>
            <li>
              Overlay &quot;profiles&quot; (e.g., &quot;ADHD mode&quot;, &quot;blind
              mode&quot;) were mostly cosmetic toggles that did not alter underlying
              accessibility barriers.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Disability advocacy organisations now reference this study routinely. The
            National Federation of the Blind (NFB) and similar groups have formal public
            positions against overlays.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            3. Regulators look at served HTML, not runtime behaviour
          </h2>
          <p className="mt-4 text-slate-700">
            Under EAA 2025 / EN 301 549 / WCAG 2.1 AA, conformance is evaluated against
            the HTML <em>served by your origin</em>. An overlay that manipulates the DOM
            after page load does not change the served HTML and does not change the
            scan result a regulator, consumer association, or court-appointed auditor
            would run.
          </p>
          <p className="mt-3 text-slate-700">
            Practical test: point axe-core (free, open-source) at your site with the
            overlay script <em>disabled</em>. That is what regulators see. If it fails,
            you are non-compliant — regardless of whether the overlay is active for
            other visitors.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            4. What actually works
          </h2>
          <p className="mt-4 text-slate-700">
            The pattern that holds up legally and in practice:
          </p>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Fix at the source.</strong> Edit your HTML / CSS / React templates
              until axe-core shows zero serious+ violations.
            </li>
            <li>
              <strong>Prevent regressions in CI.</strong> Put a scanner in your pull
              request pipeline that blocks merges when accessibility regresses. This is
              what keeps the site clean in the months between human audits.
            </li>
            <li>
              <strong>Commission one human audit per year.</strong> Automated tools
              (including axe-core 4.11) catch roughly 57% of WCAG issues. The remaining
              43% — cognitive load, screen-reader navigation flow, video captioning —
              needs a certified human auditor.
            </li>
            <li>
              <strong>Publish an accessibility statement.</strong> EAA requires one, and
              courts and regulators look for it first. It must be dated, name a
              responsible contact, and link to an escalation channel.
            </li>
            <li>
              <strong>Keep the audit trail.</strong> When a consumer association
              complains, your defence is evidence of systematic good-faith effort — CI
              scan reports and audit records serve that purpose.
            </li>
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Try the alternative free.
          </h2>
          <p className="mt-4 text-slate-700">
            axle is the overlay-free tool for this: scan every PR with axe-core 4.11,
            Claude-generated code-fix diffs in the PR comment, published verified
            statement URL for your lawyer. Unlimited scans on the free tier. Team plan
            at $49/mo — one twelfth of what overlay vendors charge.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
            <Link
              href="/alternatives/audioeye"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              vs AudioEye
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

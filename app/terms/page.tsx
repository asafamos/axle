import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "axle terms of service and acceptable use policy.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose prose-slate max-w-none">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Legal
        </p>
        <h1>Terms of service</h1>
        <p className="text-sm text-slate-500">
          Last updated: 20 April 2026
        </p>

        <h2>1. What axle is</h2>
        <p>
          axle is a set of developer tools (a GitHub Action, a CLI, and
          platform plugins for Netlify, Cloudflare Pages, Vercel, and WordPress)
          plus a hosted scanning service at{" "}
          <code>axle-iota.vercel.app</code> that runs axe-core 4.11 against URLs
          you submit. By using any of these tools or the hosted service, you
          agree to these terms.
        </p>

        <h2>2. Free tier</h2>
        <p>
          The free tier permits unlimited local scans via the CLI and the
          plugins (they run axe-core on your own infrastructure). The hosted
          scanner at <code>/api/scan</code> is rate-limited to 3 scans per IP
          address per UTC day for unauthenticated callers. We may adjust these
          limits without notice; we will not make them less generous for
          already-paying customers within their billing cycle.
        </p>

        <h2>3. Paid tier (Team / Business)</h2>
        <p>
          Paid subscriptions are processed by Polar (Polar Labs, Inc.) under
          their terms. On successful payment we issue an axle API key by
          email, scoped to the purchasing email address. The key unlocks
          unlimited hosted scans, Claude-generated AI fix suggestions via our
          infrastructure, and the ability to publish verified accessibility
          statements at <code>/s/&lt;id&gt;</code>. Cancel at any time — you
          keep access through the end of the paid period.
        </p>

        <h2>4. What axle is not</h2>
        <p>
          axle is a remediation-assistance tool. It is not a compliance
          certificate, is not legal advice, and is not a substitute for a
          human accessibility audit. Automated tools, including axe-core
          4.11, catch roughly 57% of WCAG issues — a manual review is
          still recommended for full conformance.
        </p>

        <h2>5. Your responsibilities</h2>
        <ul>
          <li>
            Only submit URLs that you own or have permission to scan. Do not
            use the hosted scanner to test third-party sites without their
            consent.
          </li>
          <li>
            Do not attempt to circumvent rate limits via VPN, proxy, or
            multiple accounts. A good-faith single-user use of the free tier
            is fine; industrialized circumvention is not.
          </li>
          <li>
            Keep your API key private. You are responsible for usage billed
            against a key you issued.
          </li>
        </ul>

        <h2>6. Acceptable use</h2>
        <p>
          No scanning of content that is illegal in your jurisdiction. No
          attempts to disrupt, probe, or reverse-engineer the hosted service
          beyond what is necessary for normal product use. No reselling the
          hosted API as a service without a separate written agreement.
        </p>

        <h2>7. Data</h2>
        <p>
          See the{" "}
          <a className="underline" href="/privacy">
            privacy policy
          </a>{" "}
          for what data we collect and how long we keep it.
        </p>

        <h2>8. Termination</h2>
        <p>
          We may suspend access to the hosted service for any user who violates
          these terms. For paying customers, we will refund the unused portion
          of the current billing period on such suspension unless the
          termination is for abuse.
        </p>

        <h2>9. Warranty disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY
          KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
          WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h2>10. Liability</h2>
        <p>
          To the extent permitted by law, our aggregate liability arising out
          of or relating to the service is capped at the greater of (a) the
          amount you paid us in the 12 months preceding the claim, or (b) $100
          USD.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          .
        </p>
      </article>
    </main>
  );
}

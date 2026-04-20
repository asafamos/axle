import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What axle collects, how long we keep it, and what we never do with it.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose prose-slate max-w-none">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Legal
        </p>
        <h1>Privacy policy</h1>
        <p className="text-sm text-slate-500">
          Last updated: 20 April 2026
        </p>

        <h2>Plain-English summary</h2>
        <ul>
          <li>
            We scan URLs you ask us to scan and return the results. We do not
            store the scanned pages, and we do not track your site&apos;s
            visitors.
          </li>
          <li>
            We count usage events (scans, page views, CLI pings) without any
            personal identifiers — only a rough source tag such as{" "}
            <code>axle-cli</code> or <code>axle-wordpress</code>.
          </li>
          <li>
            If you subscribe to a paid plan, we store your email, the hash of
            your API key, and your subscription status so we can issue keys and
            grant access. Payments are processed by Polar; we never see your
            card details.
          </li>
          <li>
            If you publish a verified accessibility statement, its contents
            (organization name, coordinator details, etc. that <em>you</em>{" "}
            entered in the generator) are stored and rendered publicly at{" "}
            <code>/s/&lt;id&gt;</code>. That is the point of publishing.
          </li>
        </ul>

        <h2>What we collect</h2>
        <h3>Scan data</h3>
        <p>
          When you submit a URL to <code>/api/scan</code> (via the web form,
          CLI, Action, or any of the platform plugins), we fetch that URL with
          a headless browser, run axe-core against it, and return the result.
          We do not cache or store the scanned page&apos;s HTML, screenshots,
          or the scan result on our server. The result lives in the HTTP
          response only.
        </p>

        <h3>Anonymous usage metrics</h3>
        <p>
          We count per-day and per-all-time:
        </p>
        <ul>
          <li>Total scans</li>
          <li>Total scans grouped by source (<code>web</code>, <code>axle-cli</code>, <code>axle-action</code>, <code>axle-netlify</code>, <code>axle-cloudflare</code>, <code>axle-vercel</code>, <code>axle-wordpress</code>, etc.)</li>
          <li>Total page views on the hosted site and the published statement pages</li>
          <li>Per-IP daily scan count, for rate limiting only — rotates every 36 hours</li>
        </ul>
        <p>
          None of this is tied to a named individual. We do not set any
          third-party analytics cookies. The CLI sends one anonymous ping per
          scan (<code>{"{source: 'axle-cli', event: 'scan_complete'}"}</code>) which you
          can disable with <code>AXLE_NO_TELEMETRY=1</code>.
        </p>

        <h3>Account / billing data (paid plans only)</h3>
        <p>
          If you subscribe to Team or Business:
        </p>
        <ul>
          <li>Your email (captured by Polar at checkout and forwarded to us)</li>
          <li>Your Polar customer ID and subscription ID</li>
          <li>The SHA-256 hash of your axle API key (never the plaintext)</li>
          <li>Your plan name and subscription status</li>
        </ul>
        <p>
          Card data is held by Polar. We never receive it.
        </p>

        <h3>Published statement contents</h3>
        <p>
          When you click &quot;Publish verified&quot; on the statement generator,
          everything you filled into the form — organization name, coordinator
          details, adjustments list, reporting channels — is stored and made
          publicly available at <code>/s/&lt;id&gt;</code>. Don&apos;t publish
          anything you wouldn&apos;t want indexed by Google.
        </p>

        <h2>What we never do</h2>
        <ul>
          <li>We do not inject tracking into your site&apos;s pages.</li>
          <li>We do not sell data to third parties.</li>
          <li>We do not use your scan data to train models.</li>
          <li>
            We do not store URLs you scan beyond the duration of the scan
            itself (except for aggregated source counters).
          </li>
        </ul>

        <h2>Subprocessors</h2>
        <p>We rely on the following infrastructure vendors:</p>
        <ul>
          <li>
            <strong>Vercel</strong> — application hosting (US, EU). Serves the
            Next.js app and runs the scan workers.
          </li>
          <li>
            <strong>Upstash (Redis)</strong> — keeps aggregated counters and
            hashed API keys.
          </li>
          <li>
            <strong>Polar</strong> — checkout and subscription management for
            paid plans.
          </li>
          <li>
            <strong>Resend</strong> — transactional email (the one that delivers
            your API key after checkout).
          </li>
          <li>
            <strong>Anthropic</strong> — when you enable hosted AI fixes, the
            violation text and offending HTML snippet are sent to Anthropic
            Claude for diff generation. Anthropic&apos;s API is{" "}
            <a
              className="underline"
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener"
            >
              no-training by default
            </a>{" "}
            for API traffic.
          </li>
        </ul>

        <h2>Data retention</h2>
        <ul>
          <li>Per-day scan and view counters: 48 hours.</li>
          <li>Per-source all-time counters: indefinite, no personal data.</li>
          <li>
            API key records: lifetime of subscription + 90 days after cancellation.
          </li>
          <li>
            Published statements: indefinite, until you ask us to remove them
            by emailing{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>
          If you are in the EU, UK, Israel, or another jurisdiction with a
          right-to-access / right-to-delete regime, email{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          . We will respond within 30 days. Given the minimal data surface,
          most requests can be handled by simply deleting your API key record
          and any statements you&apos;ve published.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy-related questions:{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          .
        </p>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle docs — install, configure, and ship a11y CI",
  description:
    "Technical documentation for axle: GitHub Action setup, npm CLI usage, Netlify / Cloudflare / Vercel plugin install, configuration reference, JSON output schema, AI fix flow, and CI patterns for monorepos / preview URLs / multi-page scans.",
  keywords: [
    "axle docs",
    "axle documentation",
    "axle GitHub Action setup",
    "axle CLI",
    "axe-core CI",
    "axle configuration",
  ],
  openGraph: {
    title: "axle docs — install, configure, ship a11y CI",
    description:
      "Technical documentation for the axle a11y / WCAG 2.2 AA scanner.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · docs
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          axle docs
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Everything you need to install, configure, and operate axle in CI.
          axle is one engine (axe-core 4.11) shipped through five surfaces —
          GitHub Action, npm CLI, Netlify / Cloudflare Pages / Vercel plugins,
          and a WordPress plugin. The configuration shape is identical across
          surfaces so you only learn it once.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#quickstart">Quick start (60 seconds)</a></li>
            <li><a className="hover:underline" href="#github-action">GitHub Action</a></li>
            <li><a className="hover:underline" href="#cli">npm CLI</a></li>
            <li><a className="hover:underline" href="#hosting-plugins">Netlify / Cloudflare / Vercel</a></li>
            <li><a className="hover:underline" href="#wordpress">WordPress plugin</a></li>
            <li><a className="hover:underline" href="#config">Configuration reference</a></li>
            <li><a className="hover:underline" href="#output">Output format</a></li>
            <li><a className="hover:underline" href="#ai-fixes">AI fixes</a></li>
            <li><a className="hover:underline" href="#patterns">Common patterns (preview URLs, monorepos, multi-URL)</a></li>
            <li><a className="hover:underline" href="#troubleshooting">Troubleshooting</a></li>
            <li><a className="hover:underline" href="#api-key">API key + auth</a></li>
          </ol>
        </nav>

        <section id="quickstart" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Quick start</h2>
          <p className="mt-3 text-slate-700">
            Add to <code>.github/workflows/accessibility.yml</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`name: Accessibility
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1
        with:
          url: \${{ secrets.PREVIEW_URL }}
          fail-on: serious`}
          </pre>
          <p className="mt-3 text-slate-700">
            That&apos;s it. The Action will scan the URL, post a sticky PR
            comment with violations grouped by severity, and exit non-zero if
            any violation crosses your <code>fail-on</code> threshold. AI
            fixes are off by default — see the AI section below to enable.
          </p>
        </section>

        <section id="github-action" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">GitHub Action</h2>
          <p className="mt-3 text-slate-700">
            Marketplace listing:{" "}
            <a className="underline" href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci" target="_blank" rel="noopener">
              axle — a11y / WCAG Accessibility CI
            </a>
            . Source: <code>asafamos/axle-action</code>. Pin to <code>@v1</code>{" "}
            for major-version stability or to a specific tag like{" "}
            <code>@v1.1.0</code> for exact reproducibility.
          </p>

          <h3 className="mt-5 text-lg font-bold text-slate-900">Two scan modes</h3>
          <p className="mt-2 text-slate-700">
            <strong>External URL.</strong> Pass <code>url</code>. Useful when
            your PR has a preview URL from Vercel / Netlify / Cloudflare /
            Render etc.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`- uses: asafamos/axle-action@v1
  with:
    url: https://preview-\${{ github.event.pull_request.number }}.example.com
    fail-on: serious`}
          </pre>
          <p className="mt-4 text-slate-700">
            <strong>Build-and-serve locally.</strong> Leave <code>url</code>{" "}
            empty. The Action runs <code>install-command</code> →{" "}
            <code>build-command</code> → <code>start-command</code> in the
            background, waits for the port, and scans <code>localhost:PORT</code>.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`- uses: asafamos/axle-action@v1
  with:
    install-command: npm ci
    build-command: npm run build
    start-command: npm start
    wait-on-port: "3000"
    fail-on: serious`}
          </pre>
        </section>

        <section id="cli" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">npm CLI</h2>
          <p className="mt-3 text-slate-700">
            Same engine as the Action, runs anywhere Node 20+ runs. Useful
            for GitLab / Jenkins / CircleCI / Buildkite / Bitbucket / local dev.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`# one-shot
npx axle-cli scan https://example.com --fail-on serious

# with AI fixes (requires ANTHROPIC_API_KEY env)
npx axle-cli scan https://example.com \\
  --fail-on serious \\
  --with-ai-fixes true \\
  --max-ai-fixes 10 \\
  --json-out axle-report.json \\
  --markdown-out axle-report.md

# install globally
npm i -g axle-cli
axle-cli scan https://example.com`}
          </pre>
          <p className="mt-3 text-slate-700">
            Exit codes: <code>0</code> — passing at threshold. <code>1</code> —
            violations at or above threshold. <code>2</code> — invalid
            arguments / fatal error.
          </p>
        </section>

        <section id="hosting-plugins" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Netlify / Cloudflare Pages / Vercel
          </h2>
          <p className="mt-3 text-slate-700">
            Each hosting plugin runs the scan against the platform&apos;s
            preview URL on every deploy and fails the deploy if the threshold
            is crossed.
          </p>

          <h3 className="mt-4 text-lg font-bold text-slate-900">Netlify</h3>
          <p className="mt-2 text-slate-700">
            Add to <code>netlify.toml</code>:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`[[plugins]]
package = "axle-netlify-plugin"

  [plugins.inputs]
  fail-on = "serious"`}
          </pre>

          <h3 className="mt-4 text-lg font-bold text-slate-900">Cloudflare Pages</h3>
          <p className="mt-2 text-slate-700">
            Add as a Worker bound to <code>onPostDeploy</code>. See the{" "}
            <a className="underline" href="https://www.npmjs.com/package/axle-cloudflare-plugin" target="_blank" rel="noopener">
              axle-cloudflare-plugin README
            </a>
            .
          </p>

          <h3 className="mt-4 text-lg font-bold text-slate-900">Vercel</h3>
          <p className="mt-2 text-slate-700">
            Add a build step in <code>vercel.json</code>:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`{
  "buildCommand": "next build && npx axle-vercel-plugin"
}`}
          </pre>
        </section>

        <section id="wordpress" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">WordPress plugin</h2>
          <p className="mt-3 text-slate-700">
            Different model — runs in the WP admin via a hidden iframe + the
            bundled axe-core build. No outbound calls. Install from the
            WordPress.org plugin directory (search &ldquo;axle&rdquo; or
            &ldquo;a11y scanner&rdquo;) once approved, or upload the ZIP from
            the source repo.
          </p>
        </section>

        <section id="config" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Configuration reference</h2>
          <p className="mt-3 text-slate-700">
            All inputs accepted by the Action (CLI uses the same flags with
            <code>--kebab-case</code>):
          </p>
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2 pe-3">Input</th>
                <th className="py-2 pe-3">Default</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 [&_td]:border-b [&_td]:border-slate-100 [&_td]:py-2 [&_td]:pe-3 [&_td]:align-top">
              <tr>
                <td><code>url</code></td>
                <td><code>&quot;&quot;</code></td>
                <td>External URL to scan. If empty, build + start locally.</td>
              </tr>
              <tr>
                <td><code>fail-on</code></td>
                <td><code>serious</code></td>
                <td><code>critical | serious | moderate | minor | none</code>. Threshold above which the run fails.</td>
              </tr>
              <tr>
                <td><code>with-ai-fixes</code></td>
                <td><code>false</code></td>
                <td>Generate Claude fix diffs in the PR comment. Requires <code>anthropic-api-key</code>.</td>
              </tr>
              <tr>
                <td><code>max-ai-fixes</code></td>
                <td><code>10</code></td>
                <td>Cost guard — caps Claude calls per run.</td>
              </tr>
              <tr>
                <td><code>anthropic-api-key</code></td>
                <td>—</td>
                <td>Anthropic API key. Pass as a repository secret. Required when <code>with-ai-fixes: true</code>.</td>
              </tr>
              <tr>
                <td><code>anthropic-model</code></td>
                <td><code>claude-sonnet-4-6</code></td>
                <td>Override the model used for fix generation.</td>
              </tr>
              <tr>
                <td><code>github-token</code></td>
                <td><code>github.token</code></td>
                <td>Used to post the PR comment. Default workflow token works if you set <code>pull-requests: write</code>.</td>
              </tr>
              <tr>
                <td><code>comment-on-pr</code></td>
                <td><code>true</code></td>
                <td>Post / update the sticky comment on the triggering PR.</td>
              </tr>
              <tr>
                <td><code>install-command</code></td>
                <td><code>npm ci</code></td>
                <td>Used only when <code>url</code> is empty.</td>
              </tr>
              <tr>
                <td><code>build-command</code></td>
                <td><code>npm run build</code></td>
                <td>Used only when <code>url</code> is empty.</td>
              </tr>
              <tr>
                <td><code>start-command</code></td>
                <td><code>npm start</code></td>
                <td>Used only when <code>url</code> is empty. Backgrounded.</td>
              </tr>
              <tr>
                <td><code>wait-on-port</code></td>
                <td><code>3000</code></td>
                <td>Port to wait for before scanning <code>localhost:PORT</code>.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="output" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Output format</h2>
          <p className="mt-3 text-slate-700">
            Two artifacts are emitted on every run: <code>axle-report.json</code>{" "}
            (machine-readable) and <code>axle-report.md</code> (human-readable).
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`{
  "url": "https://example.com",
  "scanned_at": "2026-04-27T14:00:00.000Z",
  "engine": "axe-core@4.11.3",
  "summary": {
    "violations": 7,
    "critical": 1,
    "serious": 3,
    "moderate": 2,
    "minor": 1,
    "passes": 142
  },
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "wcag": ["1.4.3"],
      "help": "Elements must have sufficient color contrast",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast",
      "nodes": [
        {
          "html": "<button class='cta'>...</button>",
          "target": [".hero > .cta"],
          "failureSummary": "Element has insufficient color contrast of 2.85"
        }
      ]
    }
  ]
}`}
          </pre>
          <p className="mt-3 text-slate-700">
            The schema is stable across major versions. WCAG mappings come
            from axe-core&apos;s own metadata (we don&apos;t re-tag).
          </p>
        </section>

        <section id="ai-fixes" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">AI fixes</h2>
          <p className="mt-3 text-slate-700">
            With <code>with-ai-fixes: true</code> + an Anthropic API key, axle
            sends each violation&apos;s offending HTML and the rule metadata
            to Claude Sonnet, which returns a unified diff suggestion. The
            diff appears inline in the PR comment. <strong>axle never commits
            anything autonomously</strong> — a human reviews and merges (or
            edits) the suggestion.
          </p>
          <p className="mt-3 text-slate-700">
            Anthropic&apos;s API does not train on this data per their
            enterprise API terms. On the Business plan we add a
            zero-retention pass-through flag so prompts aren&apos;t logged.
          </p>
          <p className="mt-3 text-slate-700">
            The cap is <code>max-ai-fixes</code> (default 10) per run. Hosted
            AI on Team / Business plans pulls from a monthly budget — see{" "}
            <Link href="/pricing" className="underline">
              pricing
            </Link>
            .
          </p>
        </section>

        <section id="patterns" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Common patterns</h2>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Vercel preview URL per PR
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`- uses: asafamos/axle-action@v1
  with:
    url: https://\${{ github.event.pull_request.head.ref }}-\${{ secrets.VERCEL_PROJECT }}.vercel.app
    fail-on: serious`}
          </pre>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Multiple URLs (one job per page)
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`jobs:
  a11y:
    strategy:
      matrix:
        path: [/, /pricing, /signup, /checkout]
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1
        with:
          url: \${{ secrets.PREVIEW_BASE }}\${{ matrix.path }}
          fail-on: serious`}
          </pre>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Monorepo (only run when frontend changes)
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`on:
  pull_request:
    paths:
      - 'apps/web/**'
      - 'packages/ui/**'`}
          </pre>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Authenticated routes
          </h3>
          <p className="mt-2 text-slate-700">
            For routes that require login, run the Action against a
            test-user-authenticated preview URL (Playwright fixture) rather
            than reproducing auth in the Action itself. We&apos;re working on
            a lightweight cookie-pass-through option for v2.
          </p>
        </section>

        <section id="troubleshooting" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Troubleshooting</h2>

          <details className="mt-3 rounded-md border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">
              The Action runs but fails immediately with a Chromium error
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              This usually means the Playwright cache wasn&apos;t restored. The
              first run on a runner downloads ~150MB of Chromium; subsequent
              runs use the cache. Add <code>--with-deps</code> if running on a
              non-Ubuntu runner — but most issues resolve by waiting through
              the first cold run.
            </p>
          </details>

          <details className="mt-3 rounded-md border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">
              No PR comment appears
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Workflow needs <code>permissions: pull-requests: write</code>.
              For forked-PR workflows, the default <code>github.token</code>{" "}
              has read-only permissions; use a PAT with
              <code>pull-requests: write</code> as <code>github-token</code>.
            </p>
          </details>

          <details className="mt-3 rounded-md border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">
              Scan times out / runs too slowly
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Cold runs take ~90s including browser install. If your run is
              materially slower, check <code>wait-on-port</code> — if the app
              isn&apos;t serving on that port, the Action waits until timeout
              before failing. Verify <code>start-command</code> actually
              binds to the expected port.
            </p>
          </details>

          <details className="mt-3 rounded-md border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">
              False positives on a known-OK pattern
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              axe-core rules can be disabled per-violation via{" "}
              <code>data-axe-ignore</code> attributes — but please don&apos;t
              do this casually. axe-core is calibrated for zero false
              positives at <em>serious</em>+ severity. If you genuinely have
              a false positive, file an issue at{" "}
              <a className="underline" href="https://github.com/dequelabs/axe-core/issues" target="_blank" rel="noopener">
                axe-core
              </a>{" "}
              upstream.
            </p>
          </details>
        </section>

        <section id="api-key" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">API key + auth</h2>
          <p className="mt-3 text-slate-700">
            The Open plan needs no axle API key — the Action and CLI run with
            no axle credentials. AI fixes use your own Anthropic key directly.
          </p>
          <p className="mt-3 text-slate-700">
            Team and Business plans get an <code>AXLE_API_KEY</code> by email
            after subscription. Use it as:
          </p>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-sm text-slate-700">
            <li>GitHub Action: pass as <code>axle-api-key: ${`{{ secrets.AXLE_API_KEY }}`}</code>.</li>
            <li>CLI: <code>export AXLE_API_KEY=&lt;key&gt;</code> before running.</li>
            <li>Web: paste at <Link href="/account" className="underline">/account</Link> once to unlock unlimited fixes in the browser scan.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Lost the key? It&apos;s in the welcome email under subject
            &ldquo;Your axle API key&rdquo;. If you can&apos;t find it, email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>{" "}
            with the email used at checkout.
          </p>
        </section>

        <section className="mt-12 flex flex-wrap gap-3">
          <a
            href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Install GitHub Action →
          </a>
          <a
            href="https://www.npmjs.com/package/axle-cli"
            target="_blank"
            rel="noopener"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            axle-cli on npm
          </a>
          <Link
            href="/pricing"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Pricing
          </Link>
          <Link
            href="/free-scan"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Free scan
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 27 April 2026.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            Documentation feedback
          </a>{" "}
          welcome.
        </footer>
      </article>
    </main>
  );
}

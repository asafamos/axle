import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle integrations — Slack, Linear, Jira, GitHub, GitLab",
  description:
    "Wire axle WCAG scan results into the tools your team already uses. Slack notifications on scan completion, Linear / Jira issues auto-created from violations, GitHub / GitLab PR comments. Webhook-based, OpenAPI-documented.",
  keywords: [
    "axle Slack integration",
    "axle Linear integration",
    "axle Jira integration",
    "accessibility Slack notifications",
    "WCAG Linear automation",
    "axle webhook",
    "axle",
  ],
  openGraph: {
    title: "axle integrations — Slack, Linear, Jira, GitHub, GitLab",
    description:
      "Wire axle scan results into the tools your team already uses.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/integrations" },
};

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · integrations
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Wire axle into the tools your team uses
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Scan results are useful only when they reach the human who can act
          on them. axle ships with PR-comment integration out of the box, and
          the JSON output is structured so you can route it anywhere — Slack,
          Linear, Jira, your team&apos;s own dashboard. This page documents
          the recipes.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Already-supported (out of the box)
          </h2>

          <Integration
            title="GitHub PRs"
            status="Built-in"
            body={
              <>
                <p>
                  The{" "}
                  <a
                    className="underline"
                    href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
                    target="_blank"
                    rel="noopener"
                  >
                    axle GitHub Action
                  </a>{" "}
                  posts a sticky comment on every pull request with the full
                  violation breakdown. AI-fix diffs (with{" "}
                  <code>with-ai-fixes: true</code>) appear inline in the same
                  comment. No setup beyond adding the workflow file.
                </p>
              </>
            }
          />

          <Integration
            title="Vercel / Netlify / Cloudflare Pages"
            status="Built-in"
            body={
              <p>
                Each hosting provider has a dedicated plugin (
                <code>axle-vercel-plugin</code>, <code>axle-netlify-plugin</code>,{" "}
                <code>axle-cloudflare-plugin</code>) that runs against the
                preview URL on every deploy and fails the build on
                serious-severity regressions. See the{" "}
                <Link href="/docs" className="underline">
                  docs
                </Link>{" "}
                for setup.
              </p>
            }
          />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Recipes (DIY for now — first-class integration on the roadmap)
          </h2>

          <Integration
            title="Slack — notify on scan failure"
            status="Recipe"
            body={
              <>
                <p>
                  axle&apos;s GitHub Action exposes the scan output as job
                  outputs. Pipe it into Slack with the standard{" "}
                  <code>slackapi/slack-github-action</code>:
                </p>
                <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`- uses: asafamos/axle-action@v1
  id: axle
  with:
    url: \${{ secrets.PREVIEW_URL }}
    fail-on: serious

- if: \${{ failure() && steps.axle.outputs.failing == 'true' }}
  uses: slackapi/slack-github-action@v2
  with:
    channel-id: 'C0XXXXXXX'
    payload: |
      {
        "text": ":warning: a11y regression on \${{ github.event.pull_request.html_url }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*axle CI failed on PR #\${{ github.event.pull_request.number }}*\\nPRevent merge until WCAG violations resolved."
            }
          }
        ]
      }
  env:
    SLACK_BOT_TOKEN: \${{ secrets.SLACK_BOT_TOKEN }}`}
                </pre>
              </>
            }
          />

          <Integration
            title="Linear — auto-create issues from violations"
            status="Recipe"
            body={
              <>
                <p>
                  Parse the JSON output and POST to Linear&apos;s GraphQL API.
                  Each <strong>serious or critical</strong> violation becomes
                  a Linear issue tagged <code>a11y</code>. Use the issue title
                  pattern <code>[a11y] {`<rule_id>`} on{" "}
                  {`<page_path>`}</code> so duplicates are auto-merged when
                  the rule appears on the same path next scan:
                </p>
                <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`- uses: asafamos/axle-action@v1
  id: axle
  with:
    url: \${{ secrets.PREVIEW_URL }}
    json-out: axle-report.json

- if: \${{ steps.axle.outputs.failing == 'true' }}
  run: |
    cat axle-report.json | jq -c '.violations[] | select(.impact == "serious" or .impact == "critical")' | while read v; do
      title="[a11y] $(echo "$v" | jq -r '.id') on /\${{ github.head_ref }}"
      body=$(echo "$v" | jq -r '"WCAG: " + (.tags | join(", ")) + "\\n\\n" + .help + "\\n\\nFix: " + .helpUrl')
      curl -s -X POST "https://api.linear.app/graphql" \\
        -H "Authorization: \${{ secrets.LINEAR_API_KEY }}" \\
        -H "Content-Type: application/json" \\
        -d "{\\"query\\":\\"mutation { issueCreate(input: { teamId: \\\\\\"\${{ secrets.LINEAR_TEAM_ID }}\\\\\\", title: \\\\\\"$title\\\\\\", description: \\\\\\"$body\\\\\\", labelIds: [\\\\\\"\${{ secrets.LINEAR_A11Y_LABEL }}\\\\\\"] }) { success } }\\"}"
    done`}
                </pre>
              </>
            }
          />

          <Integration
            title="Jira — same idea, REST API"
            status="Recipe"
            body={
              <p>
                Jira&apos;s REST API (<code>POST /rest/api/3/issue</code>)
                takes a similar JSON payload. Authenticate with a Jira API
                token + email pair as Basic auth. The same
                violation-to-issue script structure works — just swap the
                Linear GraphQL call for the Jira REST call. Email{" "}
                <a className="underline" href="mailto:asaf@amoss.co.il">
                  asaf@amoss.co.il
                </a>{" "}
                if you want a starter template for your specific Jira
                workflow.
              </p>
            }
          />

          <Integration
            title="GitLab CI"
            status="Recipe"
            body={
              <>
                <p>
                  Use the <code>axle-cli</code> npm package directly in
                  <code>.gitlab-ci.yml</code>:
                </p>
                <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`a11y:
  image: node:20
  stage: test
  script:
    - npx axle-cli scan $PREVIEW_URL --fail-on serious
    - mv axle-report.json gitlab-a11y-report.json
  artifacts:
    when: always
    reports:
      junit: gitlab-a11y-report.json
    paths:
      - gitlab-a11y-report.json`}
                </pre>
              </>
            }
          />
        </section>

        <section className="mt-12 rounded-lg border-l-4 border-slate-400 bg-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            What&apos;s on the roadmap as first-class integrations
          </h2>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-sm text-slate-800">
            <li>Native Slack app — install once, axle posts directly without GitHub Action plumbing</li>
            <li>Native Linear / Jira / Asana app — same idea, no copy-paste</li>
            <li>Webhook endpoint per axle account — POST scan results to your own URL</li>
            <li>Datadog / Honeycomb / Sentry export — accessibility regressions as observability events</li>
            <li>Storybook addon — scan stories during dev</li>
          </ul>
          <p className="mt-3 text-sm text-slate-700">
            Vote / request priority by emailing{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il?subject=axle%20integration%20request">
              asaf@amoss.co.il
            </a>
            . The thing customers ask for first is the thing we build first.
          </p>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://axle-iota.vercel.app/openapi.yaml"
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            OpenAPI spec
          </a>
          <Link
            href="/docs"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Full docs
          </Link>
          <Link
            href="/gpt"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            ChatGPT / Claude tool
          </Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 7 May 2026.
        </footer>
      </article>
    </main>
  );
}

function Integration({
  title,
  status,
  body,
}: {
  title: string;
  status: "Built-in" | "Recipe" | "Roadmap";
  body: React.ReactNode;
}) {
  const badge =
    status === "Built-in"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Recipe"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700";
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
          {status}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-700">{body}</div>
    </div>
  );
}

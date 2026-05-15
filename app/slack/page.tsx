import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "axle for Slack — /axle scan https://example.com in any channel",
  description:
    "Add axle to your Slack workspace. Run /axle scan https://example.com in any channel and get a WCAG 2.2 AA accessibility report posted inline with a shareable certificate URL.",
  keywords: [
    "axle slack",
    "slack accessibility scanner",
    "WCAG slack bot",
    "accessibility slack integration",
    "axle",
  ],
  openGraph: {
    title: "axle for Slack — accessibility scanning as a slash command",
    description:
      "/axle scan https://example.com — WCAG 2.2 AA report in your channel.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/slack" },
};

const CLIENT_ID = process.env.SLACK_CLIENT_ID || "";
const SCOPES = "commands,chat:write,chat:write.public";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";
const INSTALL_URL = CLIENT_ID
  ? `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(
      `${SITE_URL}/api/slack/oauth`,
    )}`
  : null;

export default function SlackPage({
  searchParams,
}: {
  searchParams?: { installed?: string; install_error?: string };
}) {
  const justInstalled = searchParams?.installed === "1";
  const installError = searchParams?.install_error;

  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · Slack integration
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          axle for Slack
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Drop{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-base text-slate-900">
            /axle scan https://example.com
          </code>{" "}
          into any channel and axle posts the WCAG 2.1 / 2.2 AA report inline.
          Severity-grouped violations, the top three rules, and a
          one-click button to the public certificate page at{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">
            /r/&lt;id&gt;
          </code>
          .
        </p>

        {justInstalled ? (
          <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
            ✓ axle is installed in your workspace. Try{" "}
            <code className="rounded bg-emerald-100 px-1 py-0.5">/axle scan https://example.com</code>
            {" "}in any channel.
          </div>
        ) : null}

        {installError ? (
          <div className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-900">
            Install failed: {installError}. Try again or reach out to{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </div>
        ) : null}

        <div className="mt-8 rounded-lg border border-slate-300 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Install</h2>
          {INSTALL_URL ? (
            <>
              <p className="mt-3 text-slate-700">
                Click below, approve in your workspace, done. We request three
                scopes:{" "}
                <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                  commands
                </code>
                ,{" "}
                <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                  chat:write
                </code>
                , and{" "}
                <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                  chat:write.public
                </code>
                . axle <strong>cannot</strong> read messages or DMs.
              </p>
              <a
                href={INSTALL_URL}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
              >
                Add to Slack →
              </a>
            </>
          ) : (
            <>
              <p className="mt-3 text-slate-700">
                The hosted Slack listing is in the pipeline. While it&apos;s
                under review, you can self-host:
              </p>
              <ol className="mt-3 list-decimal space-y-1 pl-6 text-slate-800">
                <li>
                  Open{" "}
                  <a
                    className="underline"
                    href="https://api.slack.com/apps"
                    target="_blank"
                    rel="noopener"
                  >
                    api.slack.com/apps
                  </a>{" "}
                  → <strong>Create New App</strong> → <strong>From manifest</strong>
                </li>
                <li>
                  Paste in the manifest from{" "}
                  <a
                    className="underline"
                    href="https://github.com/asafamos/axle/blob/main/packages/axle-slack/manifest.yaml"
                    target="_blank"
                    rel="noopener"
                  >
                    packages/axle-slack/manifest.yaml
                  </a>
                </li>
                <li>
                  Set{" "}
                  <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                    SLACK_SIGNING_SECRET
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                    SLACK_CLIENT_ID
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
                    SLACK_CLIENT_SECRET
                  </code>{" "}
                  in your axle deployment
                </li>
                <li>Install to workspace from the Slack App admin</li>
              </ol>
            </>
          )}
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          What it looks like
        </h2>
        <p className="mt-2 text-slate-700">
          Slash command response is posted in the channel where you ran it.
          Severity grid + top-three violations + a one-click button to the
          full certificate page:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
{`@you  /axle scan https://example.com
@axle :mag: Scanning https://example.com for WCAG 2.2 AA violations...
@axle :warning: https://example.com
       4 violations · :red_circle: 1 critical · :large_orange_circle: 2 serious
                    · :large_yellow_circle: 1 moderate

       CRITICAL — color-contrast · Insufficient color contrast (3 elements)
       SERIOUS  — image-alt · Images must have alternate text (8 elements)
       SERIOUS  — label · Form elements must have labels (2 elements)

       [ Full report ]  [ How to fix ]`}
        </pre>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Privacy</h2>
        <p className="mt-2 text-slate-700">
          axle requests only the scopes needed to receive a slash command and
          post a reply. It does <strong>not</strong> have access to channel
          history, DMs, files, or member info. The only data leaving Slack is
          the URL you explicitly type after{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">
            /axle scan
          </code>
          .
        </p>
        <p className="mt-3 text-slate-700">
          Full privacy policy:{" "}
          <Link className="underline" href="/privacy">
            /privacy
          </Link>{" "}
          · Terms:{" "}
          <Link className="underline" href="/terms">
            /terms
          </Link>
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Pricing
        </h2>
        <p className="mt-2 text-slate-700">
          5 scans per day per workspace on the free tier — same as the rest of
          axle. Team ($49/mo) and Business ($299/mo) plans remove the limit
          and unlock multi-repo features. See{" "}
          <Link className="underline" href="/pricing">
            /pricing
          </Link>
          .
        </p>

        <hr className="my-12 border-slate-300" />
        <p className="text-sm text-slate-600">
          Source / configs:{" "}
          <a
            className="underline"
            href="https://github.com/asafamos/axle/tree/main/packages/axle-slack"
            target="_blank"
            rel="noopener"
          >
            packages/axle-slack
          </a>
          . Want axle in Linear / Jira / Discord too?{" "}
          <Link className="underline" href="/integrations">
            /integrations
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

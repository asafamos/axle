import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a 15-min demo — see axle on your actual codebase",
  description:
    "Skip the marketing pages. Get a 15-min Zoom call with axle's founder, run a scan on your repo live, and decide if it solves the gap between your audits.",
  keywords: [
    "axle demo",
    "axle call",
    "accessibility CI demo",
    "WCAG scanner trial",
    "axle",
  ],
  openGraph: {
    title: "Book a 15-min demo with axle",
    description:
      "Run a scan on your actual repo, see Claude open the fix PRs, decide in 15 minutes.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/demo" },
};

const MAILTO = `mailto:asaf@amoss.co.il?subject=${encodeURIComponent(
  "axle — 15-min demo call",
)}&body=${encodeURIComponent(
  [
    "Hi Asaf,",
    "",
    "I'd like a 15-min demo of axle. A few details so the call is useful:",
    "",
    "1. Company / project: ",
    "2. Stack (Next.js / React / Vue / WordPress / other): ",
    "3. Repo URL (private OK, can share access during call): ",
    "4. EAA / ADA / Section 508 — which regulatory pressure is driving this? ",
    "5. Best 3 time slots for me this week (timezone too): ",
    "",
    "Thanks,",
  ].join("\n"),
)}`;

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          axle · book a demo
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          15 minutes. Your actual repo. A real answer.
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Most accessibility tooling decisions get stuck in a 6-week
          procurement loop. We&apos;d rather just show you axle running on your
          codebase, see if it solves the gap you have, and you decide. 15
          minutes, Zoom, no slides, no pitch.
        </p>

        <div className="mt-8 rounded-lg border border-slate-300 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            What you&apos;ll see in 15 minutes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-800">
            <li>
              A live scan of your URL with axe-core 4.11 — same engine the
              GitHub Action and the MCP server run.
            </li>
            <li>
              Walk-through of one Claude-generated fix suggestion against your
              actual HTML — judgment call on whether the suggestion is
              mergeable for your codebase.
            </li>
            <li>
              The auto-managed GitHub Issues mode demoed against a demo repo
              with real violations (your repo too, if you want).
            </li>
            <li>
              The MCP server installed live in Claude Desktop / Cursor so you
              can ask &ldquo;is X compliant&rdquo; from inside your editor.
            </li>
            <li>
              5 minutes of you asking adversarial questions. We&apos;d rather
              answer the hard ones now than later.
            </li>
          </ul>
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Book the call
        </h2>
        <p className="mt-2 text-slate-700">
          The hosted booking link is being set up. While we&apos;re between
          calendaring tools, email works fast — we reply within 24h and pick a
          slot in your timezone.
        </p>

        <a
          href={MAILTO}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
        >
          📅 Email to book — asaf@amoss.co.il
        </a>
        <p className="mt-3 text-sm text-slate-600">
          The email opens with a pre-filled form so we get the right context
          before the call. Replace the placeholders with one line each — it
          takes 90 seconds.
        </p>

        <hr className="my-10 border-slate-300" />

        <h2 className="text-2xl font-semibold text-slate-900">
          Don&apos;t need a call?
        </h2>
        <p className="mt-2 text-slate-700">
          Half the time, the answer is just &ldquo;install the GitHub Action
          and see what it catches.&rdquo; The free tier covers one repo
          forever:
        </p>
        <ul className="mt-3 space-y-2 text-slate-800">
          <li>
            <strong>
              <Link className="underline hover:text-slate-900" href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci" target="_blank">
                Install the GitHub Action →
              </Link>
            </strong>{" "}
            adds 5 lines to your workflow file.
          </li>
          <li>
            <strong>
              <Link className="underline hover:text-slate-900" href="/free-scan">
                Run a one-off scan →
              </Link>
            </strong>{" "}
            on the web with your URL, no signup.
          </li>
          <li>
            <strong>
              <Link className="underline hover:text-slate-900" href="/mcp">
                Install the MCP server →
              </Link>
            </strong>{" "}
            two-line config in Claude Desktop / Cursor / Cline.
          </li>
        </ul>

        <hr className="my-12 border-slate-300" />

        <p className="text-sm text-slate-600">
          Comparison-shopping?{" "}
          <Link className="underline" href="/why-axle">
            /why-axle
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/compare">
            /compare
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/case-studies">
            /case-studies
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/pricing">
            /pricing
          </Link>
        </p>
      </article>
    </main>
  );
}

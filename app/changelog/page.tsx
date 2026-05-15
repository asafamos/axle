import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of axle — the accessibility compliance CI for modern websites. Continuous WCAG 2.1 / 2.2 AA scanning, AI code fixes, and lawyer-ready artifacts.",
  alternates: { canonical: "/changelog" },
};

type Entry = {
  date: string; // ISO
  version: string;
  tag: "launch" | "feature" | "fix" | "infra";
  title: string;
  body: string[];
};

const ENTRIES: Entry[] = [
  {
    date: "2026-05-15",
    version: "0.5.0",
    tag: "feature",
    title: "Auto-managed GitHub Issues per violation + /case-studies",
    body: [
      "Opt-in create-issues mode on the axle-action — runs after the scan, opens one GitHub Issue per WCAG violation (deduped by axe rule + first-failing-node selector), updates the body when the violation changes, auto-closes when the violation no longer appears. Treat it like Renovate, but for accessibility.",
      "Issue body includes the WCAG criteria tags, the first failing element HTML and target selector, and the Claude-generated fix diff (when --with-ai-fixes is enabled). Impact tier becomes a label automatically.",
      "Net effect: a11y findings show up in the same triage flow as everything else (Linear / Jira / Notion sync via GitHub's native mirroring) instead of as an ephemeral PR thread.",
      "Shipped /case-studies — pre-launch early adopter signals (7 VSCode installs, 5★ rating, 5 GitHub stars on axle-action) framed honestly so prospects know exactly what stage we're at.",
    ],
  },
  {
    date: "2026-05-14",
    version: "0.4.0",
    tag: "feature",
    title: "/why-axle sales asset + sharper /compare row",
    body: [
      "New /why-axle landing — the focused sales asset for cold outreach. Leads with the real buyer objection (\"axe-core is free, why pay?\") and answers with four differentiators: Claude-generated source-code fix PRs, auto-managed GitHub Issues, MCP server, and EU multilingual statement pack. ROI math under each.",
      "Adds an \"When NOT to pay for axle\" honesty section. Costs nothing in conversions we wouldn't have lost anyway, signals trustworthiness to the Adrian Roselli / Funka / TPGi audience we're cold-emailing.",
      "Updated the axle row on /compare with the MCP server and 10-language statement pack so the comparison page tracks reality.",
    ],
  },
  {
    date: "2026-05-13",
    version: "0.3.0",
    tag: "feature",
    title: "axle-mcp — Model Context Protocol server for Claude / Cursor / Cline",
    body: [
      "Published axle-mcp@0.1.0 to npm — the only Model Context Protocol server for WCAG scanning. Wires axle into Claude Desktop, Cursor, Cline, and Continue.dev with one MCP config block. Two tools: scan_url and explain_violation.",
      "Launched the /mcp landing page with copy-paste configs for each MCP host. Cross-links from /gpt now point here instead of the old \"native MCP on roadmap\" placeholder.",
      "Bumped OpenAPI spec from 3.0.1 to 3.1.0 because the ChatGPT GPT builder hard-requires 3.1.x, and shortened the /api/scan operation description from 309 chars to 234 to fit the same builder's 300-char limit.",
    ],
  },
  {
    date: "2026-05-13",
    version: "0.2.0",
    tag: "feature",
    title: "axle-storybook addon + VS Code extension",
    body: [
      "Published axle-storybook@0.1.0 to npm — Storybook addon that runs axe-core 4.11 against every story and surfaces violations in a dedicated panel. Same engine as the CI, so what you see in chat matches what'll block the PR.",
      "Shipped the axle-a11y VS Code extension to the Microsoft Marketplace (asafamos.axle-a11y@0.1.0). Scan localhost or any URL from the command palette, view the report in a webview, share via /r/<id>.",
      "Added /integrations landing — copy-paste recipes for Slack, Linear, Jira, and GitLab CI. Bridges the gap between axle's JSON output and where your team actually triages.",
    ],
  },
  {
    date: "2026-05-07",
    version: "0.1.5",
    tag: "feature",
    title: "/lawyers vertical + /certified directory",
    body: [
      "Shipped /lawyers — dedicated vertical for ADA Title III defense and plaintiff law firms. Drop-in consent-decree language naming axle alongside Pa11y and Deque axe DevTools. 30% recurring partner program.",
      "Launched /certified — public directory of WCAG 2.2 AA-verified sites. Network-effect play. Bootstrap entry: axle-iota.vercel.app with permalink /r/PCFp1QGemnC184g2. 30-day re-verification cycle.",
      "ChatGPT GPT + Claude tool-use integration: /openapi.yaml + /.well-known/ai-plugin.json now live, /gpt landing with copy-paste recipes for both LLM ecosystems.",
    ],
  },
  {
    date: "2026-05-02",
    version: "0.1.2",
    tag: "feature",
    title: "/compare + own-goal contrast fix on homepage",
    body: [
      "Shipped /compare — honest side-by-side of axle vs Pa11y, Lighthouse CI, WAVE, axe DevTools, and accessiBe/UserWay/AudioEye. Same axe-core engine across most of them; the real differentiation is delivery surface and artifacts.",
      "Fixed our own homepage contrast violation (4.34:1 hero subhead → 5.04:1, plus inline <code> bumped from 1.85:1 to 16.7:1). The CI caught it in our prod scan. We are not above the standards we hold others to.",
      "Surface improvements: shareable /r/<id> scan-result feature now front-and-center on the homepage. WordPress plugin renamed to AsafAmos Accessibility Scanner per WordPress.org review feedback.",
    ],
  },
  {
    date: "2026-04-18",
    version: "0.1.0",
    tag: "launch",
    title: "First public release",
    body: [
      "Full accessibility-compliance CI ships with the initial release: every PR is scanned by axe-core 4.11 across WCAG 2.1 / 2.2 AA rule sets, and AI-generated code fixes are posted inline via Claude Sonnet 4.6.",
      "Compliance artifacts shipped from day one: Hebrew accessibility statement generator aligned with תקנה 35, embeddable compliance badge, and audit-trail JSON + markdown reports uploaded to every workflow run.",
      "Billing rail activated via Polar.sh — Israeli founders can accept USD payments globally without setting up a US LLC. First real subscription processed end-to-end on launch day.",
      "Free distribution across GitHub Marketplace (asafamos/axle-action), npm (axle-cli + axle-netlify-plugin), and the hosted web UI at axle-iota.vercel.app. Paid Team tier unlocks hosted AI fixes, nightly monitoring, and audit PDFs.",
    ],
  },
];

const TAG_LABEL: Record<Entry["tag"], { text: string; className: string }> = {
  launch: { text: "Launch", className: "bg-emerald-100 text-emerald-800" },
  feature: { text: "Feature", className: "bg-blue-100 text-blue-800" },
  fix: { text: "Fix", className: "bg-amber-100 text-amber-800" },
  infra: { text: "Infra", className: "bg-slate-200 text-slate-800" },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Changelog
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Every shipped release of axle
          </h1>
          <p className="mt-3 text-slate-600">
            We build in public. Subscribe to updates via the{" "}
            <a
              href="https://github.com/asafamos/axle-action/releases.atom"
              className="underline hover:text-slate-800"
            >
              RSS feed
            </a>{" "}
            or watch{" "}
            <a
              href="https://github.com/asafamos/axle-action"
              className="underline hover:text-slate-800"
            >
              the action repo on GitHub
            </a>
            .
          </p>
        </header>

        <div className="space-y-10">
          {ENTRIES.map((e) => {
            const tag = TAG_LABEL[e.tag];
            return (
              <article
                key={`${e.version}-${e.date}`}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tag.className}`}
                  >
                    {tag.text}
                  </span>
                  <span className="font-mono text-sm text-slate-700">
                    v{e.version}
                  </span>
                  <time
                    dateTime={e.date}
                    className="text-sm text-slate-500"
                  >
                    {new Date(e.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  {e.title}
                </h2>
                <div className="mt-3 space-y-3 text-slate-700">
                  {e.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <a href="/" className="hover:text-slate-800">
            ← Back to axle
          </a>
        </footer>
      </div>
    </main>
  );
}

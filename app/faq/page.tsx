import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — axle accessibility compliance CI",
  description:
    "Common questions about axle: how it differs from accessibility overlays, EAA 2025 and ADA compliance, pricing, GitHub Action vs npm CLI, Hebrew תקנה 35 statements, and what automated scans actually catch.",
  keywords: [
    "axle FAQ",
    "accessibility CI FAQ",
    "axe-core FAQ",
    "EAA 2025 FAQ",
    "overlay widget FAQ",
    "WCAG FAQ",
  ],
  openGraph: {
    title: "axle — frequently asked questions",
    description:
      "Detailed answers on compliance scope, pricing, deployment options, and how axle relates to EAA / ADA / תקנה 35.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/faq" },
};

type QA = { q: string; a: React.ReactNode; id: string };

const sections: { title: string; items: QA[] }[] = [
  {
    title: "About axle",
    items: [
      {
        id: "what",
        q: "What is axle?",
        a: (
          <>
            <p>
              axle is a continuous accessibility compliance pipeline. It scans every
              pull request against WCAG 2.1 / 2.2 AA using axe-core 4.11, comments on
              the PR with the failing rules, proposes source-code fix diffs via Claude
              Sonnet, and publishes a tamper-evident accessibility statement URL when
              you&apos;re ready to disclose compliance to regulators or customers.
            </p>
            <p className="mt-3">
              It ships as a GitHub Action, an npm CLI (<code>axle-cli</code>), plugins
              for Netlify / Cloudflare Pages / Vercel, a WordPress plugin, a Raycast
              extension, and a web scanner at the homepage. Same engine, different
              delivery surfaces.
            </p>
          </>
        ),
      },
      {
        id: "not-overlay",
        q: "How is axle different from an accessibility overlay widget (accessiBe, UserWay, AudioEye)?",
        a: (
          <>
            <p>
              The opposite approach. Overlays inject JavaScript into the served page
              at runtime that attempts to patch broken HTML with ARIA. Regulators
              under EAA 2025 / EN 301 549 / ADA evaluate the <em>served HTML</em>, not
              what a runtime script layers on top — which is why the FTC fined
              accessiBe $1M in January 2025 for deceptive compliance claims. Overlays
              also break for users who disable JavaScript or use custom assistive
              tech stacks.
            </p>
            <p className="mt-3">
              axle never ships JavaScript to your users. It scans in CI, proposes
              source-code fixes that a human reviews and merges, and the deployed HTML
              is genuinely accessible. Full background:{" "}
              <Link href="/why-not-overlay" className="underline">
                Why accessibility overlays don&apos;t work
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        id: "why-built",
        q: "Who built axle and why?",
        a: (
          <p>
            axle was built by an independent developer (asaf@amoss.co.il) as a
            practical alternative to the overlay ecosystem and to the manual-only
            audit firms. EAA 2025 enforcement made continuous compliance a real
            engineering problem — not something you can solve once a year with an
            audit PDF. axle is the tool the developer wanted to exist.
          </p>
        ),
      },
    ],
  },
  {
    title: "Compliance and regulations",
    items: [
      {
        id: "eaa",
        q: "Does axle make my site EAA 2025 compliant?",
        a: (
          <>
            <p>
              axle is a tool for teams <em>seeking</em> compliance. It produces the
              artefacts regulators look for — automated scan reports as an audit
              trail, a published accessibility statement with named contact and
              escalation channel, and evidence of per-PR diligence.
            </p>
            <p className="mt-3">
              That said: automated checks catch roughly 57% of WCAG issues (per
              Deque&apos;s published research on axe-core coverage). For the remaining
              43% — semantic judgements, alt-text quality, heading hierarchy,
              cognitive-load issues — a human audit is recommended before the first
              regulator touchpoint. axle is not a certification.
            </p>
          </>
        ),
      },
      {
        id: "ada",
        q: "Does it help with US ADA Title III lawsuits?",
        a: (
          <p>
            Yes, in the sense that axle gives you a defensible diligence record. The
            dominant plaintiff-firm model scans landing pages with automated tools
            (often axe-core itself) and threatens suit based on the output. A clean
            axle CI history shows the violations they&apos;d cite never landed on main
            in the first place. That reframes a suit from &ldquo;we have no
            process&rdquo; to &ldquo;here&apos;s our continuous process and the week
            this was introduced and caught&rdquo;. Still not a substitute for
            consulting an ADA-admitted attorney once you receive a letter.
          </p>
        ),
      },
      {
        id: "takana-35",
        q: "Does axle support Israeli תקנה 35?",
        a: (
          <>
            <p>
              Yes. The Hebrew statement generator at{" "}
              <Link href="/statement" className="underline">
                axle-iota.vercel.app/statement
              </Link>{" "}
              produces a <em>הצהרת נגישות</em> aligned with regulation 35(ד) —
              accessibility coordinator contact, escalation to נציב שוויון, methodology,
              and date, in proper Hebrew RTL layout. The form runs entirely in your
              browser; nothing is uploaded.
            </p>
            <p className="mt-3">
              For compliance officers: the Team plan adds a published verified URL
              (<code>/s/&lt;id&gt;</code>) that is tamper-evident and timestamped, so
              the statement can be referenced in disclosure documents and regulator
              filings without worrying about post-hoc edits.
            </p>
          </>
        ),
      },
      {
        id: "audit-substitute",
        q: "Does axle replace a human accessibility audit?",
        a: (
          <p>
            No. It replaces the <em>need</em> to pay for a full audit every quarter.
            axle catches the majority of what costs the most to fix — the machine-
            detectable regressions that accumulate between audits. You still want a
            qualified human (IAAP CPACC, DHS Section 508, AnySurfer, or similar) to
            validate the semantic and experiential aspects once a year or after a
            major redesign.
          </p>
        ),
      },
    ],
  },
  {
    title: "Pricing and plans",
    items: [
      {
        id: "pricing",
        q: "How much does axle cost?",
        a: (
          <>
            <ul className="list-disc space-y-2 ps-6">
              <li>
                <strong>Open — free forever</strong>: unlimited scans on one repo,
                PR comments, public badge, Hebrew statement generator, bring-your-own
                Anthropic API key for AI-generated fixes.
              </li>
              <li>
                <strong>Team — $49/month</strong>: hosted AI fixes (no BYO key
                needed), up to 10 repos, multi-language statement pack, published
                verified statement URL, trend history across scans.
              </li>
              <li>
                <strong>Business — $299/month</strong>: unlimited repos, full EU-
                language statement pack (DE/FR/IT/ES/NL/PT/DA/SV/FI/PL/CS/HU + EN/HE),
                SLA support, private Slack channel for escalations.
              </li>
            </ul>
            <p className="mt-3">
              No seat counts on any plan. Annual billing available (approximately 2
              months free). Cancel anytime — billing handled through Polar.sh.
            </p>
          </>
        ),
      },
      {
        id: "free-forever",
        q: "Is the free tier really free forever, or a trial?",
        a: (
          <p>
            Really free forever, for one repo. The reasoning: the marginal cost of
            running axe-core in your own GitHub runner is zero to me. Paid tiers
            cover hosted AI fixes (Claude API calls add up), multiple repos (support
            load), and the verified-URL feature (which runs on my infrastructure).
            If those don&apos;t apply, the free tier is the right fit indefinitely.
          </p>
        ),
      },
      {
        id: "enterprise",
        q: "Do you offer an enterprise / self-hosted tier?",
        a: (
          <p>
            The Business plan covers most enterprise needs at $299/mo. For true
            self-hosted deployments (air-gapped, VPC-only, no outbound to Anthropic),
            email asaf@amoss.co.il with the requirement. The GitHub Action itself is
            already self-hosted-runner-compatible; the piece that needs negotiation
            is the AI-fix backend.
          </p>
        ),
      },
    ],
  },
  {
    title: "Deployment and integration",
    items: [
      {
        id: "deployment",
        q: "Where does axle run? Is it a SaaS I need to sign up for?",
        a: (
          <>
            <p>
              The free tier and CI pipelines run on your own infrastructure — the
              GitHub Action runs on your GitHub runner, the Netlify plugin runs
              during your Netlify build, the CLI runs anywhere Node.js runs. No
              signup required; the axe-core engine is open source.
            </p>
            <p className="mt-3">
              The hosted service at axle-iota.vercel.app is optional and only
              involved if you (a) use the web-scan form on the homepage, (b) use the
              paid hosted AI-fix feature, or (c) publish a verified statement URL.
            </p>
          </>
        ),
      },
      {
        id: "action-vs-cli",
        q: "What's the difference between the GitHub Action and the npm CLI?",
        a: (
          <p>
            Same axe-core 4.11 engine, different delivery surface. The Action plugs
            into GitHub PR workflows, leaves a sticky comment, and fails the check if
            violations cross your configured threshold. The CLI (<code>axle-cli</code>)
            runs anywhere Node.js runs — local dev, GitLab / Jenkins / CircleCI /
            Bitbucket pipelines, cron jobs, or manual scans during a redesign. Same
            JSON + markdown output format between them so existing tooling works
            across both.
          </p>
        ),
      },
      {
        id: "ci-systems",
        q: "What CI systems does axle support?",
        a: (
          <p>
            First-class support via the GitHub Action for GitHub Actions. For
            everything else (GitLab, Jenkins, CircleCI, Bitbucket Pipelines, Buildkite,
            Azure Pipelines, TeamCity), use the npm CLI — it runs on any Node 18+
            runner and returns the same output format. PR-comment integration is
            GitHub-only today; other platforms get JSON + markdown reports you can
            wire to their equivalent comment APIs.
          </p>
        ),
      },
      {
        id: "platforms",
        q: "What hosting platforms have dedicated integrations?",
        a: (
          <p>
            Netlify (<code>@axle/netlify-plugin</code>), Cloudflare Pages
            (<code>@axle/cloudflare-plugin</code>), and Vercel
            (<code>@axle/vercel-plugin</code>) are published on npm with build-step
            hooks. WordPress has a plugin on WordPress.org that runs client-side
            scans inside the admin. Raycast has an extension for ad-hoc scans from
            the command bar. A Chrome extension for manual page auditing is in
            submission review.
          </p>
        ),
      },
      {
        id: "framework-support",
        q: "Does axle work with React / Next.js / Vue / Svelte / my framework?",
        a: (
          <p>
            Yes — axle scans the rendered HTML, not framework source. It works with
            any stack that serves HTML: React, Vue, Svelte, Solid, Angular, Next.js,
            Remix, Nuxt, Astro, SvelteKit, Rails, Django, Laravel, Phoenix, Go
            templates, static HTML. Framework-specific guides:{" "}
            <Link href="/guides/react-accessibility" className="underline">
              React
            </Link>
            ,{" "}
            <Link href="/guides/nextjs-accessibility" className="underline">
              Next.js
            </Link>
            ,{" "}
            <Link href="/guides/shopify-accessibility" className="underline">
              Shopify
            </Link>
            ,{" "}
            <Link href="/guides/wordpress-accessibility" className="underline">
              WordPress
            </Link>
            .
          </p>
        ),
      },
    ],
  },
  {
    title: "Technical details",
    items: [
      {
        id: "engine",
        q: "What scanning engine does axle use?",
        a: (
          <p>
            axe-core 4.11 (open source, Deque Systems). It&apos;s the same engine
            used by plaintiff-firm scanners, Google Lighthouse accessibility audits,
            Microsoft Accessibility Insights, and Deque&apos;s own commercial
            offering. Using the same engine as the scanners that detect violations
            is a deliberate choice — your CI sees what they see.
          </p>
        ),
      },
      {
        id: "coverage",
        q: "What percentage of WCAG violations do automated scans catch?",
        a: (
          <p>
            Roughly 57% of WCAG 2.1 AA issues are machine-detectable, per
            Deque&apos;s published methodology. The remaining ~43% require human
            judgement — is this alt text meaningful? does this heading structure
            make sense semantically? is this error message understandable to a
            screen reader user? axle catches the 57%, and the CI loop prevents
            regression while you fix the human-judgement piece at audit time.
          </p>
        ),
      },
      {
        id: "false-positives",
        q: "How noisy are the scan results? Will my team drown in false positives?",
        a: (
          <p>
            axe-core is specifically designed to minimise false positives — its ethos
            is &ldquo;zero false positives&rdquo; even at the cost of some
            coverage. In practice, violations at <strong>critical</strong> and
            <strong> serious</strong> severity are almost always real and actionable.
            <strong> Moderate</strong> and <strong>minor</strong> sometimes
            highlight edge cases; axle&apos;s default threshold fails PRs only on
            critical/serious and reports moderate/minor as warnings.
          </p>
        ),
      },
      {
        id: "dynamic-content",
        q: "Does axle scan dynamic / single-page app content?",
        a: (
          <p>
            Yes — scans run in a headless browser (Playwright) that fully renders
            client-side content before evaluation. For SPAs with multiple routes, the
            Action config accepts a list of URLs and scans each. For authenticated
            routes, a pre-scan auth step can be configured. Progressive
            enhancement and lazy-loaded content are handled via explicit wait-for
            conditions.
          </p>
        ),
      },
      {
        id: "ai-fixes",
        q: "How do the Claude-generated fixes work, and are they safe to merge blind?",
        a: (
          <>
            <p>
              When a violation is detected, axle feeds the offending HTML and the
              axe-core rule metadata to Claude Sonnet, which returns a unified diff
              against the source file. The diff appears as a suggestion in the PR
              comment; a human reviews and merges (or edits) it. axle never commits
              autonomously.
            </p>
            <p className="mt-3">
              Quality is high for <em>mechanical</em> fixes (missing alt attributes,
              missing labels, contrast adjustments, ARIA role corrections). For
              semantic issues (&ldquo;is this heading structure appropriate?&rdquo;)
              Claude sometimes over-suggests; treat those as proposals not mandates.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Statements and disclosure",
    items: [
      {
        id: "statement",
        q: "What's in the accessibility statement generator?",
        a: (
          <p>
            All elements regulators look for: conformance level declaration, list
            of non-accessible content with justification, named accessibility
            contact, escalation procedure per jurisdiction (נציב שוויון / ARCOM /
            NDA / ACM / SPF-FOD / etc.), assessment methodology, preparation date.
            The generator runs locally in your browser — no form data is uploaded.
            Output is HTML you can paste directly into your CMS / Shopify Page /
            WordPress page / Next.js route.
          </p>
        ),
      },
      {
        id: "verified-url",
        q: "What's a &ldquo;verified statement URL&rdquo;?",
        a: (
          <p>
            On paid plans, the statement can be published at{" "}
            <code>axle-iota.vercel.app/s/&lt;id&gt;</code> with a cryptographic hash of
            the content and a timestamp. When regulators ask for a statement URL in
            disclosure documents, that verified URL is tamper-evident — if the
            statement is modified later, the hash stops matching. This is meaningful
            because regulators increasingly treat the statement itself as a legal
            document with a specific version-in-force at a specific date.
          </p>
        ),
      },
      {
        id: "languages",
        q: "What languages does the statement generator support?",
        a: (
          <p>
            English and Hebrew on the free tier. Paid tiers add German, French,
            Italian, Spanish, Dutch, Portuguese, Danish, Swedish, Finnish, Polish,
            Czech, and Hungarian — covering the 12 largest EU-language surfaces plus
            English and Hebrew. Each language uses native regulator references (e.g.
            ARCOM in French, AgID in Italian, OAW in Spanish).
          </p>
        ),
      },
    ],
  },
  {
    title: "Privacy and security",
    items: [
      {
        id: "data",
        q: "What data does axle collect?",
        a: (
          <p>
            On the free tier running in your CI: none. Scans execute in your own
            runner and never phone home. The hosted web scanner records the target
            URL and the axe-core result for the displayed report (stored in Upstash
            Redis for the session); that data is deleted after 30 days unless you
            save a permalink. The statement generator runs entirely client-side —
            form content never leaves your browser. When you sign up for a paid
            plan, Polar.sh collects billing info; axle stores only your email,
            plan, and the repos you&apos;ve configured.
          </p>
        ),
      },
      {
        id: "source-code",
        q: "Does axle see my source code?",
        a: (
          <p>
            Only on paid plans that use hosted AI fixes: when you opt in, the
            offending HTML snippet and the source file section containing the
            offending markup are sent to Anthropic&apos;s API (Claude Sonnet) to
            generate the diff. Anthropic&apos;s API does not train on this data per
            their enterprise API terms. On the free tier with BYO-key, the same
            flow runs but through your own Anthropic account. Zero-retention mode
            (Business plan) adds an explicit pass-through flag to ensure prompts
            aren&apos;t logged.
          </p>
        ),
      },
      {
        id: "gdpr",
        q: "Is axle GDPR compliant?",
        a: (
          <p>
            Yes. Data processing happens in the EU (Upstash Frankfurt, Vercel
            Frankfurt / Dublin). A DPA (Data Processing Agreement) is available on
            request for paid plans. Personal data is limited to the email address
            on the account and any emails captured through the lead form on scan
            results (which users opt into explicitly).
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · reference
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Detailed answers to what teams usually ask before adopting axle. For
          regulation-specific detail, the{" "}
          <Link href="/guides" className="underline">
            guides hub
          </Link>{" "}
          goes deeper per jurisdiction and stack. For a billing question not
          answered here, email{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          .
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            {sections.map((s) => (
              <li key={s.title}>
                <a className="hover:underline" href={`#${slug(s.title)}`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section) => (
          <section key={section.title} id={slug(section.title)} className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
            <div className="mt-4 space-y-6">
              {section.items.map((qa) => (
                <div key={qa.id} id={qa.id} className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{qa.q}</h3>
                  <div className="mt-3 text-slate-700 [&_p]:leading-relaxed">{qa.a}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Still have a question?</h2>
          <p className="mt-2 text-sm text-slate-700">
            Email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            . I read every message and usually reply within a day. For compliance or
            legal questions specific to your jurisdiction, I&apos;ll still recommend
            consulting a qualified attorney — I write engineering tooling, not
            defence briefs.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Statement generator
            </Link>
            <Link
              href="/guides"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Guides
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 22 April 2026. Not legal advice.
        </footer>
      </article>
    </main>
  );
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

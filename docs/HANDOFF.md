# Handoff to next Claude session

## Where we are as of 2026-04-18

The project (now called **axle**) is live on GitHub at [asafamos/axle](https://github.com/asafamos/axle) — **private** repo. Git remote is set up, main is up to date, feature branch + dogfood PR #1 landed green.

### Product direction (current)

We pivoted away from "accessibility scanner" to **Continuous Accessibility Compliance CI** for modern websites. The buyer's pain is *regulatory* (EAA June 2025 in force, ADA lawsuits, חוק שוויון), not technical curiosity. The moat is workflow + artifacts (PR integration, audit trail, accessibility statement, compliance badge), not the scan itself — scans are a commodity.

Distribution is **product-led**: multiple marketplaces (GitHub, Vercel, Netlify, Cloudflare, WordPress eventually), SEO lead magnets (Hebrew statement generator is live), embeddable compliance badge (viral loop). The user has no warm-intro network, so cold distribution is the only way.

**Hard constraints (do not drift on these):**
- Never ship an overlay widget — accessiBe's $1M FTC fine (Jan 2025) is the anti-moat we lean on.
- Never claim "compliance certification." Language is always "remediation assistance."
- AI fix accuracy ceiling ≈ 60-75% of WCAG violations. Every fix must ship with `confidence` + `manual_review_needed` flags.
- ICP: technical SMBs on GitHub + WordPress/Shopify/Next.js. Not Wix.

### What's shipped

**Core product:**
- `lib/scanner.ts` — Playwright + axe-core scanner, WCAG 2.0/2.1/2.2 A + AA tags.
- `lib/fixer.ts` — Claude Sonnet fix generator with prompt caching.
- `app/api/scan/route.ts`, `app/api/fix/route.ts` — server endpoints.
- `app/page.tsx` — rewritten landing page positioned as compliance CI, keeps an interactive scan widget.
- `app/statement/page.tsx` + `lib/statement/hebrew-template.ts` — free Hebrew accessibility-statement generator aligned with תקנה 35. Runs entirely in-browser, no signup. **This is the top SEO lead magnet.**
- `app/badge/page.tsx` + `app/api/badge/route.ts` + `lib/badge.ts` — free shields.io-style SVG compliance badge, JSON endpoint for shields.io consumers. Every embed is a backlink.
- `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx` — SEO + branded 404.
- `app/layout.tsx` — OG / Twitter / canonical metadata, `NEXT_PUBLIC_SITE_URL` env for deploy-time domain override.

**CI + distribution:**
- `scripts/ci-scan.ts` + `npm run a11y:ci` — CLI that emits JSON + markdown reports, used locally and by the workflows.
- `.github/workflows/a11y.yml` — PR-triggered scan, updates a single marker-tagged comment, uploads artifacts, fails on `serious+` by default. Caches Playwright browsers.
- `.github/workflows/a11y-scheduled.yml` — nightly cron of a `A11Y_SCAN_URLS` list, auto-opens / appends to an `accessibility-regression` tracking issue.
- `packages/axle-action/` — composite GitHub Action scaffold ready to be lifted into a public repo `asafamos/axle-action` and published to Marketplace.
- `packages/axle-cli/` — standalone `@axle/cli` npm package scaffold (own source under `src/`, `tsconfig`, `bin: axle`). Ready to `npm publish`.
- `packages/axle-netlify/` — Netlify Build Plugin scaffold wrapping `@axle/cli`.

### What's dogfooded

PR [#1](https://github.com/asafamos/axle/pull/1) (feat/compliance-badge) triggered the accessibility workflow, posted its green comment on the PR, and left a downloadable artifact. End-to-end path works.

### Gotchas recovered from

- `/Users/asafamos/` had a loose Tailwind v3 sandbox (`package.json`, `package-lock.json`, `tailwind.config.js`, `node_modules/`) that broke Tailwind v4 + Turbopack module resolution. Moved to `/Users/asafamos/.stray-backup-2026-04-18/`. **Don't delete — reversible backup.**
- First dogfood run failed because `next.config.ts` had a hardcoded `turbopack.root = "/Users/asafamos/a11y-fixer"` (was a workaround for the stray files). That path doesn't exist on the runner → Turbopack crashed. Removed — `nextConfig = {}` works fine now.
- `.next/` cache poisons builds when the config changes. `rm -rf .next && npm run dev` any time the module resolution story shifts.

### Pricing (published on the landing page)

- **Open** — $0. 1 repo, BYO Anthropic key for AI fixes. Badge + Hebrew statement free.
- **Team** — $49/mo. 10 repos, hosted AI fixes, nightly monitoring, PDF audit trail, Slack alerts.
- **Business** — $299/mo. Unlimited domains, multi-language statements, SSO, compliance officer dashboard.

Self-serve. No seat counts. Framed as "cheaper than an hour with a compliance lawyer."

## What's up next (priority order)

1. **Deploy to Vercel.** The product isn't useful until it's live somewhere. Needs the user's Vercel account (ask). Point a real domain (`axle.dev` or similar) at it, set `NEXT_PUBLIC_SITE_URL`.
2. **Extract `packages/axle-action/` to `asafamos/axle-action` public repo + publish to Marketplace.** Requires bundling the CLI (use `ncc` or copy a prebuilt dist into the action repo). Marketplace listing is the primary discovery channel.
3. **Publish `@axle/cli` to npm.** Needs user to run `npm login` first. Once live, `npx @axle/cli scan <url>` becomes a one-liner for any dev.
4. **Publish `@axle/netlify-plugin`** to npm (after #3).
5. **Landing-page polish.** Hero visual should be a real animated PR comment, not a static mock. Dark mode pass. Screenshot of a Netlify/Vercel build log with a failing a11y check.
6. **Scan history / persistence.** MVP: localStorage in the browser for the free tier; DB (Supabase) for Team+ tiers. Drives return visits.
7. **Accessibility statement — French / German / Spanish** (EAA coverage beyond Israel).
8. **Vercel Integration** (OAuth + webhook for preview URLs). Biggest effort of the remaining integrations.
9. **Email waitlist capture** on pricing CTAs (currently the buttons are dead — `type="button"` with no handler). Use Resend or similar once we have a backing store.

## Files in this project

```
a11y-fixer/                         ← local folder still named a11y-fixer (rename is cosmetic; GH repo is `axle`)
├── README.md                       ← "axle" framing, quick start
├── CLAUDE.md → AGENTS.md           ← Next.js 16 / Turbopack guardrails
├── .github/workflows/
│   ├── a11y.yml                    ← PR-triggered scan
│   └── a11y-scheduled.yml          ← nightly cron + regression issue
├── app/
│   ├── layout.tsx                  ← root metadata
│   ├── page.tsx                    ← compliance-CI landing + scan widget
│   ├── not-found.tsx               ← branded 404
│   ├── robots.ts / sitemap.ts
│   ├── statement/                  ← Hebrew accessibility statement generator
│   ├── badge/                      ← compliance badge demo
│   └── api/
│       ├── scan/                   ← /api/scan
│       ├── fix/                    ← /api/fix
│       └── badge/                  ← /api/badge (SVG + JSON)
├── lib/
│   ├── scanner.ts
│   ├── fixer.ts
│   ├── badge.ts
│   └── statement/hebrew-template.ts
├── scripts/
│   └── ci-scan.ts                  ← main project's CLI (npm run a11y:ci)
├── packages/
│   ├── axle-action/                ← Marketplace-ready composite Action
│   ├── axle-cli/                   ← @axle/cli npm package
│   └── axle-netlify/               ← Netlify Build Plugin
└── docs/
    ├── README.md                   ← original product concept
    ├── RESEARCH.md                 ← market research
    └── HANDOFF.md                  ← this file
```

## Legacy: original research + decision log

Preserved for continuity. Everything below this line predates the compliance-CI pivot.

### Websites the user owns (useful for scan targeting)

- `partyapp.co.il`, `paprikadjs.com`, `swap-video.com` — we've scanned paprikadjs.com; 5 violations across 38 elements, used as the dev target.

### Decisions we considered and rejected

1. **AI pentester for SMBs** — no channel, competitors well-funded, spam-law risk.
2. **Email deliverability SaaS** — late to market (Google/Yahoo 2024 trigger), EasyDMARC won SMB.
3. **Core Web Vitals + AI auto-fix** — Google PageSpeed too good, auto-fix accuracy too low for liability.
4. **SMB AWS FinOps** — Vantage / Antimetal own the free tier.
5. **Firebase/Supabase bill-shock** — backup plan if accessibility stalls.
6. **AI-driven dropshipping** — saturated, 85% lose money, AI doesn't solve the real bottlenecks.

# axle

Continuous accessibility compliance for the modern web. Scans every PR for WCAG 2.1 / 2.2 AA violations, generates real code fixes with Claude, and produces the legal artifacts your lawyer asks for. Never overlay widgets.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fasafamos%2Faxle&env=ANTHROPIC_API_KEY,NEXT_PUBLIC_SITE_URL&envDescription=ANTHROPIC_API_KEY+powers+AI+fix+suggestions+(optional).+NEXT_PUBLIC_SITE_URL+is+the+canonical+URL+used+in+OG+tags+and+sitemap.xml.)

## What ships

**Web (Next.js 16):**
- `/` — compliance-CI landing + live scan + AI fix widget
- `/statement` — free Hebrew accessibility-statement generator, תקנה 35-aligned
- `/badge` — free embeddable shields-style compliance badge

**Libraries (`lib/`):**
- `scanner.ts` — Playwright + axe-core 4.11 scanner (WCAG 2.0/2.1/2.2 A+AA)
- `fixer.ts` — Claude Sonnet fix generator with prompt caching
- `badge.ts` — dependency-free SVG badge renderer
- `statement/hebrew-template.ts` — תקנה 35-aligned Hebrew statement generator

**API:**
- `POST /api/scan` — scan a URL
- `POST /api/fix` — generate a code-fix for a violation
- `GET /api/badge` — SVG or shields.io-JSON compliance badge

**CI:**
- `.github/workflows/a11y.yml` — PR-triggered scan, auto-updating inline comment, artifacts upload, severity gate
- `.github/workflows/a11y-scheduled.yml` — nightly cron over a URL list, auto-opens regression tracking issues
- `scripts/ci-scan.ts` + `npm run a11y:ci` — local/CI CLI emitting JSON + markdown

**Distribution scaffolds (ready to publish):**
- `packages/axle-action/` — composite GitHub Action for Marketplace (`asafamos/axle-action`)
- `packages/axle-cli/` — `@axle/cli` npm package
- `packages/axle-netlify/` — `@axle/netlify-plugin` Netlify Build Plugin

## Local use

```bash
npm ci
npx playwright install chromium
cp .env.local.example .env.local   # set ANTHROPIC_API_KEY if you want AI fixes
npm run dev                          # localhost:3000 — interactive web UI
npm run a11y:ci -- --url https://example.com --with-ai-fixes true
```

## In your repo's CI

```yaml
# .github/workflows/accessibility.yml
name: Accessibility
on: pull_request
permissions: { contents: read, pull-requests: write }
jobs:
  axle:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1       # coming to Marketplace
        with:
          url: ${{ github.event.pull_request.head.sha && format('https://preview-{0}.your-domain.dev', github.event.pull_request.number) }}
          fail-on: serious
          with-ai-fixes: "true"
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Positioning

axle is a compliance workflow around an axe-core scan, not just a better scanner. The legal pressure (EAA June 2025, ADA Title III lawsuits, חוק שוויון) is the buying trigger; the scanner, AI fixer, PR comment, audit trail, badge, and accessibility statement are the bundle that makes the purchase obvious.

Explicit non-goals:
- No overlay widgets. Ever. (see accessiBe's $1M FTC fine, Jan 2025.)
- No "compliance certificate" language. axle provides **remediation assistance**.
- No false-confidence AI fixes. Every fix ships with `confidence` + `manual_review_needed`.

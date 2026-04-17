# axle

Continuous accessibility compliance for the modern web. Scans on every PR, surfaces WCAG 2.1 / 2.2 AA violations inline, and generates real code fixes with Claude — never overlay widgets.

## Status

Early private build. Pieces in place:

- `lib/scanner.ts` — Playwright + axe-core scanner
- `lib/fixer.ts` — Claude-powered fix generator (Sonnet 4.6, prompt-cached)
- `app/page.tsx` — interactive scan/fix dashboard
- `scripts/ci-scan.ts` — CLI for CI use, emits JSON + markdown
- `.github/workflows/a11y.yml` — PR check that comments inline with results and suggested fixes

## Local use

```bash
npm ci
npx playwright install chromium
cp .env.local.example .env.local  # add ANTHROPIC_API_KEY
npm run dev                           # interactive web UI at localhost:3000
npm run a11y:ci -- --url https://example.com --with-ai-fixes true
```

## In CI

Drop the workflow in `.github/workflows/a11y.yml`. Add `ANTHROPIC_API_KEY` as a repo secret to enable AI fix suggestions in PR comments (otherwise scans still run, without fixes).

Every PR gets one auto-updating comment summarising violations grouped by WCAG rule, with severity, affected elements, and optional suggested diffs.

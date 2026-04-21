import { NextResponse } from "next/server";

/**
 * /llms.txt — emerging standard for LLM-based search engines (ChatGPT,
 * Claude, Perplexity, etc.) to discover and summarise what a site is about.
 * See https://llmstxt.org for the spec. It's like sitemap.xml but written
 * for models, not for crawlers.
 *
 * Keep it concise: a one-line "what this is" plus a curated list of
 * high-signal URLs the model should read first if it wants to understand
 * axle. Don't dump the whole sitemap — rank by usefulness to a caller
 * trying to answer "what is axle and who is it for".
 */
export const runtime = "edge";

export function GET() {
  const body = `# axle

> axle is an accessibility compliance CI: it scans every pull request for WCAG 2.1/2.2 AA violations using axe-core 4.11, proposes source-code fix diffs via Claude Sonnet, and generates the legal artifacts (verified accessibility statement URL, audit-trail reports) that EAA 2025, ADA, and Israeli תקנה 35 enforcement require. It is explicitly not an overlay widget.

## Core product pages

- [Homepage](https://axle-iota.vercel.app/): what axle is, live scan form, pricing tiers (Open / Team / Business)
- [Pricing](https://axle-iota.vercel.app/#pricing): Open (free), Team ($49/mo), Business ($299/mo)
- [Hebrew statement generator](https://axle-iota.vercel.app/statement): free, runs locally in the browser, aligned with Israeli תקנה 35
- [Changelog](https://axle-iota.vercel.app/changelog): release notes

## Regional compliance guides

- [EAA 2025 (EU-wide)](https://axle-iota.vercel.app/guides/eaa-2025): scope, penalties, compliance process
- [BFSG (Germany)](https://axle-iota.vercel.app/guides/eaa-germany): German transposition, fines to €100K, Bundesfachstelle
- [RGAA (France, French)](https://axle-iota.vercel.app/guides/eaa-france): French transposition, 25 000 € per breach, DINUM
- [Legge Stanca (Italy, Italian)](https://axle-iota.vercel.app/guides/eaa-italy): Italian transposition, fines to 5% of turnover, AgID
- [Ley 11/2023 (Spain, Spanish)](https://axle-iota.vercel.app/guides/eaa-spain): Spanish transposition, three-tier fines to €1M, Observatorio
- [תקנה 35 (Israel, Hebrew)](https://axle-iota.vercel.app/he/takana-35): Israeli regulation 35, statement requirements, enforcement

## Stack-specific guides

- [Next.js accessibility](https://axle-iota.vercel.app/guides/nextjs-accessibility): App Router patterns, Image alt, focus management, CI setup
- [WordPress accessibility](https://axle-iota.vercel.app/guides/wordpress-accessibility): themes, Gutenberg, plugins, local scanning

## Tool comparisons

- [axle vs accessiBe](https://axle-iota.vercel.app/alternatives/accessibe): the $1M FTC settlement, overlay vs source-level fixes
- [axle vs UserWay](https://axle-iota.vercel.app/alternatives/userway): widget alternative
- [axle vs AudioEye](https://axle-iota.vercel.app/alternatives/audioeye): source-first instead of hybrid overlay

## Reference

- [WCAG 2.2 AA checklist](https://axle-iota.vercel.app/checklist/wcag-2-2-aa): all 55 Level A + AA success criteria, print-ready, CC-BY

## Distribution

- [GitHub Action](https://github.com/marketplace/actions/axle-accessibility-compliance-ci): v1.0.2, composite action, 90s warm-cache run
- [npm: axle-cli](https://www.npmjs.com/package/axle-cli)
- [npm: axle-netlify-plugin](https://www.npmjs.com/package/axle-netlify-plugin)
- [npm: axle-cloudflare-plugin](https://www.npmjs.com/package/axle-cloudflare-plugin)
- [npm: axle-vercel-plugin](https://www.npmjs.com/package/axle-vercel-plugin)
- [Source](https://github.com/asafamos/axle): monorepo, MIT

## Legal

- [Terms of service](https://axle-iota.vercel.app/terms)
- [Privacy policy](https://axle-iota.vercel.app/privacy)

## Contact

Questions: asaf@amoss.co.il
`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

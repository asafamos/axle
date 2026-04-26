# Distribution playbook — axle

Copy-paste ready entries and drafts for distribution channels. Everything here is intended to be submitted by Asaf (requires your identity on each platform).

## 1. Awesome lists — open PRs on these repos

Each is a curated list read by the target audience. Approval rates vary; a clean single-line entry usually merges.

### awesome-a11y — https://github.com/brunopulis/awesome-a11y
**File**: `README.md`
**Section**: "Testing Tools" or "Automation"
**Entry**:
```markdown
- [axle](https://axle-iota.vercel.app) - a11y / WCAG 2.2 AA compliance CI. Scans every PR with axe-core, proposes source-code fixes via Claude. GitHub Action, npm CLI, Netlify / Cloudflare / Vercel / WordPress plugins.
```

### awesome-actions — https://github.com/sdras/awesome-actions
**File**: `README.md`
**Section**: "Testing" → "Code Quality" sub-section (or "Static Analysis")
**Entry**:
```markdown
- [axle](https://github.com/marketplace/actions/axle-accessibility-compliance-ci) - a11y / WCAG 2.2 AA compliance CI. Blocks merges on accessibility regressions; Claude-generated source-code fixes inline in the PR.
```

### awesome-eu-digital-regulations (create if missing) / awesome-eaa
If you find / create one:
```markdown
- [axle](https://axle-iota.vercel.app) - EAA 2025 compliance tooling: continuous WCAG 2.2 AA scanning, Hebrew / EU-language accessibility statement generator, per-country transposition guides.
```

### awesome-nextjs — https://github.com/unicodeveloper/awesome-nextjs
```markdown
- [axle](https://github.com/marketplace/actions/axle-accessibility-compliance-ci) - a11y / WCAG compliance CI with Next.js first-class support. axe-core scanning on every PR.
```

### awesome-selfhosted / awesome-opensource-saas
Not obviously applicable — axle is MIT-licensed open source with an optional hosted tier. Worth a shot on the SaaS alternatives list.

---

## 2. Show HN — Hacker News launch post

**Title** (under 80 chars):
```
Show HN: axle – a11y/WCAG CI that proposes real source-code fixes via Claude
```

**URL**: `https://axle-iota.vercel.app`

**Body** (first comment):
```
Hi HN — I built axle because I got tired of the accessibility-compliance
product landscape being split between (a) overlay widgets that don't
actually work and cost accessiBe a $1M FTC settlement, and (b) $40K
annual audit contracts that catch regressions only once a year.

axle is the middle: a CI tool that scans every PR against WCAG 2.1/2.2
AA using axe-core (same engine plaintiff-firm scanners use), leaves a
sticky PR comment, and when you opt in with an Anthropic key, proposes
source-code fix diffs via Claude that a human reviews and merges. It
never injects JavaScript into your served HTML — the opposite of an
overlay.

Ships as a GitHub Action, an npm CLI (axle-cli), plugins for Netlify /
Cloudflare Pages / Vercel, a WordPress plugin, and a Raycast extension.
Same axe-core engine across all delivery surfaces.

Free forever for 1 repo. $49/mo for hosted AI fixes + multi-repo. $299/mo
for enterprise with the full EU-language statement pack.

Why now: EAA 2025 enforcement kicked in 28 June 2025. ADA Title III
website lawsuits hit ~4,000 filings in 2024. Automated audits catch
~57% of WCAG issues, which is the exact 57% plaintiff firms also catch.
Continuous CI is the missing piece.

Engineering notes:
- Built on Next.js 16 with Turbopack
- axe-core 4.11 via Playwright
- Claude Sonnet for fix generation
- Polar.sh for billing
- Vercel + Upstash Redis for the hosted side
- Dogfood: axle scans its own site on every PR

Happy to answer questions about the landscape (EAA transposition per
country, ADA lawsuit patterns, why overlays don't work), the tech
stack, or the pricing model.
```

**Timing**: Post Tuesday–Thursday 7–9am PST (~15:00–17:00 UTC). Sunday evenings can work too.

---

## 3. Product Hunt launch

**Tagline** (under 60 chars):
```
a11y compliance CI with real code fixes — not a widget
```

**Description** (500 char limit):
```
axle scans every PR for WCAG 2.2 AA violations using axe-core and
proposes source-code fix diffs via Claude Sonnet. Blocks merges on
regressions. Generates EAA/ADA/Israeli accessibility statements.
GitHub Action + npm CLI + Netlify/Cloudflare/Vercel/WordPress plugins.
Never injects runtime JavaScript — the opposite of an overlay widget
(which the FTC just fined accessiBe $1M for).
```

**Categories**: Developer Tools, Accessibility, SaaS

**Timing**: Product Hunt traffic peaks Tuesday 00:01 PST (= 10:01 UTC).

**Gallery**: use `scripts/gen-screenshots.mjs` output — pr-comment-mockup.png, homepage.png, statement-generator.png.

---

## 4. Dev.to cross-posting

The 12 EAA guides + stack guides on axle-iota.vercel.app/guides are ready-made Dev.to articles. Cross-post with `canonical_url` pointing back to the original. Highest-value candidates:

1. **"ADA demand letter — first 48 hours"** (axle-iota.vercel.app/ada-demand-letter) — peak-intent, high engagement.
2. **"EAA 2025 for engineers"** (axle-iota.vercel.app/guides/eaa-2025) — hits EU developer audience.
3. **"Why accessibility overlays don't work"** (axle-iota.vercel.app/why-not-overlay) — controversial enough to get comments.
4. **"React accessibility"** / **"Next.js accessibility"** — big stack audiences.

Dev.to tags per post: `accessibility`, `a11y`, `webdev`, plus stack-specific (`react`, `nextjs`, `vue`, etc.).

---

## 5. Reddit / niche community posts

- `r/webdev` — weekly share thread, link to the ADA demand-letter page
- `r/accessibility` — specifically the /why-not-overlay post; this community *hates* overlays so it's aligned
- `r/nextjs` — /guides/nextjs-accessibility
- `r/reactjs` — /guides/react-accessibility
- `r/shopify` — /guides/shopify-accessibility (compliance anxiety is real here)
- `r/wordpress` — /guides/wordpress-accessibility + link to the free WP plugin

Avoid: anything that looks like direct promotion. Lead with content / insight.

---

## 6. Where NOT to spend time

- **LinkedIn** — user explicitly not active
- **Twitter/X threads about overlays** — controversial but exhausting
- **Hacker News Tell HN** — use Show HN instead
- **Paid ads** — until unit economics are proven

---

## 7. Newsletters and aggregators (high-leverage, async)

Most of these accept submissions; some require active outreach to the editor. All target audiences that read about a11y / EAA / web dev.

### Tech / dev newsletters
- **TLDR Web Dev** — https://tldr.tech/webdev — submit at tldr.tech/submission. Good for tooling launches.
- **JavaScript Weekly** — https://javascriptweekly.com — email josh@cooperpress.com
- **Frontend Focus** — https://frontendfoc.us — same publisher, focused on browser/UI
- **Bytes** — https://bytes.dev — submit via the homepage form
- **TLDR DevOps** — https://tldr.tech/devops — for the CI/automation framing
- **Hacker Newsletter** — https://hackernewsletter.com — covers good Show HN posts (so launch HN first)

### Accessibility-specific publications
- **A11y Weekly** — https://a11yweekly.com — submit a tip via the form. Aligned audience.
- **WebAIM newsletter** — webaim@list.webaim.org via webaim.org
- **A11y Project** — https://www.a11yproject.com — contribute resources via the GitHub repo (PR-based)
- **Smashing Magazine** — pitch accessibility articles to editors@smashingmagazine.com
- **CSS-Tricks (DigitalOcean)** — newsletters and guest posts via digitalocean.com community

### Aggregators (auto-discovery)
- **daily.dev** — auto-aggregates blog content with the right tags (`#accessibility`, `#a11y`)
- **Refind** — algorithmic, but quality articles surface naturally
- **Hashnode** — cross-post the long-form guides as canonical-back posts

---

## 8. Podcasts (1-time effort, lasting reach)

Reach out cold by email with a 2-paragraph pitch. Mention specific recent episodes you liked (proves you actually listen).

- **A11y Rules** (Nicolas Steenhout) — https://a11yrules.com — accessibility focus, indie-tool friendly
- **The A11y Podcast** (Aaron Page) — short interviews
- **Shop Talk Show** (Chris Coyier + Dave Rupert) — broad webdev, occasional a11y guests
- **Front-End Happy Hour** — sometimes covers a11y tooling
- **Devtools.fm** — devtools/CI focus, axle's CI angle aligns
- **The Changelog** (Adam Stacoviak) — open-source / business stories, the FTC settlement angle is editorial gold

Pitch hook: \"axle is the indie alternative to overlay widgets that the FTC just fined accessiBe \$1M for. Built by one developer. Free for one repo, $49/mo for teams. Can talk about the EAA 2025 landscape, the FTC settlement, the engineering of CI-grade accessibility scanning, or the dogfood story (axle scans its own marketing site on every PR).\"

---

## 9. Social — Bluesky + Mastodon (skip Twitter/X if not active)

The web-accessibility community has largely migrated to **Bluesky** (especially since 2025) and a smaller pocket on **Mastodon** (front-end.social, hachyderm.io).

### Bluesky
- Create / use your handle on bsky.app
- Follow: a11y community accounts (Adrian Roselli, Heydon Pickering, Léonie Watson, Marcy Sutton)
- Post pattern: 1 useful insight per week, link to a guide. Don't pitch the product directly.
- Tag: `#a11y` `#accessibility` `#WCAG`

### Mastodon
- front-end.social is the dev-focused instance
- Same content, cross-post via Buffer or manually
- Engagement is lower than Bluesky but the audience is engaged

---

## 10. WordPress / Shopify directories (separate from npm/Marketplace)

Already submitted but worth confirming visibility:

- **WordPress.org plugin directory** — search \"axle\" or \"accessibility scanner\" — confirm we appear
- **Shopify App Store** — axle-shopify package needs to be packaged and submitted (currently package.json only, no actual app shell)
- **Cloudflare Workers directory** — the Cloudflare plugin is on npm but not on the dedicated directory yet
- **Netlify Build Plugins directory** — npm presence may be enough, verify
- **Vercel Integrations Marketplace** — separate from npm, requires submission

---

## 11. Conference CFPs (1-2 talks per year, lasting credibility)

- **CSUN Assistive Technology Conference** — annual, biggest a11y conference. CFP usually opens Aug–Oct.
- **M-Enabling Summit** — Washington DC, accessibility + business focus
- **Funka Accessibility Days** — Stockholm, EU regulatory focus, EAA-relevant
- **ID24** (Inclusive Design 24) — virtual, single-day, accessible CFPs
- **a11yTalks** — virtual monthly meetup, easier entry
- **GitHub Universe** (Action vendor track)
- **Vercel / Netlify / Cloudflare** developer events — talk about their plugin

Talk angles that work for an indie tool:
1. \"What we learned shipping our own a11y tool — the FTC just fined our competitor $1M\"
2. \"Continuous a11y compliance: WCAG 2.2 AA in CI, regulator-ready in production\"
3. \"EAA 2025 in practice: 12 transpositions, one tool\"

---

## 12. Where NOT to spend time

- **LinkedIn** — user explicitly not active
- **Twitter/X threads about overlays** — controversial but exhausting; if you're not already active there, Bluesky is the cheaper substitute
- **Hacker News Tell HN** — use Show HN instead
- **Paid ads** — until unit economics are proven (need ~$5K CAC visibility before scaling)
- **Cold outbound to enterprise** — wrong stage; come back at $2K MRR

---

## Order of operations for maximum effect

1. **Ship the conversion / partner pages** — /free-scan, /wcag-checker, /accessibility-checker, /partners are now live (Wave 7).
2. **Wait 48–72h** for Marketplace and Google to re-index.
3. **Open the 4 awesome-list PRs** (sections 1) — 5 min each, async approval.
4. **Submit to 3 newsletters** (TLDR, A11y Weekly, Frontend Focus) — section 7.
5. **Show HN** the following Tuesday 8am PST.
6. **Product Hunt** 2 weeks after Show HN if HN gets traction.
7. **Bluesky / Mastodon presence** — 2 posts per week, no pitching, content links.
8. **Dev.to cross-post** 1 article per week on the Tuesday following.
9. **One podcast pitch per month** — section 8.
10. **One conference CFP per quarter** — section 11.

Total time investment: ~12 hours spread over the first 6 weeks. After that, ~1 hour per week ongoing.

---

## Revenue-acceleration ideas (when traffic exists but conversion lags)

1. **Free-trial Team plan** — 14 days, no credit card. Currently free → paid is a hard cliff. A trial smooths the path for users who need to see value before committing.
2. **Annual discount more visible** — \"$49/mo or $470/year (save $118)\" rather than burying the annual savings in checkout.
3. **Lifetime deal** — AppSumo / Pirate Ship-style. Can dilute LTV if priced wrong; useful for early traction. Suggest $299 LTD covering up to Team-tier features for current users only.
4. **Money-back guarantee** — 30-day refund, no questions. Reduces purchase friction; drop-off at checkout often spikes when hesitation peaks.
5. **\"axle Free Audit\" service** — a $0 pre-scan + 1-hour engineer call for prospects mentioning EAA / ADA exposure. Converts hot leads.
6. **Compliance bundle** — the Verified Statement URL ($299/mo Business feature) bundled with manual help drafting the statement for first-time submitters. Higher AOV.
7. **Agency tier** — separate plan above Business with white-label dashboard for agencies serving 20+ clients. Higher pricing but very different audience.
8. **Slack community** — invite-only, free for paid customers. Reduces churn dramatically; turns customers into peer references.

These are speculative without data — wait for the first 50 paying customers, then run experiments based on observed friction points.

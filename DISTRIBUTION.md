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

## Order of operations for maximum effect

1. Ship the axle-action Marketplace + npm keyword fixes (pending PRs).
2. Wait 48h for Marketplace re-crawl (GitHub reindexes nightly).
3. Open awesome-list PRs (low effort, async approval).
4. Plan Show HN for the following Tuesday at 8am PST.
5. Product Hunt launch 2 weeks after Show HN if it gets traction.
6. Dev.to cross-post 1 article per week on the Tuesday after.

Total time investment: ~5 hours spread over 3 weeks.

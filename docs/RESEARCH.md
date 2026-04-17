# Market Research Summary

Compiled from 4 parallel deep research passes on Apr 18, 2026. Full conversation log is in the original Claude session (kids-coloring project).

## Why this idea wins

### 1. Regulatory forcing functions are real and stacking

**US (the biggest engine):**
- ~3,117 federal ADA website lawsuits in 2025 (+27% YoY per Seyfarth ADA Title III tracker)
- Some trackers count 5,100+ when including broader Title III claims (+37% rise)
- Typical settlement: $5K-$25K + remediation
- NY, FL, CA, IL dominate; Illinois 6x'd YoY (92 → 576)
- Serial plaintiff firms (Stein Saks, Mars Khaimov, Gottlieb) send demand letters continuously
- E-commerce, restaurants, mid-market B2C most targeted

**EU (the new wave):**
- European Accessibility Act (EAA) effective June 28, 2025
- Enforcement cases already: Auchan, Carrefour, E.Leclerc, Picard (France, Nov 2025)
- Norway fining HelsaMi ~€4,500/day
- Sweden PTS inspecting e-commerce
- Netherlands ACM set Oct 15, 2025 reporting deadline
- Fines: Germany €100K, France €300K, Italy €40K per violation

**Israel:**
- Equal Rights for Persons with Disabilities Law (1998, amended 2013)
- IS 5568 = WCAG 2.0 AA basis
- Aggressive private lawsuits, known enforcement culture
- Small market (10-20K relevant sites) but home-field advantage

### 2. TAM is enormous and unmet

- **WebAIM 2025 Million study: 94.8% of top 1M homepages fail WCAG 2**
- Automated tools (axe-core) detect ~57% of WCAG violations
- With AI remediation: can plausibly auto-fix 60-75% of detected issues

### 3. The overlay controversy is a gift

**accessiBe lost to the FTC in Jan 2025:**
- $1M fine + 20-year compliance monitoring
- FTC explicitly rejected their "AI makes sites compliant" claim
- Every deceptive-compliance suit now cites FTC v. accessiBe

**NFB (National Federation of the Blind):** banned accessiBe from convention, 2021 resolution against overlays never softened.

**Plaintiff firms** explicitly target overlay-using sites because they win.

→ **"No overlay, real code fixes via PRs" is the cleanest differentiator in this market in 2026.**

### 4. AI actually helps (not just marketing)

Recent academic work confirms viability:
- **AccessGuru (ACM ASSETS 2025):** LLM detect+correct achieves ~84% average violation score decrease vs 50% baseline
- WebAccessBench, Tabular Accessibility Dataset (MDPI 2025), Web4All 2025 papers all show LLMs (Claude 3.5/GPT-4 class) generate WCAG-compliant code when prompted with explicit a11y context

Realistic auto-fix ceiling: 60-75% of detected issues as PR-ready patches. The rest needs human judgment.

## Competitive landscape

| Player | Status | ARR/Rev | Notes |
|---|---|---|---|
| **AudioEye** (NASDAQ: AEYE) | Public | $40.3M FY25 (+15%), ARR $38.7M | Proves the public-market model |
| **accessiBe** | Private | 2025 Inc. 5000 list | **FTC fined $1M Jan 2025.** Reputation damaged in a11y community |
| **UserWay** | Private | ~$13M | Acquired by Level Access for $98.7M in 2024 |
| **Level Access / Deque / Siteimprove** | Enterprise | $$$ | Sales-led, 6-figure deals, not our competition |
| **EqualWeb** (Israeli) | Private | - | Hybrid overlay + manual, mid-market |
| **Evinced** | Private | $112M raised (Series C $55M Dec 2024, Insight) | **Closest competitor ideologically** — dev-tooling focused, enterprise. Could drop downmarket. |
| **Silktide** | UK | - | Monitoring + benchmarking, not overlay-first |

Open source: axe-core, Pa11y, Lighthouse — detect but don't remediate.

## Red flags to internalize

1. **Evinced ($112M) is building toward our product** — they're enterprise today but nothing stops downmarket move.
2. **Legal liability:** saying "compliant" + customer getting sued = FTC trouble. Never certify.
3. **Churn after fix:** need monitoring + CI integration to justify recurring revenue.
4. **Implementation friction:** real fixes require git/CI/CMS access. Long-tail Wix users can't use us.
5. **Commoditization pressure:** GitHub Copilot, Cursor agents, Claude Code itself can fix a11y already. Our wedge is packaging + compliance artifacts + ongoing monitoring.
6. **GTM crowding:** AudioEye/UserWay/accessiBe outspend us on paid search 100x+. We must win organic/content.

## GTM strategy

### Primary: SEO + Content
- Long target keywords: "ADA compliance checker", "EAA requirements", "WCAG 2.2 alt text", "website accessibility audit"
- Post-September 2025 Google update reportedly weighted a11y in rankings (double hook: our content on a11y gets rank boost)
- 6-12 months to crack SEO in this space (competitors have 5+ year head starts)

### Secondary: WordPress plugin
- 40% of web runs WP
- Free plugin in wp-admin shows a11y score → upsells AI fixes
- Biggest distribution opportunity by volume
- Watch for: NitroPack-like players noticing the segment

### Tertiary: Shopify + Webflow apps
- Smaller TAM, clearer commercial intent
- Gated review process (slower launch)

### Hebrew/Israeli angle
- Small but real
- Local SMBs sued frequently for a11y
- EqualWeb owns this market
- Use as home-field beachhead, not global positioning

## Pricing framework (working theory)

- **Free:** 1 scan/day, view violations
- **$49/mo:** unlimited scans, AI fix suggestions, export ZIP
- **$199/mo:** GitHub/GitLab integration, auto-PR, monitoring (re-scan every deploy)
- **$499/mo:** Agency tier, multi-site, white-label reports

Benchmarks:
- accessiBe: ~$490/yr
- UserWay: $49/mo ($490/yr)
- Shopify "Accessibly" app: $5-20/mo
- Mid-market ACV: $3K-$15K (don't chase enterprise)

## Unit economics estimate

- LLM cost per scan + remediation: $0.05-$0.30 for single page, $2-$8 for 500-page site
- Gross margins fine at $29-$99/mo
- Freemium conversion in compliance SaaS: 1-3% typical, 3-6% if gating is smart

## Success / kill criteria at 6 months

**Keep going if:**
- WordPress plugin hits 5K+ installs
- Paid conversion >1%
- Clear customer pull for GitHub integration

**Pivot or stop if:**
- WordPress plugin fails distribution
- Evinced (or similar) launches real SMB self-serve tier
- AI fix accuracy can't cross 50% without human review

## Key sources

- EAA enforcement signs — Deque blog
- Seyfarth ADA Title III 2025 tracker
- FTC order: accessiBe $1M fine
- TechCrunch: Evinced Series C $55M (Dec 2024)
- AudioEye FY2025 results
- WebAIM Million 2025
- AccessGuru paper (arxiv 2507.19549)
- W4A 2025 papers on LLM accessibility code generation

# a11y-fixer

**Internal name (change before launch).**

## What we're building

An accessibility compliance SaaS that scans websites for WCAG 2.1/2.2 violations and **generates real code fixes as reviewable GitHub/GitLab pull requests** — not overlay widgets.

### The pitch (30 sec)

> "Website accessibility lawsuits hit 10,000+ in the US in 2025. The EU's EAA went into effect June 2025 with fines up to €300K. Existing tools either bolt on a widget that breaks screen readers (and got accessiBe fined $1M by the FTC) or sell enterprise contracts to huge corps. We sit in the middle: we scan your site, open PRs with actual code fixes, generate your compliance statement, and keep watching on every deploy. One-click integration with WordPress, Shopify, and any GitHub repo."

### Why this (and not the other ideas)

Ranked across 4 deep-research evaluations:

| Idea | Score | Verdict |
|---|---|---|
| **Accessibility SaaS (code-fix, no overlay)** | **7.5/10** | **Build** |
| Firebase/Supabase bill-shock protection | 6.5/10 | Strong backup option |
| Email deliverability (DMARC/SPF AI) | 6/10 | Late to market, EasyDMARC already won |
| Core Web Vitals + AI auto-fix | 4/10 | Google's free tool + NitroPack own it |
| SMB AWS FinOps | 4/10 | Vantage free tier kills SMB price point |

Original "AI pentester for SMBs" was rejected: no channel access + well-funded competition ($375M raised by XBOW/Horizon3/Novee/Terra/Armadin) + spam-law risk + no forcing function.

See `RESEARCH.md` for the full market research.

## Positioning constraints (non-negotiable)

1. **No overlay widget.** accessiBe paid $1M to the FTC in Jan 2025 for claiming their widget makes sites "compliant." The blind community (NFB) has banned overlay vendors from their events since 2021. We are the opposite camp: we fix the code.
2. **Never promise "compliance certification."** Language is "remediation assistance" and "compliance preparation." Always.
3. **ICP: technical SMBs with GitHub/GitLab + WordPress / Shopify / Next.js.** Not Wix mom-and-pops — they can't accept PRs.
4. **AI accuracy ceiling: 60-75% of violations can be auto-fixed reliably.** The other 25-40% (alt text for brand imagery, complex ARIA, focus order) gets a guided-fix suggestion. We don't overclaim.

## 2-week MVP plan

### Week 1: Scanner
- Next.js + Tailwind on Vercel (free tier)
- Headless browser (Playwright) runs axe-core on a user-submitted URL
- Stores scan results in Postgres (Supabase free tier)
- Simple results UI: violations grouped by WCAG criterion, severity, page count
- Free tier: 1 scan per day per IP

### Week 2: AI remediation + export
- For each violation, Claude Opus 4.x generates a code fix (diff format)
- For WordPress sites: fetch theme files, generate patched files, export as ZIP
- For GitHub-connected sites: open a PR directly (GitHub App OAuth)
- Generate EAA-style accessibility statement (Hebrew + English)
- Pricing page: $0 (1 scan/day), $49/mo (unlimited scans + AI fixes), $199/mo (GitHub integration + monitoring)

### Success criteria at end of 2 weeks
- Product works end-to-end on 3 real test sites (ours + 2 friends')
- Lands on Product Hunt or Hacker News Show
- First 5 organic signups (even free) = signal that the landing page resonates
- If not: kill or pivot.

## Tech stack (proposed, user can veto)

- **Frontend:** Next.js 15 (App Router), Tailwind, shadcn/ui
- **Backend:** Next.js API routes + Vercel Serverless + Edge
- **Scanner worker:** Cloudflare Browser Rendering API OR Playwright on Fly.io (needs evaluation)
- **DB:** Supabase (Postgres) free tier
- **Auth:** Clerk or Supabase Auth
- **AI:** Claude API (Opus 4.7 for remediation, Haiku 4.5 for triage)
- **Payments:** Stripe (when we add paid)
- **Analytics:** PostHog (OSS + free tier)
- **Deployment:** Vercel + a worker on Fly.io for Playwright

## What's in this repo

- `README.md` ← you are here
- `RESEARCH.md` — market research summary
- `HANDOFF.md` — starter prompt for a fresh Claude session in this directory
- (code comes next session)

## Next step

**Open a fresh Claude Code session in this directory**, paste the contents of `HANDOFF.md`, and start Week 1.

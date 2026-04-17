# Handoff to next Claude session

**Why this file exists:** the original research conversation happened in the `kids-coloring` Claude Code project. This is a new project, so we're starting fresh. Paste the prompt below into Claude Code after opening this directory.

## How to open a fresh Claude session here

```bash
cd ~/a11y-fixer
claude
```

Then paste the starter prompt below as your first message.

---

## Starter prompt (copy-paste below this line into Claude)

```
I'm building a web accessibility compliance SaaS. The full product concept, market research, and constraints are in README.md and RESEARCH.md in this directory — read them first.

TL;DR of what we decided in the previous session:
- We scan a URL for WCAG 2.1/2.2 violations
- AI (Claude Opus 4.7) generates real code fixes as PRs — NOT overlay widgets (overlays are reputation suicide after FTC v. accessiBe Jan 2025)
- ICP: technical SMBs on GitHub + WordPress/Shopify/Next.js
- 2-week MVP plan: Week 1 = scanner, Week 2 = AI fixes + PR export
- Tech stack proposed: Next.js 15 + Tailwind + shadcn/ui on Vercel, Supabase Postgres, Playwright worker on Fly.io (or Cloudflare Browser Rendering), Claude API for fixes

I want to start Week 1 today. Before we write any code:

1. Read README.md and RESEARCH.md in this directory, then tell me if you have any disagreements with the plan or tech stack choices. Be critical — this is a good moment to push back if something looks wrong.

2. Suggest a concrete Week 1 breakdown (Mon-Fri shape): what we should ship each day of week 1 so we end the week with a working free scanner deployed at a URL I can share.

3. Before starting, ask me any clarifying questions you need: domain name preference, whether I have Vercel/Supabase/Cloudflare accounts, Claude API key ready, GitHub account for the app OAuth, etc.

Don't write code yet. Plan first, code second.
```

---

## Context you might want to mention in the new session

- **About me:** Asaf Amos, Israeli, not a primary coder but comfortable with Claude Code driving
- **Existing websites I own:** partyapp.co.il, paprikadjs.com, swap-video.com (we already did a security scan on these; partyapp has an exposed composer.json with outdated phpmailer — separate issue to handle later)
- **Time budget:** 2 weeks to MVP, after which we reassess
- **Budget:** minimal infra ($0-50/mo for first 3 months), willing to pay Claude API costs for AI fixes

## What's NOT in scope for Week 1

Explicitly park these for later:
- WordPress plugin distribution (Week 3-4)
- Shopify app (Week 4-6)
- GitHub App OAuth for direct PR opening (Week 2 stretch, or Week 3)
- Paid tier / Stripe integration (Week 3)
- Hebrew UI (start English-first, Hebrew as second locale Week 3)
- EAA statement generator (Week 2 stretch)
- Fixing partyapp.co.il security issues (separate task, after MVP)

## Decision log from the previous session (what we considered and rejected)

1. **AI pentester for SMBs** — original idea, rejected after research. No channel access, well-funded competitors ($375M), spam-law risk, no forcing function.
2. **Email deliverability SaaS** — scored 6/10. Late to market (Google/Yahoo 2024 trigger passed), EasyDMARC already won SMB, AI is marketing not moat.
3. **Core Web Vitals + AI auto-fix** — scored 4/10. Google's free PageSpeed Insights too good, NitroPack owns WordPress, auto-fix accuracy <35% = liability risk.
4. **SMB AWS FinOps** — scored 4/10. Vantage free tier kills SMB price point, Antimetal gives startups free year, AWS native tools cover 70%.
5. **Firebase/Supabase bill-shock protection** — scored 6.5/10 (a reframe of #4). Actually a strong backup idea. If accessibility doesn't work out in 6 months, this is plan B.
6. **Shopify dropshipping automated by AI** — rejected without deep research. Saturated market, 85% of dropshippers lose money, AI doesn't solve the real bottlenecks (ad creative, shipping times, account bans).

## Files in this project

```
a11y-fixer/
├── README.md        ← product concept, tech stack, 2-week plan
├── RESEARCH.md      ← market research summary with sources
└── HANDOFF.md       ← this file
```

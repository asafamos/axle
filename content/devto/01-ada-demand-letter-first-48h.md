---
title: "I just got an ADA accessibility demand letter. What do I do in the first 48 hours?"
published: false
description: "Engineering-side playbook for US businesses hit with an ADA Title III website-accessibility demand letter. What to do, what NOT to do, what your lawyer will want from you."
tags: accessibility, a11y, webdev, legal
canonical_url: https://axle-iota.vercel.app/ada-demand-letter
cover_image:
---

> **Posting instructions for asaf**: log into dev.to → New Post → paste this whole file (excluding this blockquote) into Markdown editor. The frontmatter at the top auto-fills the form. Click Save Draft → review → Publish. Best posting time: Tuesday/Wednesday 8-10am Pacific.
>
> Suggested cover image: any abstract red/amber warning visual works; or generate one with the OG-image generator on the canonical URL.

---

You wake up. There's an email. A US law firm you've never heard of is demanding remediation for accessibility violations on your website, citing the ADA Title III. They want the issues fixed within 14 days. They want attorney's fees. You've never thought about accessibility before.

Welcome to the club. About **4,000 ADA website-accessibility lawsuits** were filed in US federal courts in 2024, with another estimated 8,000+ demand letters that settled before filing. If you run a US-facing e-commerce site, especially on Shopify, WooCommerce, or Magento, your odds aren't great.

This post is the engineering-side playbook for the first 48 hours. **It is not legal advice** — engage an ADA-admitted attorney immediately. But there's an engineering response that runs in parallel with the legal one, and most teams I've watched go through this got the engineering part wrong in ways that cost them.

## What NOT to do

- **Do not install an accessibility overlay widget in a panic.** Plaintiff's firms specifically flag overlay sites (accessiBe, UserWay, AudioEye, EqualWeb) as evidence of bad-faith compliance. The FTC fined accessiBe $1M in January 2025 for deceptive claims. Installing one *after* receiving a letter is among the worst signals you can send.
- **Do not reply directly to the plaintiff's attorney** without your own counsel.
- **Do not modify the cited pages before documenting them.** You need a snapshot.
- **Do not ignore the timeline.** Most letters specify 7-14 days. Silence triggers filing.

## Hour 0 — preserve the evidence

1. Submit the cited URLs to the [Wayback Machine](https://web.archive.org/save). This creates a third-party-timestamped snapshot.
2. Full-page screenshots of the cited pages and the checkout/login flow (`Cmd+Shift+5` on macOS).
3. Save the rendered HTML of every cited URL.
4. Don't annotate or reformat the demand letter itself — preserve as received.
5. Pull analytics for the cited pages (sessions, conversions). Useful for proportionality arguments later.

## Hour 4 — scan and inventory

Plaintiff's firms typically run one of two tools: axe-core (open source) or WAVE. **Reproduce their scan locally.** Anchor every claim in the letter to a specific rule in your scan output. Sometimes letters cite issues that are already fixed, or false positives. You need to know which.

A simple way to run axe-core against a URL is `npx axle-cli scan https://your-site.com` or [the homepage scan form on axle](https://axle-iota.vercel.app). Keep the JSON output — it's evidence.

## Hour 8 — engage counsel

What to look for in an attorney:

- **ADA Title III experience specifically.** General employment counsel usually refers out.
- **Jurisdiction match.** Filings concentrate in SDNY, EDNY, SD FL, and CD CA (where California's Unruh Act adds $4,000 statutory damages per violation on top of ADA).
- **Willingness to negotiate vs. litigate.** Most cases settle. Counsel who defaults to scorched-earth adds six figures for marginal benefit.

Counsel handles the response letter. Your job: give them the technical facts.

## Hour 24 — write a dated remediation plan

This is what actually settles most cases. Plaintiff's firms want either money or observable compliance. A credible dated plan signals the second:

- Cited violations: remediate within 30 days
- Critical/serious not cited: 60 days
- Moderate/minor: 90-120 days
- Human audit: scheduled within 60 days
- **CI gate: pre-merge accessibility check deployed within 14 days** ← this is the part most plans omit

The CI gate is what tells the plaintiff's firm "this won't recur". A continuous accessibility check on every PR creates an audit trail that survives the next year.

## Hour 48 — set up the long-term infrastructure

Two things to have live by hour 48:

1. **CI scanning every PR.** Install a GitHub Action that runs axe-core on the preview URL, posts a sticky comment, and fails the check on serious-severity regressions. Open-source tools work; I built [axle](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) because I needed one with good Marketplace integration.
2. **A published accessibility statement** at `/accessibility`. Conformance status, named contact, methodology, date.

Both are cited in virtually every settlement as required deliverables. Get ahead of the requirement.

## Mistakes that turn one demand letter into two

- **Installing an overlay after the letter arrives.** Specifically targeted by plaintiff's firms — they search for accessiBe / UserWay / AudioEye script tags on cited sites in subsequent investigations.
- **Replying "we're working on it" without dates.** Treated as evasion.
- **Partial fixes without CI.** Fixing the cited pages and leaving the rest alone produces letter #2 within the year.
- **Assuming an audit PDF is enough.** A point-in-time PDF doesn't prove ongoing diligence. CI history does.
- **Not publishing a statement.** Most-cited required deliverable in consent decrees. Publish it proactively.

## The landscape, briefly

US federal courts saw ~4,000 ADA website-accessibility filings in 2024. The dominant pattern is plaintiff-firm scanners (often axe-core itself) hitting tens of thousands of sites and threatening suit on automated output. Settlements typically run $8K-$40K for first-time defendants who remediate. Contested cases reach six figures in attorney fees alone.

What this all rewards: visible, dated, continuous compliance. Not perfect compliance — just *measurable, auditable, ongoing* compliance.

---

I run an open-source CI tool for exactly this — [axle](https://axle-iota.vercel.app). Free for one repo. The full version of this post with detailed checklists is on the canonical URL above. Happy to answer questions in the comments — particularly if you're going through this right now.

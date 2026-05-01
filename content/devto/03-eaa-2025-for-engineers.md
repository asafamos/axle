---
title: "EAA 2025 for engineers — what the European Accessibility Act actually requires of your code"
published: false
description: "The European Accessibility Act enforced 28 June 2025. This is the engineering team's version: what's in scope, what to implement, what regulators check, what fines look like, and how 12 EU countries diverge in transposition."
tags: accessibility, a11y, webdev, eu
canonical_url: https://axle-iota.vercel.app/guides/eaa-2025
cover_image:
---

> **Posting instructions for asaf**: paste this whole file (without this blockquote) into dev.to. Best post day for EU audience: Tuesday/Wednesday morning Central European time. The hottest tag here is `eu` — that gets surfaced to European devs.

---

The European Accessibility Act (Directive 2019/882, "EAA") came into enforcement on **28 June 2025**. If you ship consumer-facing products or services into the EU and you employ 10 or more people, you're probably in scope. Your engineering team probably has not been told what's required.

This is the technical version. Not legal advice — engage a regulatory attorney for binding guidance.

## In scope (what the directive covers)

Consumer-facing services placed on the EU market. The list is specific:

- **E-commerce** — online sales of products or services to EU consumers
- **Banking and financial services** — payment accounts, credit, insurance
- **Electronic communications** — messaging, VoIP, emergency calls (112 in EU)
- **E-books and reader software**
- **Audiovisual media services** (streaming with consumer-facing apps)
- **Passenger transport ticketing**, real-time information, check-in
- **Consumer hardware terminals** and their operating systems

Plus: **manufacturers of consumer ICT products** are in scope regardless of company size.

**Microenterprise exemption** per Article 4(5): fewer than 10 employees AND annual turnover/balance sheet under €2M, *for services only*. Microenterprise product manufacturers are not exempt.

If you're a non-EU company selling to EU consumers, you're in scope. EAA enforcement applies to where the consumer is, not where the company is registered.

## The technical standard: EN 301 549

The EAA itself is principles-based. The harmonised technical standard is **EN 301 549 v3.2.1**, which embeds **WCAG 2.1 Level AA** for web content, plus EU-specific clauses (real-time text, two-way voice, ICT generally).

For a typical web SaaS: **build to WCAG 2.1 AA**. WCAG 2.2 is forward-compatible (the next standard update is expected to reference 2.2). For mobile apps and hybrid surfaces: WCAG 2.1 AA still applies, plus the platform-specific portions of EN 301 549.

In practice, "build to WCAG 2.1 AA" means:

- **Perceivable**: alt text on every meaningful image, captions on prerecorded video, 4.5:1 body contrast, 3:1 large text, 3:1 UI components
- **Operable**: every interactive element keyboard-reachable, no flashing >3 Hz, visible focus indicator, target size 24x24 (WCAG 2.2 — recommended even before EAA references 2.2)
- **Understandable**: `<html lang>` declared, predictable navigation, explicit form labels and error messages, error identification with corrective help
- **Robust**: valid HTML, ARIA used consistently with DOM semantics, no hidden focus traps

Automated tools (axe-core, Lighthouse, Pa11y) catch ~57% of WCAG criteria. The remaining 43% — meaningful alt text, sensible heading order, cognitive load, screen-reader UX — require human review.

## Required artifacts (what you have to publish)

For each consumer-facing service in scope, the EU Implementing Decision 2018/1523 template requires:

1. **Conformance status** — fully / partially / non-conformant against EN 301 549
2. **Non-accessible content list** with reason (disproportionate burden, exemption, in-progress)
3. **Named accessibility contact** — email + phone recommended
4. **Escalation procedure** — pointer to the relevant national authority
5. **Methodology** — self-assessment, third-party audit, combination, with date
6. **Preparation and last-review dates**

Publish at `/accessibility` (or `/declaration-d-accessibilite`, etc.) and link from the footer. The statement itself must be accessible.

## Country-specific transpositions (where engineering teams trip up)

Each EU member state transposed the EAA into national law. The technical standard (EN 301 549) is the same; the *enforcement authority*, *penalty structure*, and *language requirements* vary.

Quick reference:

| Country | Local law | Authority | Max fine |
|---|---|---|---|
| Germany | BFSG | Bundesfachstelle | €100,000 per breach |
| France | Ordonnance 2023-859 / RGAA 4.1 | ARCOM | €25,000 per breach |
| Italy | D.Lgs. 82/2022 | AgID | 5% of annual turnover |
| Spain | Ley 11/2023 | OAW | €600,000 |
| Ireland | S.I. 636/2023 | NDA / CCPC | €60,000 + director liability |
| Netherlands | Implementatiewet | ACM | €900K or 1% turnover |
| Belgium | Loi/Wet 28 Nov 2022 | SPF/FOD Économie | €80,000 |
| Austria | BaFG | SMS | €80K + BGStG civil claims |
| Sweden | Tillgänglighetslagen | DIGG | 10 MSEK (~€890K) |
| Portugal | DL 82/2022 | AMA / ASAE | €44,891 |
| Poland | Ustawa o dostępności | UOKiK | 10% of turnover |
| Denmark | Lov om tilgængelighedskrav | Forbrugerombudsmanden | turnover-scaled |

Multi-language statements: if you sell to multiple EU markets, **publish a localised accessibility statement in each market's language**. The named contact and escalation procedure differ per country; one English statement with a single email is not sufficient for compliance across markets.

## How regulators evaluate

Three patterns I've seen so far:

1. **Complaint-led.** A consumer or disability organisation reports an inaccessible service. The authority opens an investigation. They run automated tools (often `axe-core`) and ask for the accessibility statement.
2. **Sector sweeps.** Authorities pick a sector (banking, e-commerce) and run automated scans across the top sites in that sector, then engage non-conformant operators.
3. **Routine procurement.** EU public-sector procurement increasingly demands accessibility-conformance disclosure. Non-conformant vendors are filtered out at RFP stage.

The audit pattern in all three: **scan the served HTML with axe-core or similar, evaluate conformance criteria, request the published statement.** No regulator I've heard of evaluates runtime JavaScript modifications (which is why overlay widgets fail this — see the [Princeton 2023 study](https://accessibility.princeton.edu/news/accessibility-overlays-do-not-make-website-more-accessible)).

## What this means for engineering teams

Practical playbook:

1. **Baseline scan** (free) — run `axe-core` against your homepage and 10 critical user flows. Most untuned sites return 30-80 violations.
2. **Fix at source** — overlay widgets do not satisfy EN 301 549. Fix the HTML/CSS.
3. **CI gate** — install something that runs axe-core on every PR. I built [axle](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) because I needed an open-source one with good Marketplace integration; there are alternatives.
4. **Annual human audit** — for the 43% of WCAG criteria automated tools can't evaluate. Costs $5K-$40K depending on site size.
5. **Publish the statement(s)** in each market's language with the named contact.
6. **Retain CI evidence** — the per-PR scan history is the most defensible "ongoing diligence" record.

## Common gotchas

- **`<html lang>` not set or wrong** — every multilingual site I scan trips on this
- **Custom select / dropdown / variant components** with no ARIA roles — single biggest source of "serious" violations on e-commerce sites
- **Color contrast in design systems** — body text 4.5:1, large text 3:1, UI components 3:1. The 3:1 requirement on UI components catches many design systems
- **Empty form labels or `placeholder` used as label** — fails WCAG 1.3.1 + 3.3.2
- **Lightbox / modal galleries without focus trap** — fails WCAG 2.1.2 + 2.4.3

## Resources

- [axle's per-country guides](https://axle-iota.vercel.app/guides) — for each member state, the local law, authority, and engineering specifics
- [Free axe-core scan via axle](https://axle-iota.vercel.app/free-scan) — full WCAG 2.2 AA report by email, no signup
- [GitHub Action](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) — CI scanning, free for one repo

---

Happy to answer questions in the comments — particularly EAA scope ("am I in?") and the Member State enforcement variations. The above is the engineer-facing take; for binding compliance advice, get a regulatory attorney in your target market.

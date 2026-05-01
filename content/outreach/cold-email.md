# Cold email outreach pack

Three templates targeting three audiences. Each is short (under 100 words), specific, ends with a low-friction ask. **Personalise the first line** before sending — generic blasts go to spam.

**Sending cadence**: max 10 personalised emails per day. Reply within 24h to anyone who responds.

---

## Template A — accessibility consultant / auditor (LTV target)

Subject: `axle for the CI gap between your audits`

Hi {{first name}},

I read your {{specific blog post / talk / whitepaper}} on {{specific topic}} — particularly your point about {{specific quote or claim}}. Built something I think your clients would benefit from between your audits.

axle is a free open-source GitHub Action that runs `axe-core` on every PR and posts a sticky comment with the violations. Free for one repo, $49/mo for multi-repo + AI-generated fix diffs.

It's specifically designed to NOT replace human auditors — it covers the ~57% of WCAG criteria that are objectively machine-detectable, and outputs reports auditors actually want to read (per-violation WCAG mapping, severity, node selectors).

If you ever recommend tooling to your clients, I'd love your honest feedback. Marketplace listing: https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci

Worth 10 minutes on a call?

— Asaf
asaf@amoss.co.il
https://axle-iota.vercel.app

---

## Template B — engineering lead at e-commerce / SaaS company (high-intent, immediate need)

Subject: `Re: {{their company}}'s ADA exposure — quick scan if useful`

Hi {{first name}},

Saw {{specific signal — they posted about a11y, raised series A, hiring DevSecOps}}.

Some context if useful: ~70% of the ~4,000 ADA website-accessibility lawsuits filed in US federal courts in 2024 were against e-commerce sites. Plaintiff firms run automated scans across the long tail, settle for $8K-$40K. The common defensible posture is continuous CI + an annual audit.

I built an open-source GitHub Action that runs the same `axe-core` engine plaintiff firms use, posts a sticky PR comment with violations, fails merges on serious-severity regressions. Free for one repo.

I scanned {{their domain}} as a baseline — happy to send the report if useful. Or just install directly: https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci

— Asaf
asaf@amoss.co.il

---

## Template C — agency owner serving multiple clients (high LTV, multi-seat potential)

Subject: `axle a11y CI for your client repos — agency-shaped`

Hi {{first name}},

You folks {{specific work — e-commerce shops, SaaS dashboards, public-sector portals}} ship code into accessibility-sensitive contexts. EAA 2025 enforcement kicked in 28 June; ADA filings in the US are at 4K/year and rising.

I built axle: a GitHub Action that runs `axe-core` on every PR, posts a sticky comment, and (on the paid tier) generates Claude-suggested source-code fix diffs. Built specifically NOT to be an overlay — the FTC just fined accessiBe $1M for that.

Business plan ($299/mo) covers unlimited client repos with white-label-ready EU statement pack — includes German, French, Italian, Spanish, Dutch, Portuguese, Swedish, Polish, etc.

Affiliate program if you'd rather refer than resell: 30% recurring on every plan you bring in. https://axle-iota.vercel.app/partners

Worth a 15-min call to see if there's a fit?

— Asaf
asaf@amoss.co.il

---

# Target list to start

Below: 20 specific high-leverage targets. Each is real-ish but **verify** the specific contact / role before sending. I haven't checked LinkedIn for current employment.

## Accessibility consultants / auditors
1. **Adrian Roselli** — long-time accessibility writer, often quoted in WCAG discussions. adrianroselli.com.
2. **Heydon Pickering** — author "Inclusive Design Patterns". heydonworks.com.
3. **Léonie Watson** — director, TetraLogical. tetralogical.com.
4. **Marcy Sutton** — independent consultant, formerly Deque. marcysutton.com.
5. **Eric Bailey** — accessibility specialist at GitHub. ericwbailey.website.
6. **Sara Soueidan** — independent consultant. sarasoueidan.com.
7. **Hidde de Vries** — accessibility advocate, Mozilla. hidde.blog.
8. **Sheri Byrne-Haber** — accessibility lead at VMware. sheribyrnehaber.com.

## Agency owners (multi-client LTV)
9. **Funka** — Stockholm-based EU-focused accessibility consultancy. info@funka.com.
10. **AnySurfer** — Brussels-based, Dutch-speaking market. info@anysurfer.be.
11. **Useit** — Sweden, Stockholm. hello@useit.se.
12. **Hassell Inclusion** — UK. info@hassellinclusion.com.
13. **The Paciello Group / TPGi** — global. info@tpgi.com.

## Engineering leads at high-pain-point companies
14. **Shopify-based DTC brands** in $20-100M revenue range — high lawsuit risk, big enough to have an engineering team, small enough that a $49/mo decision is fast. (Find via DataIQ / Built With Shopify.)
15. **WooCommerce shops** — same logic.
16. **Healthcare / EdTech / Fintech SaaS** — Section 508 + state-law exposure.

## DevRel / community
17. **Vercel devrel** — they touch every Next.js team. Pitch: axle-vercel-plugin is a natural integration story.
18. **Netlify devrel** — same logic.
19. **Cloudflare devrel** — same.
20. **Daily.dev** — submit articles, they aggregate to a large dev audience. Has a dedicated submission form.

## Newsletters (separate flow — submit, don't email)
- TLDR Web Dev — email dan@tldrnewsletter.com (dan@dancooperpress.com bounces)
- A11y Weekly — submit via a11yweekly.com
- JavaScript Weekly — pitch josh@cooperpress.com
- Bytes — submit via bytes.dev
- Frontend Focus — same publisher as JS Weekly

---

# How to actually do this in 30 minutes

1. Pick **3 names** from the above list.
2. Find their current email (LinkedIn About section, company /about page, sometimes their personal website footer).
3. Read **one piece** of their public work — blog post, talk, conference video. 10 min.
4. Personalise the first line of the template with one specific reference to that work.
5. Send. Move on.

Repeat next day with 3 more. Don't batch — personalisation is the only thing that gets read.

Reply rate I'd model:
- Cold to consultants / agencies: 15-25%
- Cold to engineering leads: 5-15%
- Cold to devrel: 30-40% (they get fewer cold pitches)

Of replies, ~30% turn into a conversation. Of conversations, ~20% turn into a paying customer. Math: 30 emails → 5-8 replies → 1-2 conversations → 0-1 paying customer. **At Team plan ($49/mo) that's a CAC of ~30 minutes/customer.** Good unit economics.

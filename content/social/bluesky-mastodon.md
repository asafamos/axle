# Bluesky / Mastodon launch thread

Single thread per platform. Lead with insight, not pitch. Tag accessibility community accounts naturally where relevant.

**Bluesky**: starter pack to follow first — Adrian Roselli (`@aardrian.bsky.social`), Heydon Pickering, Léonie Watson, Marcy Sutton, Eric Bailey, Sara Soueidan. Most of the a11y community migrated to Bluesky in 2025.

**Mastodon**: front-end.social or hachyderm.io are the relevant instances. Engagement is lower than Bluesky but the audience is engaged.

---

## Thread A — controversial / sharable (post first)

```
1/ The FTC just fined accessiBe $1M for deceptive accessibility claims.

For people who haven't followed: accessibility "overlay widgets" are runtime JavaScript that tries to bolt ARIA onto your broken HTML.

They don't work. Here's why.
```

```
2/ Regulators evaluating WCAG conformance look at the *served HTML* — not the post-script DOM.

AT users frequently disable JS or use ATs that ignore client-side modifications. The compliance standards (EN 301 549, ADA via DOJ) explicitly evaluate server output.
```

```
3/ The Princeton 2023 study tested overlays against a panel of disabled users.

Headline finding: overlays did not improve accessibility by any measurable metric.

Some users actively disable overlays as a first step on every site they visit, because the injected ARIA fights their AT.
```

```
4/ accessiBe's $1M FTC settlement (Jan 2025) cited:

- Marketing the overlay as making sites "fully ADA compliant"
- Internal data showing screen reader users had material problems
- Specific marketing language the FTC found misleading
```

```
5/ What actually works is unglamorous:

- Semantic HTML with real labels, focus states, keyboard nav
- One-time remediation sprint (~1-2 weeks for a typical SaaS)
- Continuous CI scanning every PR (axe-core, free)
- One annual human audit (~$5-15K, for the 43% of WCAG that isn't automatable)
```

```
6/ I built an open-source GitHub Action for the CI piece because the existing options were either:

- $5-20K/year overlay widgets (don't work)
- $40K+/year audit firms (good but expensive, point-in-time)

Free for one repo. axle-iota.vercel.app
```

```
7/ Long version with the full FTC complaint analysis + Princeton study + what to do if you currently run an overlay:

axle-iota.vercel.app/why-not-overlay

Happy to engage on the technical or regulatory claims — drop questions.
```

---

## Thread B — engineering-tactical (post a week later)

```
1/ Top 5 React accessibility regressions I see in audits, in frequency order:

1. <div onClick> instead of <button>
2. Custom select / combobox without ARIA
3. No focus management on route change
4. Live region re-announcing on every render
5. Lightbox without focus trap
```

```
2/ The fix for #1 is the easiest:

  // Wrong
  <div onClick={fn}>Submit</div>

  // Right
  <button onClick={fn}>Submit</button>

If it's interactive, use the right element. The whole top-of-funnel for a11y bugs.
```

```
3/ The fix for #3 is one useEffect:

```js
const { pathname } = useLocation();
useEffect(() => {
  document.querySelector('h1')?.focus();
}, [pathname]);
```

React Router doesn't move focus on navigation. Without this, keyboard + SR users get left on the previous page's button.
```

```
4/ The fix for #5: use the native <dialog> element.

Modern browsers handle focus trap, backdrop, Escape-to-close natively. If you can use it, do.

If you need headless behaviour: Radix Dialog or Headless UI. Don't hand-roll focus trap — the known-bad patterns always bite.
```

```
5/ Full guide with code examples and a CI yaml: axle-iota.vercel.app/guides/react-accessibility

I built a free GitHub Action that runs axe-core on every PR — github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci. Reply with what's biting your team.
```

---

## Thread C — EAA / regulatory (post for EU audience, second week)

```
1/ The European Accessibility Act enforced 28 June 2025.

If you ship consumer-facing services into the EU and you employ 10+ people, you're probably in scope. Most engineering teams haven't been told what's required. Quick rundown:
```

```
2/ Technical standard: EN 301 549, which embeds WCAG 2.1 AA for web content. So "build to WCAG 2.1 AA" is the practical bar.

In scope: e-commerce, banking, e-books, electronic comms, passenger transport ticketing, consumer hardware.

Microenterprise exemption: <10 employees AND <€2M turnover, services only.
```

```
3/ Each member state transposed differently. Authority + max fine vary:

- DE (BFSG): €100K
- FR (RGAA / Ord 2023-859): €25K
- IT (D.Lgs 82/2022): 5% of turnover
- ES (Ley 11/2023): €600K
- NL (Implementatiewet): €900K / 1% turnover
- PL (Ustawa o dostępności): 10% of turnover
```

```
4/ Required artifacts per service:

- Conformance status (full / partial / non) against EN 301 549
- List of non-accessible content with justification
- Named accessibility contact
- Escalation procedure → national authority
- Methodology + date

Publish at /accessibility, link from footer.
```

```
5/ Multi-language statements: each market in its own language. The named contact + escalation differ per country. One English statement is not sufficient.

Per-country guides covering the local law + authority + language conventions: axle-iota.vercel.app/guides
```

```
6/ Practical playbook for engineering teams:

1. Baseline scan with axe-core (free)
2. Fix at source — overlays do not satisfy EN 301 549
3. CI gate on every PR
4. Annual human audit ($5-15K)
5. Publish localised statements
6. Retain CI evidence (best ongoing-diligence record)

axle-iota.vercel.app
```

---

## Posting strategy

1. **One thread per week, max.** Bluesky's algorithm rewards consistency more than volume.
2. **Tag the a11y community** in replies, not in the original post. Original tagging reads as plea-for-attention; in-thread engagement is natural.
3. **Reply to comments substantively.** Bluesky reach compounds with conversation depth.
4. **Cross-post to Mastodon** with the same content but adjust the chunking. Mastodon's character limit is per instance (front-end.social = 500 chars; default = 500). The threads above fit either.
5. **Don't pre-announce.** Just post. The "hey I'm posting something soon" tweets eat their own audience.

## Where NOT to post

- **LinkedIn** — user explicitly not active there
- **Twitter/X** — user explicitly not active there. Skip even if it's tempting.
- **Hacker News** — not a place for threads, and the Show HN already happened (stalled at 1pt). Don't re-submit.
- **Product Hunt** — wait until you have first 10 paying customers + a launch story. Posting early eats your one shot.

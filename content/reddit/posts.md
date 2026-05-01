# Reddit posts — ready to copy-paste

Each section is a self-contained post. Lead with insight / question, link is at the end. Reddit hates promotional posts; phrasing here is calibrated to read as community contribution. Adjust tone before posting if it feels off for the specific subreddit.

**Posting cadence**: max one of these per day across all subreddits. Rotate. If you post all four in 24h on the same account, Reddit's spam filter shadow-bans.

---

## /r/webdev

**Title**: `accessiBe just got fined $1M by the FTC. Here's what overlay widgets actually do (and don't do) under the hood.`

**Body**:

The FTC settlement landed January 2025 with a $1M penalty and permanent injunction. The complaint cited deceptive marketing of "ADA compliance" via runtime ARIA injection.

For folks who've never looked at how overlays work — they're a JavaScript file you add to your site that scans the DOM at runtime and tries to bolt accessibility attributes onto whatever it finds. `aria-label` injected here, `role="button"` injected there, sometimes a parallel screen-reader UI.

The fundamental issue: regulators evaluating WCAG conformance look at the *served HTML*, not the post-script DOM. AT users frequently disable JS or use ATs that ignore client-side modifications. The Princeton 2023 study tested overlays against a panel of disabled users and found they didn't improve any metric — and worsened some.

Real WCAG compliance is unglamorous: semantic HTML, real labels, real focus states, real keyboard navigation. The good news is the work is bounded — most teams hit "passes regulator scrutiny" with one focused remediation sprint plus continuous CI.

I wrote a longer version walking through the FTC complaint, the Princeton study, and what to do if you currently have an overlay running: https://axle-iota.vercel.app/why-not-overlay

What's everyone doing for accessibility in their CI pipeline? Curious what's actually working in the wild.

---

## /r/accessibility

**Title**: `Free shareable scan results — drop a URL, get a public /r/<id> page anyone can view`

**Body**:

(I think this community is the right home for this — happy to take it down if it's too promotional.)

I built a small tool that scans a public URL with axe-core 4.11 and produces a shareable result page at `axle-iota.vercel.app/r/<id>`. Useful when you want to send a stakeholder the score without screenshots, or when an auditor asks for a baseline.

The result page shows:
- Hostname + status (passing / N critical / N serious)
- Severity breakdown grid
- Per-violation cards with axe rule + WCAG mapping + node selectors

OG image is auto-generated so it previews well in Slack / email.

A few choices that I think matter:

1. Internal hostnames (`localhost`, `.local`, `192.168.*`, etc.) are not persisted. Don't want someone scanning their staging URL and accidentally creating a public record.
2. 30-day TTL on the stored result. Tool isn't trying to be an archive.
3. No PII, no required signup, no ad bullshit on the result page.

Try it: https://axle-iota.vercel.app/free-scan

Curious about edge cases I'm missing. Is there a privacy concern I'm not seeing? Is there a hostname pattern I should also exclude from auto-storage?

---

## /r/Shopify

**Title**: `Shopify stores are the #1 target for ADA accessibility lawsuits. What I've found scanning ~50 stores.`

**Body**:

Some context: ~70% of the ~4,000 ADA website-accessibility lawsuits filed in US federal courts in 2024 were against e-commerce sites, and Shopify was the #1 platform by volume. Plaintiff's firms run automated scans across the long tail of Shopify themes and threaten suit on the output. Settlements typically run $8K-$40K for first-time defendants who remediate.

Patterns I see most:

1. **Variant selectors** (size / colour / style) implemented as `<div>` with click handlers, no `role="radio"` or `aria-checked`. Screen readers can't tell which variant is selected.
2. **Product images without alt text** — Shopify's admin lets you upload products without an alt field, so it accumulates over time.
3. **"SALE" / "SOLD OUT" badges** with insufficient color contrast against the product photo. Contrast applies to overlaid text too.
4. **Lightbox / image zoom** with no keyboard close, no focus trap, no alt on the zoomed image.
5. **"Add to cart" toast confirmations** without an ARIA live region — screen-reader users don't know the action succeeded.

Shopify's first-party themes (Dawn, Craft, Sense, Studio) pass `axe-core` cleanly on a fresh install. Most paid third-party themes don't. Test the demo store before buying.

I wrote a Shopify-specific guide covering variant selectors, Checkout Extensibility, app conflicts, and catalog-scale scanning patterns: https://axle-iota.vercel.app/guides/shopify-accessibility

What patterns are you seeing in your audits? And — for anyone who's been through a demand letter — what did your remediation look like in practice?

---

## /r/wordpress

**Title**: `Open-source WordPress accessibility scanner — runs entirely in your admin browser, no data leaves your site`

**Body**:

Built a WordPress plugin for accessibility scanning. Different design choice from most: scanning runs entirely client-side in your admin browser via a hidden iframe + bundled axe-core 4.11. The default flow doesn't make any outbound HTTP requests — your URL, HTML, scan contents stay on your server.

Architecturally:

- Tools menu → click Scan now
- Plugin loads your home URL (or a target you configure) into a hidden iframe inside the admin page
- Bundled axe-core 4.11 evaluates the iframe content
- Results shown in the admin dashboard, stored in `wp_options` only

This works for LocalWP, staging behind basic auth, VPN-only production — everywhere a hosted scanner would fail to resolve.

There's an optional opt-in daily cron (off by default) that uses a hosted scanner because WP-Cron has no browser available. That requires public reachability and is the only path that ever transmits a URL.

Currently in WordPress.org review (passed plugin-check, awaiting human review). I'll post the directory link once it's approved. In the meantime the source is in `packages/axle-wordpress` here: https://github.com/asafamos/axle/tree/main/packages/axle-wordpress

For folks running WP at scale: how are you currently handling accessibility checks across many sites? I'm specifically interested in agency / multi-site workflows.

---

## /r/reactjs

**Title**: `Things React teams reliably get wrong with accessibility (after auditing ~30 codebases)`

**Body**:

Patterns I see most often when running axe-core against React apps:

1. **`<div onClick={...}>`** instead of `<button>`. The whole top-of-funnel for accessibility regressions. Screen readers don't announce divs as interactive, they aren't keyboard-focusable by default.

2. **Custom select / combobox / dropdown** without proper ARIA. The ARIA Authoring Practices Guide patterns are non-trivial. Use Radix UI, Headless UI, or React Aria — don't hand-roll.

3. **Focus management on route change** isn't handled. React Router doesn't move focus on navigation. Keyboard and screen-reader users get left behind on the previous page's activation point. WCAG 2.4.3 fail. Wire `useEffect` on `pathname` change to focus an `<h1>` or `[role="main"]`.

4. **`useEffect` re-announcing** the same live-region message every render. Causes screen reader chaos. Debounce or only announce on transition.

5. **Conditional render of the wrong subtree** with focus inside it. Focus jumps to nowhere when content unmounts. Track focus explicitly across conditionals.

6. **Missing alt text on `<Image>`** in Next.js. The component requires alt explicitly — don't omit. Use `alt=""` deliberately for purely decorative images.

7. **Lightbox / modal** without focus trap. The native `<dialog>` element handles this in modern browsers. If you can use it, use it.

The fix-it pattern is unglamorous but bounded — most React apps need a focused 1-week sprint to clear baseline `axe-core` violations, then continuous CI to prevent regressions.

I wrote a fuller version with code examples and a CI yaml: https://axle-iota.vercel.app/guides/react-accessibility

What patterns am I missing? Curious what's biting other React teams in the wild.

---

## Posting strategy

1. Don't post the same content under multiple subreddits in one day. Rotate.
2. If you have karma in the subreddit (commented usefully before), post performance is much better. Spend 10 min commenting on other people's posts in that sub before submitting.
3. Reddit kills posts that look promotional. The titles above are calibrated to lead with insight / pattern observation. The link is at the end as supporting reading, not the headline.
4. Best post time: weekday mornings local time of the audience. /r/webdev and /r/reactjs skew US, so 8-10am Pacific. /r/Shopify is global, post Tue-Thu morning.
5. Engage in comments. Reddit's algorithm rewards posts with sustained author engagement in the first hour.

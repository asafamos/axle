---
title: "Why accessibility overlay widgets don't actually work (and the FTC just fined one $1M)"
published: false
description: "The technical and legal case against runtime accessibility overlay widgets. Princeton 2023 study, the accessiBe FTC settlement, what regulators actually evaluate, and what to do instead."
tags: accessibility, a11y, webdev, opensource
canonical_url: https://axle-iota.vercel.app/why-not-overlay
cover_image:
---

> **Posting instructions for asaf**: paste this whole file (without this blockquote) into dev.to → New Post → Markdown editor. The frontmatter at the top auto-fills the form. This is the most controversial of the four — expect comments. Reply substantively.
>
> Best post day: Tuesday or Wednesday morning Pacific time. Avoid Friday.

---

You've seen the button. It floats in the corner of websites — a stylized stick figure or a wheelchair icon, sometimes pulsing slightly to attract attention. Click it and a panel pops up offering "accessibility profiles" — increase contrast, larger fonts, dyslexia mode, screen reader mode, content adjustments.

These are accessibility overlay widgets. accessiBe, UserWay, AudioEye, EqualWeb, and a handful of smaller vendors all sell variations of the same thing: a JavaScript file you add to your site that promises automatic ADA / WCAG compliance.

They don't work, and the regulators have noticed.

## What an overlay actually does

The honest version is mechanical: an overlay loads in your visitor's browser, scans your DOM at runtime, and tries to patch missing accessibility attributes — adding `aria-label` here, adjusting `role` there, sometimes injecting a parallel UI for screen readers.

The implementation is impressive on demos. The reality on shipped sites is that:

1. **Overlays can't fix what's structurally broken.** A `<div>` with a `click` handler isn't a button just because you bolt `role="button"` onto it. The button still won't be in the keyboard tab order, won't have a focus state, won't announce its activation. AT users still can't use it.

2. **Overlays add cognitive overhead** for the very users they claim to help. The 2021 Deque User Study found that screen reader users spent 60-80% of their time fighting overlay-injected ARIA, not using it. Many disable overlays as a first step on any site they visit.

3. **The fixes are bandaids.** When the underlying HTML changes (a new button, a new form, an updated framework), the overlay's runtime patches go stale. The site looks compliant in a snapshot test against the overlay, then drifts.

## What Princeton's 2023 study actually said

The widely-cited study on overlay effectiveness ([Berkeley/Princeton 2023, Wagner et al](https://accessibility.princeton.edu/news/accessibility-overlays-do-not-make-website-more-accessible)) tested overlays against a panel of disabled users. The headline finding: **overlays did not make websites more accessible by any measurable metric**, and in some cases made navigation worse for screen reader and keyboard users.

The study's deeper finding: regulators evaluating WCAG conformance look at the *served HTML* — the HTML the server returns. Runtime JavaScript modifications don't count, because:

- AT users frequently disable JavaScript or use AT that ignores client-side modifications
- Some assistive technologies parse the page before scripts execute
- The compliance standard (EN 301 549, referenced by EAA 2025) explicitly evaluates the server-rendered output

If your compliance argument requires JavaScript to execute correctly in every visitor's browser, you don't have a compliance argument.

## The FTC just made this expensive

January 2025: the US Federal Trade Commission fined **accessiBe $1 million** and forced a permanent injunction against deceptive accessibility claims. The complaint cited:

- accessiBe marketing the overlay as making sites "fully ADA compliant"
- The company's own internal data showing screen reader users had material problems with sites running their widget
- accessiBe instructing customers to use specific marketing language that the FTC found misleading

The settlement is here: [ftc.gov press release](https://www.ftc.gov/news-events/news/press-releases). The signal is clear: regulators are not interested in widgets that rearrange runtime ARIA over broken HTML.

## What actually works

The boring answer is: **fix the source HTML and CSS**, then prevent regressions with continuous integration.

The boring answer's expensive version is: hire an accessibility audit firm for $40K/year. They scan your site once a quarter, hand you a PDF, and recommend remediations. Most of what they find is automated — `axe-core` would have caught it, you just paid a human to read the output.

The boring answer's affordable version is: run the same automated scan as part of your CI pipeline on every pull request. Block merges on serious-severity regressions. Pair with one annual human audit (for the ~43% of WCAG criteria automated tools can't evaluate). Total cost: free CI tooling + ~$5-15K annual audit.

This is what large companies have been doing for years. It's just not flashy enough to be sold as a $5K/month subscription.

## What to do if you're currently running an overlay

1. **Don't panic-uninstall.** The overlay isn't actively harming you (legally) until a regulator notices. Plan the migration.
2. **Start with an audit of your actual HTML.** Use `npx axe-core/cli` or [axle](https://axle-iota.vercel.app) or any other axe-core wrapper. See what the served HTML looks like.
3. **Fix the serious findings.** This is real work — usually 2-6 weeks of an engineer's time for a typical SaaS app.
4. **Stand up CI.** [axle GitHub Action](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) and similar tools run axe-core on every PR.
5. **Schedule the human audit** for after the CI baseline is clean.
6. **Then uninstall the overlay.** Update your accessibility statement. Notify any procurement/customer reviews that referenced the overlay.

## The frame I find useful

Overlays are the runtime equivalent of putting "TLS" in your privacy policy without actually serving HTTPS. The label and the substance are different things. Compliance frameworks care about the substance.

Real WCAG compliance is unglamorous: semantic HTML, real labels, real focus states, real keyboard navigation. There's no shortcut. The good news is the work is *bounded* — most teams find that a one-time remediation effort plus continuous CI gets them to "passes regulator scrutiny" within a quarter.

---

I built [axle](https://axle-iota.vercel.app) because I wanted a CI-grade open-source alternative to the audit-firm tier. It's free for one repo. Full version of this post is on the canonical URL above. Drop questions in comments — happy to engage on the technical claims and the regulatory landscape.

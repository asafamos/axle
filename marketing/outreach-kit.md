# axle — Outreach Kit (ready to copy-paste)

**Goal:** get the first WordPress site owners in front of the free plugin → convert a few to the $19/mo Site plan. Everything below is written **value-first** (communities ban salesy posts). Post from your own name, engage in replies, don't drop-and-run.

**Core links:**
- Free plugin: https://wordpress.org/plugins/asafamos-accessibility-scanner/
- Free scan (no signup): https://axle-iota.vercel.app/free-scan
- WordPress guide: https://axle-iota.vercel.app/wordpress-accessibility
- $19/mo Site plan: https://axle-iota.vercel.app/pricing

**Golden rules:** 1) Lead with the free tool, never the paid plan. 2) Never mention the $19 plan in a first community post — let it be discovered. 3) Answer every comment. 4) Read each group's self-promo rules first.

---

## 1. Facebook — WordPress groups (Hebrew)

*(For Israeli groups like "וורדפרס בעברית", "בוני אתרים", "פרילנסרים ווב". Post as a helpful heads-up, not an ad.)*

> **חוק הנגישות מתהדק — בניתי כלי חינמי לבדוק אתרי וורדפרס**
>
> היי, רבים מכם מנהלים אתרי וורדפרס ללקוחות, ותקנה 35 + ה-EAA האירופאי מגבירים אכיפה על נגישות. בניתי תוסף **חינמי** ל-וורדפרס שסורק את האתר מול תקני WCAG 2.1/2.2 AA ומראה בדיוק מה לא תקין — הכל רץ מקומית בדפדפן הניהול, בלי לשלוח שום מידע החוצה.
>
> חשוב לי לומר: זה **לא** "וידג'ט נגישות" (הכפתור המרחף) — אלה דווקא הביאו תביעות וקנס של מיליון דולר ל-accessiBe מה-FTC. הכלי מראה לך מה לתקן בקוד/תוכן, לא מחביא בעיות.
>
> התוסף: חפשו "AsafAmos Accessibility Scanner" במאגר התוספים, או קישור בתגובה. אשמח לשמוע פידבק ולעזור אם למישהו יש שאלה על נגישות. 🙏

*(First comment: drop the plugin link + "אפשר גם לבדוק כל URL בלי להתקין כלום: [free-scan link]")*

---

## 2. Facebook — WordPress groups (English)

*(For groups like "WordPress", "Advanced WordPress", "WordPress Web Designers".)*

> **Built a free WordPress accessibility scanner — no overlay widget**
>
> With the EU Accessibility Act now in force and ADA lawsuits still climbing, I built a **free** WordPress plugin that scans your site against WCAG 2.1 / 2.2 AA and shows exactly what's failing. It runs entirely in your admin browser (axe-core) — nothing is sent anywhere.
>
> Deliberately **not** an accessibility overlay: those don't fix the underlying HTML, and the FTC fined the biggest overlay vendor $1M in 2025. This just shows you what to fix in your theme/content.
>
> Search "AsafAmos Accessibility Scanner" in the plugin directory (link in comments). Happy to answer any accessibility questions — it's a rabbit hole I've spent a lot of time in.

*(First comment: plugin link + "No install needed to try it — you can scan any URL here: [free-scan link]")*

---

## 3. Reddit — r/Wordpress, r/accessibility, r/webdev

*(Reddit is allergic to promo. Lead with genuine value; the tool is a footnote. Check each sub's self-promotion rules — some require a flair or the 9:1 rule.)*

**Title:** After the EAA deadline I went down the WordPress accessibility rabbit hole — here's what actually matters (and a free scanner I built)

> Quick brain-dump for anyone dealing with WordPress accessibility right now:
>
> - **Overlays are a trap.** The "accessibility button" widgets don't fix your HTML and have become lawsuit magnets (accessiBe got a $1M FTC fine in Jan 2025). Skip them.
> - **~57% of WCAG issues are machine-detectable** — contrast, missing labels, alt text, heading order, ARIA misuse. Automated scanning catches these fast; the rest needs human review.
> - **Checkout/forms are the highest-risk pages** if you run WooCommerce.
>
> I built a free plugin that runs axe-core inside wp-admin (nothing leaves your server) to flag these: "AsafAmos Accessibility Scanner" in the directory. There's also a no-install URL scanner if you just want to see where you stand. Happy to answer questions in the comments — genuinely trying to make this less painful for people.

*(Do NOT mention the $19 plan on Reddit. If asked "is it free?" → "the plugin + scanning is free; there's an optional paid tier if you want the fixes auto-generated, but the scanner covers what most people need.")*

---

## 4. Review request (send to anyone who installed it, or friends with a WP site)

**Hebrew:**
> היי! אם יצא לך להשתמש בתוסף הנגישות שלי ל-וורדפרס, אשמח *ממש* אם תוכל/י להשאיר ביקורת קצרה במאגר — זה עוזר לתוסף להופיע בחיפוש ולהגיע לעוד אנשים. 30 שניות: [plugin link] → Reviews → Add my review. תודה ענקית 🙏

**English:**
> Hey! If you've tried my WordPress accessibility plugin, a quick review would genuinely help it get discovered by others who need it. Takes 30 seconds: [plugin link] → Reviews. Thank you so much 🙏

*(Reviews are the #1 WordPress.org ranking signal you're missing — even 3 five-star reviews changes discovery.)*

---

## 5. Product Hunt launch

**Tagline (≤60 chars):** WordPress accessibility scanner — fix WCAG/ADA, no overlay

**Description:**
> axle scans your WordPress site for WCAG 2.1 / 2.2 AA and ADA issues with a free plugin (axe-core, runs privately in your admin), then generates code-level fixes for one site from $19/mo — no developer, no overlay widget. Built for the EU Accessibility Act, ADA Title III, and beyond.

**First comment (maker):**
> Hi PH 👋 I built axle after watching businesses either ignore accessibility until a demand letter arrived, or slap on an overlay widget that doesn't fix anything (and got the biggest vendor a $1M FTC fine). axle is the opposite: it finds the real WCAG issues and shows you the source-level fix. The WordPress plugin + scanning are free; the $19/mo tier just writes the fixes for you. Would love your feedback — especially from anyone who's dealt with an accessibility lawsuit.

---

## 6. Cold email — for businesses worried about ADA / EAA (use sparingly, personalize)

**Subject:** quick accessibility check for {{site}}

> Hi {{name}},
>
> I ran a quick automated accessibility scan of {{site}} and it flags a few WCAG 2.1 AA issues that are the same type currently driving ADA demand letters (happy to send the report — no strings).
>
> I make a free WordPress plugin that scans for these, and an optional service that generates the fixes. Not trying to alarm you — most of it is quick to fix once you can see it. Want me to send the scan results?
>
> {{your name}}

*(Only email businesses you have a plausible reason to contact. Never scrape-and-blast — that's spam and hurts the brand. Better: post in communities and let them come to you.)*

---

## 7. One-liners (X / LinkedIn / bios)

- "Free WordPress accessibility scanner that finds real WCAG/ADA issues — and never injects an overlay widget."
- "Overlays don't fix accessibility (and got accessiBe a $1M FTC fine). axle shows you the source-level fix instead."
- "EU Accessibility Act is live. Scan your WordPress site free: [link]"

---

## Suggested first-week plan
1. **Today:** post #1 (Hebrew FB) + #2 (English FB) in 2–3 groups each. Reply to every comment.
2. **This week:** post #3 on r/Wordpress (mind the rules). Send #4 to anyone who's used it → get the first 3 reviews.
3. **When you have ~5 reviews:** launch #5 on Product Hunt.
4. Track which channel drives installs (WordPress.org stats) and lean into it.

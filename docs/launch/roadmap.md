# axle — תוכנית עבודה מלאה מיום השקה ואילך

עדכון אחרון: 2026-04-18 (יום ההשקה)

מעוגן ב-repo כדי שלא נאבד כשהקונטקסט של Claude מתנקה. כל הצעד שיושלם — סמן ✅ ליד.

---

## מצב פתיחה (אחרי יום ההשקה)

### ✅ תשתית + מוצר
- Next.js 16 על Vercel production @ `axle-iota.vercel.app`
- Playwright + axe-core 4.11 + Claude Sonnet 4.6 (prompt-cached)
- Upstash Redis מחובר (KV)
- Polar.sh billing — KYC מלא, Live mode, transaction אמיתי הצליח

### ✅ מוצרים קיימים
- `/` landing + scanner
- `/statement` — Hebrew accessibility statement generator
- `/badge` + `/api/badge` — compliance badge
- `/alternatives/accessibe` — comparison page (SEO)
- `/changelog` — SEO asset
- `/api/stats` + social-proof counter
- `/account` — cookie-based API key
- `/checkout/success` — dual-provider (Stripe + Polar)
- `/api/checkout` dispatcher + `BILLING_PROVIDER=polar`

### ✅ מפורסם ב:
- GitHub Marketplace: `asafamos/axle-action@v1`
- npm: `axle-cli@0.1.1`, `axle-netlify-plugin@0.1.0`, `axle-cloudflare-plugin@0.1.0`
- Public source: `asafamos/axle` + `asafamos/axle-action` (MIT)
- Dev.to: launch article live

### 🟡 Scaffolded — לא פורסם עדיין
- `packages/axle-raycast/` — Raycast extension
- `packages/axle-chrome/` — Chrome MV3 extension

### 📬 תלוי בגורם חיצוני (ממתינים)
- Paddle appeal email — 2-5 ימי עסקים (alternative billing rail; לא חוסם)
- AlternativeTo submission — פתוח ביום שני (weekend pause)

---

## TIER 1 — השבועות ההשקה (48 השעות הקרובות)

### A1 · Awesome-list PRs — 45 דק' (אתה)

- [ ] **PR #1 — sdras/awesome-actions** (בעבודה, ה-Fork כבר נוצר)
  - [ ] ערוך README.md → הוסף axle תחת `Accessibility` / `Static Analysis` / `Utility`
  - [ ] Commit → "Create a new branch" → `add-axle`
  - [ ] Propose changes → Create pull request
- [ ] **PR #2 — brunopulis/awesome-a11y**
  - Fork → edit README.md → Testing Tools / CI section
  - Commit message: `Add axle — WCAG CI with AI code fixes`
- [ ] **PR #3 — unicodeveloper/awesome-nextjs**
  - Fork → edit README.md → Developer Tools / Integrations
  - Commit message: `Add axle — accessibility CI for Next.js`

*כל הטקסטים המדויקים ב-`docs/launch/awesome-list-prs.md`.*

### A2 · AlternativeTo submission — 5 דק' (אתה, **ביום שני**)

- [ ] פתח https://alternativeto.net/submit/ (לא בסוף שבוע — סגור)
- [ ] מלא לפי `docs/launch/alternativeto-submission.md`
- [ ] "Alternative to": accessiBe, UserWay, EqualWeb, AudioEye, Siteimprove, Deque axe DevTools
- [ ] ממתינים 1-3 ימים לעדכון

### A3 · ProductHunt — prep + launch (אתה)

- [ ] **ההכנה:** יום ראשון-שני — צילומי מסך, gallery assets, maker comment
- [ ] **Schedule** ב-PH לפרסום **יום שלישי או רביעי 00:01 PST** = 10:01 בוקר בישראל
- [ ] יום ה-launch:
  - [ ] 00:01 PST — go live
  - [ ] 00:05 — פרסם maker comment (ב-`docs/launch/producthunt-submission.md`)
  - [ ] לאורך כל היום — תגיב לכל comment תוך 30 דק'
  - [ ] 22:00 PST — wrap-up tweet

*פרטים מלאים ב-`docs/launch/producthunt-submission.md`.*

### A4 · Show HN — יום ה-PH (אתה)

- [ ] שעה מ-ה-PH go live
- [ ] פרסם לפי הטקסט המוכן (ב-chat מוקדם או ב-`docs/launch/dev-to-post.md` כ-reference)
- [ ] הישאר זמין לcomments — עונה תוך 30 דק' במשך 24 שעות

### A5 · Twitter + LinkedIn + Reddit — יום ה-PH (אתה)

- [ ] **Twitter/X** — thread של 8 tweets (הטקסט בצ'אט מוקדם)
- [ ] **LinkedIn** — long-form post (הטקסט בצ'אט)
- [ ] **Reddit r/accessibility** — ערב ה-launch
- [ ] **Reddit r/webdev** — יום למחרת
- [ ] **Reddit r/SideProject** — יום למחרת

---

## TIER 2 — השבוע אחרי ההשקה

### B1 · Raycast Store publish — 2-3 שעות

- [ ] צור `icon.png` 512×512 (הלוגו `a` על רקע כהה)
- [ ] צור 2-3 screenshots של הפקודות
- [ ] `cd packages/axle-raycast && npm install`
- [ ] התקן Raycast CLI: `npm i -g @raycast/api`
- [ ] `ray publish` → מילוי metadata ב-dashboard של Raycast Store
- [ ] Review — ~2-7 ימים

### B2 · Chrome Web Store publish — 3-4 שעות

- [ ] צור 4 icons: 16, 32, 48, 128 (PNG)
- [ ] העתק `node_modules/axe-core/axe.min.js` ל-`packages/axle-chrome/`
- [ ] zip את התיקייה
- [ ] פתח חשבון Chrome Web Store Developer ($5 חד-פעמי) ב-https://chrome.google.com/webstore/devconsole/
- [ ] Upload zip → מלא description / screenshots / categories
- [ ] Submit — review 1-3 ימים

### B3 · Netlify Integrations Directory submission — 30 דק'

- [ ] ה-npm package כבר קיים; אבל Netlify דורשים submission נפרד למדריך שלהם
- [ ] https://www.netlify.com/integrations/ → Submit
- [ ] מילוי טופס (תיאור + logo + docs link)

### B4 · Polar — flip to Live לגמרי (אם עדיין לא)

- [ ] ודא ב-Polar Dashboard שה-Live mode באמת פעיל (לא sandbox)
- [ ] אם יש עסקאות הדגמה בסנדבוקס — נקה
- [ ] עקוב אחר המייל של תגובת Paddle appeal (אם כן — המשך ה-plan שם; אם לא — Polar ממשיך להיות הזרם היחיד)

### B5 · Iteration מבוסס feedback

- [ ] עקוב אחר:
  - Vercel Analytics — traffic sources
  - Upstash — scan + fix counters
  - Polar — signups + MRR
  - GitHub — stars + traffic
  - Dev.to / HN / PH — תגובות
- [ ] תקן bugs שמתגלים
- [ ] עדכן `/changelog` עם כל שיפור

---

## TIER 3 — שבועיים-חודש (הרחבת מוצר)

### C1 · VS Code Extension (~2-3 שעות — אני בונה כשמאשר)

- [ ] Scaffold `packages/axle-vscode/`
- [ ] הפקודות: "Scan current file", "Scan URL", "Open dashboard"
- [ ] Publish ל-VS Code Marketplace ($0 — דורש Azure DevOps account)

### C2 · Firefox Add-on — 2-3 שעות

- [ ] Port מ-`packages/axle-chrome/` (MV3 → MV2 אם נדרש)
- [ ] Submit ל-AMO (addons.mozilla.org) — $0

### C3 · Multi-language Accessibility Statement — 4-6 שעות

- [ ] צור `lib/statement/fr-template.ts` — French (EAA)
- [ ] `lib/statement/de-template.ts` — German (EAA)
- [ ] `lib/statement/es-template.ts` — Spanish (EAA)
- [ ] `lib/statement/it-template.ts` — Italian (EAA)
- [ ] UI ב-`/statement` — בוחר שפה (dropdown)

### C4 · GitHub Action + CLI — קבלת AXLE_API_KEY — 1-2 שעות

- [ ] עדכן `scripts/ci-scan.ts` — יקרא `AXLE_API_KEY` env, ישלח כ-`X-Axle-Key` header
- [ ] עדכן `packages/axle-cli/src/axle.ts` — אותו דבר
- [ ] עדכן `packages/axle-action/action.yml` — input `axle-api-key`
- [ ] tagging חדש `v1.1.0` — עדכן ה-Marketplace

### C5 · Scan History / Dashboard (paid tier) — 1-2 ימים

- [ ] User accounts (magic link דרך Resend)
- [ ] `/dashboard` — שוב טבלאות + graph של scans לאורך זמן
- [ ] PDF export של audit trail
- [ ] Slack / email alerts כש-regressions מתגלות

### C6 · Custom Domain — 5 דקות (אחרי שתבחר שם)

- [ ] קנה דומיין (axle.dev / useaxle.com / axlehq.com — לפי בחירתך)
- [ ] ב-Vercel → Project → Settings → Domains → Add
- [ ] עדכן DNS records (Vercel מספק הוראות)
- [ ] עדכן `NEXT_PUBLIC_SITE_URL` ב-env
- [ ] Redeploy
- [ ] עדכן את כל ה-"Powered by" references:
  - `app/layout.tsx` metadata
  - `packages/axle-cli/src/markdown.ts`
  - `scripts/ci-scan.ts`
  - README.md של כל package
  - README.md של `asafamos/axle-action`

### C7 · Feature flag: Waitlist → Live toggle (נקי)

- [ ] הוסף `CHECKOUT_ENABLED=true|false` env
- [ ] כש-`false` — Subscribe button הופך ל-"Notify me"
- [ ] API `/api/waitlist` שומר email ב-KV
- [ ] כש-flip ל-`true` — automation שולח batch email לכל ה-waitlist

---

## TIER 4 — חודש-חודשיים (Mid-term)

### D1 · Vercel Integration Marketplace (~1 שבוע, אחרי 10+ paying customers)

- [ ] Vercel Integrations Developer Portal
- [ ] OAuth + webhook flow — אוטומטית מתקין GitHub Action בפרויקט של המשתמש
- [ ] Preview deployment scanning
- [ ] Publish ל-marketplace (review 1-2 שבועות)

### D2 · axle-for-teams (enterprise features — $299 Business tier)

- [ ] SSO (Google Workspace / Okta / Azure AD)
- [ ] Private audit log
- [ ] Compliance officer dashboard
- [ ] Priority fix queue
- [ ] Multi-repo aggregate view

### D3 · Case studies + testimonials

- [ ] ריצת axle על 3-5 אתרים ציבוריים (paprikadjs.com, etc.)
- [ ] פוסט "We scanned the top 100 SaaS landing pages" (content marketing)
- [ ] בקש quote מ-2-3 משתמשים מרוצים — שים בלנדינג

### D4 · "Alternative to X" pages (SEO army)

- [ ] `/alternatives/userway` — כבר יש רעיון
- [ ] `/alternatives/equalweb`
- [ ] `/alternatives/audioeye`
- [ ] `/alternatives/siteimprove`
- [ ] `/alternatives/deque-axe-devtools`
- כל דף = SEO capture נקודתי על search intent של "X alternative"

### D5 · Continuous monitoring — production scan scheduler

- [ ] UI ב-`/dashboard/monitors`
- [ ] Cron job שרץ scan על domains מוגדרים כל 24 שעות
- [ ] Email alerts על regressions
- [ ] הצגת trend line של compliance score לאורך זמן

---

## TIER 5 — 3+ חודשים (רק אחרי 50+ paying customers)

### E1 · WordPress Plugin Directory (~2 שבועות)

- [ ] PHP plugin
- [ ] wp-admin dashboard integration
- [ ] תיקונים דרך Gutenberg blocks / theme editor
- [ ] Submission ל-plugins.wordpress.org (review 4-8 שבועות)

### E2 · Shopify App Store (~1-2 שבועות + 2-4 שבועות Shopify review)

- [ ] OAuth עם Shopify Admin API
- [ ] Theme Liquid scanning
- [ ] תיקונים דרך Shopify Theme editor
- [ ] Partner account + app submission

### E3 · JetBrains / WebStorm Marketplace (~2 ימים)

- [ ] Kotlin/Java plugin
- [ ] הגשה ל-plugins.jetbrains.com

### E4 · Safari Extension (~1 שבוע — מסובך)

- [ ] Xcode project
- [ ] App Store Connect submission
- [ ] $99/year Apple Developer fee
- [ ] דורש build+sign mac-side

### E5 · Mobile apps (iOS/Android) — SHOULD SKIP

- לא ממש שייך — axle הוא dev tool, לא consumer

---

## משימות שטף קבועות (מתמשכות)

### F1 · Weekly
- [ ] סקירת analytics (Vercel + Upstash + Polar)
- [ ] תגובה ל-issues ב-`asafamos/axle` + `asafamos/axle-action`
- [ ] עדכון `/changelog` לכל feature/fix
- [ ] 1 פוסט social media לפחות (Twitter thread / LinkedIn)

### F2 · Monthly
- [ ] Version bump ושחרור חדש (אם יש שינויים) — CLI + Action + plugins
- [ ] Email campaign למנויים (tips + new features)
- [ ] Review יעדים של ה-revenue (MRR growth)

### F3 · Ongoing product discipline
- [ ] כל AI fix ממשיך לשלוח `confidence` + `manual_review_needed`
- [ ] אין שינוי במסר "remediation assistance, not certification"
- [ ] אין הזרקת JS runtime בשום מקרה — נשארים עם source-code diffs בלבד
- [ ] Keep Anthropic SDK version current (Claude 4.6 → 4.7 → ...)

---

## מדדי הצלחה — מה נמדוד

**תוך 7 ימים:**
- [ ] 500+ visits ב-landing
- [ ] 50+ GitHub stars ב-`axle-action`
- [ ] 10+ npm downloads של `axle-cli`
- [ ] 5+ active free-tier users
- [ ] 1+ paying customer שאינו אתה

**תוך 30 ימים:**
- [ ] 5,000+ visits
- [ ] 200+ stars
- [ ] 100+ weekly npm downloads
- [ ] 100+ active free-tier users
- [ ] 10+ paying customers = ~$500 MRR

**תוך 90 ימים:**
- [ ] 20,000+ visits
- [ ] 500+ stars
- [ ] 1,000+ weekly npm downloads
- [ ] 500+ active free-tier users
- [ ] 50+ paying customers = ~$2,500 MRR
- [ ] החלטה: לגייס השקעה / להישאר bootstrap

---

## קבצי עזר בפרויקט

- `docs/launch/dev-to-post.md` — הטקסט שהלך ל-Dev.to
- `docs/launch/awesome-list-prs.md` — הטקסטים לכל PR
- `docs/launch/alternativeto-submission.md` — טופס AlternativeTo
- `docs/launch/producthunt-submission.md` — תוכנית PH
- `docs/launch/public-repo-prep.md` — איך הופכים ל-public (בוצע)
- `docs/launch/user-action-checklist.md` — רשימת פעולות של המשתמש

---

## בסוף כל שלב — "What could kill this?"

ליידי ידע:
1. **Legal claim notion/accessibility** — סיכון שmerchant-of-record אחד יחליט שאנחנו "overlay-like" ויחסום. תגובה: נשמור על הכיתוב "remediation assistance" ונעקוב אחרי תגובות Polar/Paddle.
2. **Claude price shift** — אם Anthropic מעלים מחירים, ה-economics של hosted AI fixes נפגעות. תגובה: נעלה מחיר tier או נעבור למודל זול יותר (Haiku for low-impact).
3. **GitHub / npm policy change** — לא סביר אבל אפשרי.
4. **Competing launch** — Vercel/Cloudflare יכולים לשחרר אינטגרציית a11y-CI מובנית. תגובה: אנחנו מתחפרים ב-legal artifacts + compliance angle, לא רק בטכנולוגיה.

---

**כל שלב ⬆️ שסומן — תסמן ✅ וצא לסלידה.** הכל נבנה incrementally; אפס frustration אם Tier 3 לוקח חודש במקום שבועיים.

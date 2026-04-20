# axle-shopify — roadmap

Shopify embedded app that scans the live storefront for accessibility violations, tracks regressions per theme version, and blocks publishing a theme that regresses.

## Why it matters

Shopify's ~4M merchants are under the same EAA 2025 and ADA pressure, and they have higher willingness to pay than WP because Shopify itself conditions them to paid-app pricing. Gross margins on a $29–99/mo app are strong. This is the **highest-revenue** integration on the roadmap, but also the highest lift.

## Scope (MVP)

A Shopify embedded app built on the App Bridge stack:

1. **OAuth + install flow** against the merchant's store.
2. **Dashboard** (Polaris UI) with:
   - Current storefront scan (homepage + one product page as representative sample)
   - Violation list by severity + fix suggestions
   - Scan history + regression alerts
3. **Theme check** — before a merchant publishes a theme change, run a scan against the preview. If it regresses, show a blocking modal.
4. **Webhook handlers** — `themes/publish`, `themes/update`, `app/uninstalled`.
5. **Billing** via Shopify's own Billing API (not Polar — Shopify mandates their billing flow for in-app subscriptions).

## Tech notes

- Stack: Next.js app hosted on Vercel (same repo works; separate deployment), `@shopify/shopify-api` + `@shopify/app-bridge-react`, Polaris for UI
- Session storage: extend the existing Upstash KV
- Scan pipeline: reuse `lib/scanner.ts` — no new scanning code needed
- Billing: use Shopify's `RecurringApplicationCharge` — cannot use Polar for Shopify-distributed apps per Shopify policy

## Submission flow (~1–3 weeks)

1. Register at https://partners.shopify.com/
2. Create app in Partner Dashboard, get API key + secret
3. Build MVP + test on a development store
4. Submit to App Store — Shopify review is rigorous (~1–3 weeks):
   - Must use Polaris for anything user-facing inside the app
   - Must handle GDPR webhooks (`customers/data_request`, `customers/redact`, `shop/redact`)
   - Must have a privacy policy + support email
5. Approved apps appear on apps.shopify.com with discovery surface

## Effort estimate

- MVP coding: 5–8 focused days
- App Store submission materials (screenshots, demo video, listing copy): 1–2 days
- Review cycle: 1–3 weeks elapsed

## Why this isn't in this sprint

Shopify's billing API is mandatory — we'd need to dual-maintain billing logic (Polar for GH/npm/CF/Vercel/Netlify, Shopify for Shopify). That's material tech debt. Do it only after Polar is provably generating revenue, so we know customers will pay at all. Premature Shopify build = 2 weeks of work with a real chance of zero ROI.

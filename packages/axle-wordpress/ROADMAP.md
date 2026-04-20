# axle-wordpress — roadmap

WordPress plugin that runs accessibility scans on the live site from the admin dashboard, tracks regressions over time, and generates the Hebrew/EU accessibility statement inline.

## Why it matters

WordPress still powers ~40% of the public web and 60%+ of Israeli SMB sites — the exact audience hit hardest by EAA 2025 and Israeli תקנה 35 enforcement. WordPress customers overwhelmingly don't have CI pipelines, so the GitHub Action / CLI flow doesn't reach them. A plugin is the only realistic delivery mechanism for this segment.

## Scope (MVP)

A PHP plugin (not a JS project — this doesn't live in npm) with:

1. **Admin page** under *Tools → axle* showing:
   - Scan button (triggers scan of home URL via `/api/scan` on axle-iota.vercel.app, `source: axle-wordpress`)
   - Latest violations grouped by severity
   - Trend chart (7-day)
2. **Daily cron** via `wp_schedule_event('daily', 'axle_scan')` re-running the scan automatically.
3. **Accessibility-statement generator** — a block (or shortcode) that renders the Hebrew/EU statement on a page of the site's choice. Reuses the existing `/statement` HTML template via a server-side render or pulls from `/api/statement`.
4. **License gate** — Free tier works with the Open plan. Paid features (AI fix suggestions, statement auto-generation) require an axle API key entered in plugin settings.

## Tech notes

- Language: PHP 7.4+ (WordPress minimum)
- Structure: standard plugin layout (`axle.php` bootstrap, `includes/`, `admin/`, `assets/`)
- HTTP: `wp_remote_post` against `https://axle-iota.vercel.app/api/scan` and `/api/fix`
- Settings: `axle_settings` option storing API key + configuration
- Auth to axle API: send `Authorization: Bearer <axle API key>` header — the existing `/api/fix` route already checks this

## Submission flow (~1–4 weeks, not in our hands)

1. Register a wordpress.org account (if not already).
2. Submit to https://wordpress.org/plugins/developers/add/ with:
   - `readme.txt` in WP's required format (headers + sections)
   - Screenshots (5–8 PNGs)
   - Tested up to: current WP version
3. Plugin Review Team reviews manually — typical wait 1–4 weeks. Can come back with required changes (usually around sanitization / escaping).
4. Once approved, Subversion repo is created. `svn commit` your plugin to publish.

## Effort estimate

- MVP coding: 2–3 focused days
- Screenshots + readme.txt polish: ~½ day
- Review cycle: 1–4 weeks elapsed time

## Why this isn't in this sprint

A WP plugin is a separate language, separate packaging, separate distribution channel, and a multi-week review. It's the right next bet *after* we've confirmed axle-vercel is pulling npm downloads and we have the first paying Polar customer. Doing it before either signal arrives is premature — we'd be guessing which segment to optimize for.

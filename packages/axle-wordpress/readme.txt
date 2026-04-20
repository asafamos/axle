=== Axle Accessibility Scanner ===
Contributors: axleteam
Tags: accessibility, a11y, wcag, compliance, eaa
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.1.0
License: MIT
License URI: https://opensource.org/licenses/MIT

WCAG 2.1 / 2.2 AA scanner for WordPress. Built for EAA 2025, ADA, תקנה 35. No overlay widget, no tracking — scans run in your admin browser.

== Description ==

**Axle Accessibility Scanner** scans your site for WCAG 2.1 / 2.2 AA accessibility violations using axe-core 4.11 running in your admin browser. Results appear in the admin dashboard — no JavaScript is injected into your public pages, nothing leaves your server, and nothing is tracked about your visitors.

**What it does**

* Runs a real headless Chromium against your home URL (or a URL you specify).
* Reports every violation grouped by severity (critical / serious / moderate / minor).
* Links to axe-core documentation for each rule so you can fix it in your theme.
* Optional daily cron re-scans so regressions show up automatically.
* Works with any theme, any page builder, any caching plugin.

**Why not an accessibility overlay?**

Overlay widgets (the "robot button" you've seen on other sites) injected runtime JavaScript over broken HTML. They do not fix anything; the FTC fined the largest vendor $1M in January 2025. Real compliance means fixing the source HTML / CSS. This plugin shows you what to fix — it does not hide problems.

**Built for new regulations**

* **EAA 2025** (European Accessibility Act — enforceable since June 2025)
* **ADA** (U.S. — courts apply WCAG 2.1 AA as the de facto standard)
* **Israeli תקנה 35** (updated October 2024 with stricter enforcement)

**Free. Optional paid tier.**

The plugin is free. Unlimited scans, daily cron, full violation report.

A paid axle subscription ([plans from $49/mo](https://axle-iota.vercel.app/#pricing?utm_source=axle-wordpress)) unlocks hosted Claude-generated code-fix suggestions per violation (not just detection). Paste your axle API key in Settings to enable.

**Not a compliance certificate**

Automated tools (including axe-core 4.11, the engine used here) catch roughly 57% of WCAG issues. Manual review by a human auditor is still recommended for full conformance.

== Installation ==

1. Upload the plugin zip via Plugins → Add New → Upload, or copy the `axle` folder to `/wp-content/plugins/`.
2. Activate through the Plugins menu.
3. Go to **Tools → axle** and click **Scan now**.

== External services ==

Scans run **locally in your admin browser** using axe-core 4.11 bundled with the plugin. The target URL is loaded in a hidden iframe inside the admin page and scanned there. **No URL, no HTML, and no scan contents are sent to any external service when you use the "Scan now" button.**

The plugin may contact the `axle-iota.vercel.app` service in two optional situations:

1. **Anonymous usage ping** — after a successful scan, an anonymous ping is sent to `https://axle-iota.vercel.app/api/track` with body `{ "source": "axle-wordpress", "event": "scan_complete" }` and no other data. This lets us see rough plugin usage on our analytics dashboard. Disable with the browser setting for sendBeacon/fetch, or by blocking the domain.
2. **Auto scan = Daily** — only if you explicitly enable this in Tools → axle → Settings. Because WP-Cron runs without a browser, the daily cron uses the hosted scanner at `POST https://axle-iota.vercel.app/api/scan` with body `{ "url": "<your target URL>", "source": "axle-wordpress" }` (and, if you entered an axle API key, `Authorization: Bearer <key>`). **Requires your target URL to be publicly reachable.** Default is Off.

**No visitor data is sent. No form data is sent. No admin content is sent.** The only URL transmitted by the Auto scan cron is the one you configured in Settings.

**Data stored locally:** scan results are stored in the WordPress `wp_options` table under the key `axle_last_scan` so the admin dashboard can render the summary. Not displayed on your public site, not shared with any service.

**Terms & privacy:**
* Service provider: axle ([axle-iota.vercel.app](https://axle-iota.vercel.app))
* Terms of use: [https://axle-iota.vercel.app/terms](https://axle-iota.vercel.app/terms)
* Privacy policy: [https://axle-iota.vercel.app/privacy](https://axle-iota.vercel.app/privacy)

You may disable all external communication by deactivating the plugin, or by turning off Auto scan and not clicking the Scan now button.

== Frequently Asked Questions ==

= Does this plugin inject any JavaScript into my public site? =

No. Scans run against your public URL from axle's hosted infrastructure. The plugin only adds an admin-side dashboard. Your visitors see nothing.

= Is my data shared? =

The URL you ask us to scan is sent to `axle-iota.vercel.app/api/scan`. No user data, no form data, no admin content is transmitted. Scan results come back and are stored in your WordPress database only.

= Do I need an account? =

No. The free tier works without signup. If you want Claude-generated code-fix suggestions, enter an axle API key in Settings ([get one here](https://axle-iota.vercel.app/#pricing?utm_source=axle-wordpress)).

= Does this replace a professional accessibility audit? =

No. Automated scanning catches ~57% of WCAG issues. For full compliance, a human auditor is still recommended.

= What about GDPR / privacy? =

axle does not track your visitors. The plugin makes one outbound HTTP request per scan to axle's API, sending only the URL being scanned and a source identifier (`axle-wordpress`). No visitor data leaves your site.

== Screenshots ==

1. Admin dashboard showing the latest scan results.
2. Severity breakdown and per-rule violations.
3. Settings page with daily auto-scan toggle.

== Changelog ==

= 1.1.0 =
* Scans now run **client-side in the admin browser** using bundled axe-core 4.11. Works for LocalWP, staging behind basic auth / VPN, and any other private environment the previous hosted scanner could not reach.
* No external network calls during a "Scan now" — only an optional anonymous telemetry ping after a successful scan.
* Auto scan cron still uses the hosted scanner (it has no browser available). Disabled by default; opt in via Settings.

= 1.0.0 =
* First public release.
* WCAG 2.1 / 2.2 AA scanning via axe-core 4.11.
* Admin dashboard under Tools → axle.
* Settings for target URL, severity threshold, optional API key.

== Upgrade Notice ==

= 1.1.0 =
Scans now run locally in your browser and work on LocalWP / staging / VPN-restricted sites. No external call required for the free tier. Update recommended.

= 1.0.0 =
Initial release. Install and click "Scan now" in Tools → axle to see your first accessibility report.

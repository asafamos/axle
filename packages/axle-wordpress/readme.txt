=== AsafAmos Accessibility Scanner ===
Contributors: asafamos1
Tags: accessibility, a11y, wcag, axe-core, scanner
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.2.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Scan your WordPress site for WCAG 2.1 / 2.2 AA violations. axe-core 4.11 runs in your admin browser via a hidden iframe — nothing transmitted by default.

== Description ==

**AsafAmos Accessibility Scanner** finds WCAG 2.1 / 2.2 AA accessibility violations on your WordPress site. The scan engine — axe-core 4.11 — is bundled with the plugin and runs **entirely in your WP admin browser tab**. The target page is loaded in a hidden iframe inside the admin area and evaluated there. The default scan flow does not transmit your URL, your HTML, or any scan contents to any external service.

**What it does**

* Loads the target page in a hidden iframe inside your WP admin and evaluates it with bundled axe-core 4.11. Nothing leaves your server during a normal scan.
* Reports every violation grouped by severity (critical / serious / moderate / minor).
* Links to axe-core documentation for each rule so you can fix it in your theme or content.
* Optional daily cron re-scans (off by default — see &ldquo;Optional features&rdquo; below for what it does and does not transmit).
* Works with any theme, any page builder, any caching plugin.

**Why not an accessibility overlay?**

Overlay widgets (the &ldquo;robot button&rdquo; you've seen on other sites) inject runtime JavaScript over broken HTML. They do not fix anything; the FTC fined the largest vendor $1M in January 2025. Real compliance means fixing the source HTML / CSS. This plugin shows you what to fix — it does not hide problems and it does not ship any JavaScript to your visitors.

**Built for new accessibility regulations**

* **EAA 2025** — European Accessibility Act, enforceable since June 2025
* **ADA** — U.S. courts apply WCAG 2.1 AA as the de facto standard
* **Israeli תקנה 35** — updated October 2024 with stricter enforcement

**Free. Optional paid tier (separate hosted service)**

The plugin itself is free. Unlimited scans, optional daily cron, full per-rule violation report — all included.

A separate hosted service at https://axle-iota.vercel.app offers Claude-generated code-fix suggestions per violation. That service is not part of this plugin and is not used by the default scan flow. If you sign up there and obtain an API key, you can paste it in this plugin's Settings; it is then only used during the optional cron / hosted-scan path described below.

**Not a compliance certificate**

Automated tools (including axe-core 4.11, the engine used here) catch roughly 57% of WCAG issues. Manual review by a qualified human auditor is still recommended for full conformance.

== Installation ==

1. Upload the plugin zip via Plugins → Add New → Upload, or copy the plugin folder to `/wp-content/plugins/`.
2. Activate through the Plugins menu.
3. Go to **Tools → AsafAmos Accessibility Scanner** and click **Scan now**.

== Optional features (and what they transmit) ==

This is the full and accurate transmission story for every feature. The default install transmits nothing.

**1. &ldquo;Scan now&rdquo; button — default scan flow**

* Runs entirely in your WP admin browser tab.
* Loads the target page in a hidden iframe and evaluates it with bundled axe-core 4.11.
* **Does not transmit anything to any external service.**
* Scan results are written to your WordPress `wp_options` table under the key `axle_last_scan` so the admin dashboard can render the summary.

**2. Anonymous usage ping (after a successful Scan now)**

* If your browser allows `navigator.sendBeacon` / `fetch`, after a scan completes a single anonymous ping is sent to `https://axle-iota.vercel.app/api/track` with body `{ "source": "axle-wordpress", "event": "scan_complete" }`.
* No URL, no domain, no scan contents, no admin user info is included.
* Used to track rough plugin adoption on our analytics dashboard.
* Blocked automatically if the browser disables third-party requests, or if you block the host.

**3. Auto scan = Daily (opt in only — Off by default)**

* Only relevant if you explicitly enable this in Tools → AsafAmos Accessibility Scanner → Settings.
* WP-Cron runs without a browser, so the daily cron cannot use the in-browser iframe scanner. Instead it uses the hosted scanner at `POST https://axle-iota.vercel.app/api/scan` with body `{ "url": "<your configured target URL>", "source": "axle-wordpress" }` (and `Authorization: Bearer <key>` if you've entered an axle API key).
* **Requires your target URL to be publicly reachable** — the hosted scanner cannot reach LocalWP, staging behind basic auth, or VPN-only environments.
* No visitor data, form data, or admin content is sent. Only the configured target URL.
* Disabled by default. Setting can be turned off again at any time.

**Service provider for #2 and #3:** axle (https://axle-iota.vercel.app)
**Terms of use:** https://axle-iota.vercel.app/terms
**Privacy policy:** https://axle-iota.vercel.app/privacy

You may disable all external communication by deactivating the plugin, by turning off Auto scan and not clicking Scan now, or by blocking the host `axle-iota.vercel.app` at the network level.

== Frequently Asked Questions ==

= Does this plugin inject any JavaScript into my public site? =

No. The bundled axe-core engine is loaded only inside your WordPress admin pages, never on your public-facing site. Your visitors see nothing.

= What data leaves my site by default? =

By default, **nothing**. The Scan now button runs entirely client-side in your admin browser via a hidden iframe. Optional features (anonymous usage ping; opt-in daily cron) are described in detail in the &ldquo;Optional features&rdquo; section.

= Do I need an account? =

No. The plugin works without any signup. The optional Claude-generated code-fix feature requires a paid axle API key entered in Settings, but you do not need it to scan.

= Does this replace a professional accessibility audit? =

No. Automated scanning catches roughly 57% of WCAG issues. For full compliance, a human auditor is still recommended.

= What about GDPR / privacy? =

The plugin does not track your visitors. The default scan flow makes no outbound HTTP requests to any external service. Optional features (anonymous usage ping; opt-in daily cron) are documented under &ldquo;Optional features&rdquo; with the exact request body.

= I'm on LocalWP / staging behind basic auth / a VPN-only host. Will this still work? =

Yes — the default Scan now flow works on any environment because it runs entirely inside your admin browser. The optional Auto scan = Daily setting requires public reachability and won't work for these environments; leave it Off.

= Why is the plugin called &ldquo;AsafAmos Accessibility Scanner&rdquo; and not &ldquo;axle&rdquo;? =

The author's WordPress.org username is `asafamos1`. The plugin is part of the `axle` accessibility-CI ecosystem (separate hosted service at https://axle-iota.vercel.app) but maintained by AsafAmos individually for the WordPress.org directory.

== Screenshots ==

1. Admin dashboard showing the latest scan results.
2. Severity breakdown and per-rule violations.
3. Settings page with daily auto-scan toggle.

== Changelog ==

= 1.2.0 =
* Renamed plugin display name and slug from &ldquo;Axle Accessibility Scanner&rdquo; / `axle-accessibility-scanner` to &ldquo;AsafAmos Accessibility Scanner&rdquo; / `asafamos-accessibility-scanner` per WordPress.org Plugin Review Team feedback (avoid the &ldquo;Axle&rdquo; trademark concern).
* Rewrote readme to remove inconsistencies between the original 1.0.0 (hosted-scan) and current 1.1.0+ (in-admin-iframe) architectures. The default scan flow now described accurately as fully client-side; optional hosted features moved to a clearly-labelled section.
* Updated `Contributors` to the plugin owner's WordPress.org username `asafamos1`.

= 1.1.0 =
* Scans now run **client-side in the admin browser** using bundled axe-core 4.11. Works for LocalWP, staging behind basic auth / VPN, and any other private environment the previous hosted scanner could not reach.
* No external network calls during a normal Scan now — only an optional anonymous telemetry ping after a successful scan.
* Auto scan cron still uses the hosted scanner (it has no browser available). Disabled by default; opt in via Settings.

= 1.0.0 =
* First public release.
* WCAG 2.1 / 2.2 AA scanning via axe-core 4.11.
* Admin dashboard under Tools menu.
* Settings for target URL, severity threshold, optional API key.

== Upgrade Notice ==

= 1.2.0 =
Renamed plugin per WordPress.org review feedback. Readme rewritten for accuracy. No functional change. Update recommended.

= 1.1.0 =
Scans now run locally in your browser and work on LocalWP / staging / VPN-restricted sites. No external call required for the free tier. Update recommended.

= 1.0.0 =
Initial release.

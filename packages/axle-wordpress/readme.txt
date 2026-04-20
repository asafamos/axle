=== axle — Accessibility Compliance CI ===
Contributors: axleteam
Tags: accessibility, a11y, wcag, ada, compliance, axe-core, eaa, eu-accessibility-act
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Continuous WCAG 2.1 / 2.2 AA scanning for WordPress. Built for EAA 2025, ADA, and Israeli תקנה 35. No overlay widget. No tracking. No runtime JS injected.

== Description ==

**axle** scans your live site for WCAG 2.1 / 2.2 AA accessibility violations using axe-core 4.11 in a hosted headless browser. Results appear in the admin dashboard — no JavaScript is injected into your public pages, and nothing is tracked about your visitors.

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

= 1.0.0 =
* First public release.
* WCAG 2.1 / 2.2 AA scanning via axe-core 4.11.
* Daily WP-Cron scheduled scans.
* Admin dashboard under Tools → axle.
* Settings for target URL, severity threshold, optional API key.

== Upgrade Notice ==

= 1.0.0 =
Initial release. Install and click "Scan now" in Tools → axle to see your first accessibility report.

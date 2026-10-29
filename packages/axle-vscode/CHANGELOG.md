# Changelog

## 0.2.0 — 29 Oct 2026

- **Fixed: "Scan localhost dev server" never worked.** The hosted scanner cannot reach `localhost`, so every local scan failed with a connection error. Local and private-network URLs are now scanned on your machine by running `npx axle-cli` in a visible terminal (telemetry off), and the report opens in the same panel.
- **New: Generate AI fix.** A link on every violation card, plus the `axle: Generate AI fix for a violation…` command. Sends one element (≤500 chars of HTML) to axlescan.com → Claude after a one-time confirmation; the suggestion opens as a Markdown document and is never applied automatically.
- **Fixed: scans were recorded with an unknown source.** The extension now identifies itself as `axle-vscode`.
- `axle.failOn` now actually works (it used to be a documented no-op): issues below the threshold are collapsed, not dropped.
- Friendly errors for rate limits, unreachable sites and network failures; a 75 s request timeout instead of waiting forever.
- Results reuse a single panel instead of opening a new tab per scan; the panel is now semantic (landmarks, headings, list) and has a Content-Security-Policy.
- `axle.apiKey` is now a machine-scoped (user-only) setting, matching what the docs always claimed.
- One occasional, dismissible tip about running axle in CI (never on your first scan, at most weekly, `axle.showCiTip` turns it off).
- Moved to the axlescan.com domain; README corrected (it described a 5-scans/day limit that does not exist) and a precise privacy section added.

## 0.1.0 — 7 May 2026

Initial release.

- `axle.scanUrl` command — scans any URL via axle's hosted axe-core 4.11 endpoint.
- `axle.scanLocalhost` command — scans the URL configured in `axle.defaultUrl` (default: `http://localhost:3000`).
- `axle.openLastResult` command — re-renders the previous scan result.
- Webview panel with severity badges, per-violation HTML snippets, and shareable `/r/<id>` link when the optional axle API key is configured.
- Settings: `axle.defaultUrl`, `axle.failOn`, `axle.apiKey`.

No telemetry. One outbound HTTP request per scan to `axle-iota.vercel.app/api/scan` with the URL being scanned + a `vscode` source identifier.

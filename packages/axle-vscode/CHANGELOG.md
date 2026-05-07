# Changelog

## 0.1.0 — 7 May 2026

Initial release.

- `axle.scanUrl` command — scans any URL via axle's hosted axe-core 4.11 endpoint.
- `axle.scanLocalhost` command — scans the URL configured in `axle.defaultUrl` (default: `http://localhost:3000`).
- `axle.openLastResult` command — re-renders the previous scan result.
- Webview panel with severity badges, per-violation HTML snippets, and shareable `/r/<id>` link when the optional axle API key is configured.
- Settings: `axle.defaultUrl`, `axle.failOn`, `axle.apiKey`.

No telemetry. One outbound HTTP request per scan to `axle-iota.vercel.app/api/scan` with the URL being scanned + a `vscode` source identifier.

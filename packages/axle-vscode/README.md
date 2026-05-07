# axle — a11y / WCAG scanner for VS Code

Scan any URL for WCAG 2.2 AA accessibility violations from inside VS Code. Powered by [axe-core 4.11](https://github.com/dequelabs/axe-core), the same engine used by [axle](https://axle-iota.vercel.app), Pa11y, Lighthouse, and Microsoft Accessibility Insights.

## What it does

- **Command palette → "axle: Scan a URL"** — type any public URL, get a violations report in a side panel.
- **Command palette → "axle: Scan localhost dev server"** — scans `http://localhost:3000` (or whatever you've set as `axle.defaultUrl`). Useful while developing.
- **Command palette → "axle: Open last scan result"** — re-render the previous result without re-scanning.

Each scan returns a list of WCAG 2.2 AA violations grouped by severity (critical / serious / moderate / minor), with the offending HTML snippets and links to axe-core rule docs. If you have an axle API key, every scan also returns a public shareable `/r/<id>` URL.

## Why use this and not just open a browser

- **No context switch** — stay in your editor.
- **Keyboard-only flow** — Ctrl+Shift+P → type → Enter.
- **Same engine as the axle CI** — what you see locally is what the GitHub Action will catch on PR.
- **No telemetry, no analytics** — the extension makes one HTTP request to axle's hosted scanner per scan, and that's it.

## Configuration

Open VS Code settings and search for "axle". Three options:

| Setting | Default | Description |
|---|---|---|
| `axle.defaultUrl` | `http://localhost:3000` | URL used by "Scan localhost dev server" |
| `axle.failOn` | `serious` | Severity threshold (UI hint only — the scan returns all violations) |
| `axle.apiKey` | empty | Optional Team / Business API key (removes free-tier rate limit) |

## Pricing

The extension is free. Scans use the public free-scan endpoint with a daily rate limit (5 scans / IP / day at the time of writing). For unlimited scans + AI fix suggestions in the GitHub Action, see [axle pricing](https://axle-iota.vercel.app/pricing).

## Privacy

- The URL you scan is sent to `axle-iota.vercel.app/api/scan`. Nothing else.
- The extension does NOT scan files in your workspace, your local filesystem, or your git history.
- No analytics, no telemetry, no error reporting beyond what VS Code itself does.
- See [axle privacy policy](https://axle-iota.vercel.app/privacy) for the hosted scanner's data handling.

## How it differs from other a11y extensions

- **[Microsoft Accessibility Insights for Web](https://accessibilityinsights.io)** — browser extension; this is a VS Code extension.
- **[Web Accessibility (Maxim Salnikov)](https://marketplace.visualstudio.com/items?itemName=MaximSalnikov.vscode-web-accessibility)** — lints HTML files statically; axle scans the rendered page.
- **[axe-linter (Deque)](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter)** — also static HTML linter; same difference.

axle's value is **scanning the rendered page** — what your users actually see — not the raw HTML you write. Static linters miss everything that's introduced by client-side JavaScript, runtime ARIA, or dynamic content.

## Companion tools

| Surface | Package |
|---|---|
| GitHub Action | [`axle-action@v1`](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) |
| npm CLI | `npx axle-cli scan <url>` |
| Netlify plugin | `axle-netlify-plugin` |
| Cloudflare Pages plugin | `axle-cloudflare-plugin` |
| Vercel plugin | `axle-vercel-plugin` |
| WordPress plugin | "AsafAmos Accessibility Scanner" on WP.org |
| Web (no install) | [axle-iota.vercel.app](https://axle-iota.vercel.app) |

## License

MIT. Source: [github.com/asafamos/axle/tree/main/packages/axle-vscode](https://github.com/asafamos/axle/tree/main/packages/axle-vscode).

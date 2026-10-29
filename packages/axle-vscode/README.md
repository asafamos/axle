# axle — a11y / WCAG scanner for VS Code

Scan a URL — or your **localhost dev server** — for WCAG 2.2 AA accessibility violations without leaving VS Code, then click a violation to get an **AI-suggested code fix**. Powered by [axe-core 4.11](https://github.com/dequelabs/axe-core), the same engine used by [axle](https://axlescan.com), Pa11y, Lighthouse, and Microsoft Accessibility Insights.

## What it does

- **Command palette → "axle: Scan a URL"** — type any URL, get a violations report in a side panel.
- **Command palette → "axle: Scan localhost dev server"** — scans `http://localhost:3000` (or whatever you set as `axle.defaultUrl`). Local and private-network URLs are scanned **on your machine** by running `npx axle-cli` in a visible terminal — our servers can't reach your localhost. The first run needs a one-time `npx playwright install chromium`.
- **"Generate AI fix"** — a link on every violation card (or "axle: Generate AI fix for a violation…" in the palette). It asks Claude for a before/after change for one element and opens it as a Markdown document next to your code. The suggestion is **never applied automatically** — review it, then apply it yourself.
- **"axle: Open last scan result"** — re-render the previous result without re-scanning.

Results are grouped by severity (critical / serious / moderate / minor) with the offending HTML, WCAG tags and links to the axe-core rule docs. Issues below your `axle.failOn` threshold are collapsed, not hidden.

## Why use this and not just open a browser

- **No context switch** — stay in your editor.
- **Same engine as the axle CI** — what you see locally is what the GitHub Action will catch on a pull request.
- **Scans the rendered page** — what your users actually see, including everything client-side JavaScript adds.

## Settings

| Setting | Default | Description |
|---|---|---|
| `axle.defaultUrl` | `http://localhost:3000` | URL used by "Scan localhost dev server" |
| `axle.failOn` | `serious` | Lowest severity shown in the main list; lower ones are collapsed |
| `axle.apiKey` | empty | Optional axle API key (any paid plan) — lifts the free daily limit on AI fixes. Stored in user settings only |
| `axle.showCiTip` | `true` | Occasional, dismissible tip about running axle in CI (never on your first scan, at most weekly) |

## Pricing

The extension and scanning are free; no account is needed. AI fixes: the first few each day are free, then you need an axle API key — see [pricing](https://axlescan.com/pricing?utm_source=axle-vscode&utm_medium=extension&utm_campaign=readme). To run the same checks on every pull request, the [axle GitHub Action](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) is free for one repository.

## Privacy — exactly what leaves your machine

No telemetry, no analytics, no error reporting beyond what VS Code itself does. Requests only happen when you ask:

- **Scan a public URL** → the URL (and, if set, your API key) is sent to `axlescan.com/api/scan`, which loads the page in a headless browser and runs axe-core.
- **Scan localhost / a private address** → nothing is sent to us. The extension runs `npx axle-cli` locally with telemetry switched off. (It downloads the `axle-cli` npm package on first use.)
- **Generate AI fix** → after a one-time confirmation, the rule details plus the HTML of **one** element (up to 500 characters), its selector and axe's failure summary are sent to `axlescan.com/api/fix`, which passes them to Anthropic's Claude to produce the suggestion. Your API key, if set, is sent as a header. Nothing else from your workspace is sent.

The extension does **not** read your workspace files, your filesystem outside its own storage folder, or your git history. See the [privacy policy](https://axlescan.com/privacy).

## How it differs from other a11y extensions

- **[Web Accessibility (Maxim Salnikov)](https://marketplace.visualstudio.com/items?itemName=MaximSalnikov.vscode-web-accessibility)** and **[axe-linter (Deque)](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter)** lint HTML source files statically. axle scans the **rendered page**, so it also catches what JavaScript, runtime ARIA and dynamic content introduce.
- **[Microsoft Accessibility Insights for Web](https://accessibilityinsights.io)** is a browser extension; this one lives in your editor.

Automated tools find roughly 57% of WCAG issues. This is not a compliance certificate — manual review is still recommended.

## Companion tools

| Surface | Package |
|---|---|
| GitHub Action | [`axle-action@v1`](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) |
| npm CLI | `npx axle-cli scan <url>` |
| Netlify / Cloudflare Pages / Vercel | `axle-netlify-plugin`, `axle-cloudflare-plugin`, `axle-vercel-plugin` |
| WordPress plugin | "AsafAmos Accessibility Scanner" on WordPress.org |
| Web (no install) | [axlescan.com](https://axlescan.com) |

## License

MIT. Source: [github.com/asafamos/axle/tree/main/packages/axle-vscode](https://github.com/asafamos/axle/tree/main/packages/axle-vscode).

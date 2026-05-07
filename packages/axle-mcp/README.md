# axle-mcp

> WCAG 2.2 AA / ADA / EAA accessibility scanner as an **MCP (Model Context Protocol) server**. Lets Claude Desktop, Cursor, Cline, Continue, and any MCP-compatible agent scan websites for accessibility violations.

Same engine ([axe-core 4.11](https://github.com/dequelabs/axe-core)) and same persistence layer that powers the [axle GitHub Action](https://github.com/marketplace/actions/axle-accessibility-ci) and the [hosted scanner](https://axle-iota.vercel.app).

## What this gives your agent

Two tools:

| Tool | What it does |
|---|---|
| `scan_url` | Runs axe-core 4.11 against a public URL in headless Chromium and returns violations grouped by severity, plus a public shareable certificate URL at `/r/<id>`. |
| `explain_violation` | Given an axe-core rule ID (e.g. `color-contrast`), returns the WCAG criteria mapping, ADA / EAA implications, and remediation patterns. |

## Install

```bash
npm install -g axle-mcp
```

Or use without installing — `npx axle-mcp` works in MCP `command` configs.

## Configure

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"]
    }
  }
}
```

Restart Claude Desktop. You should see a 🔨 icon in the message composer; click it and `axle.scan_url` will be available.

### Cursor

Settings → Features → Model Context Protocol → Add server:

```
Command: npx -y axle-mcp
```

### Cline (VS Code extension)

Settings → MCP Servers → Add:

```json
{
  "axle": {
    "command": "npx",
    "args": ["-y", "axle-mcp"]
  }
}
```

### Continue.dev

In `~/.continue/config.json`:

```json
{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"]
    }
  }
}
```

## Usage examples

In any MCP-connected chat, just ask:

> Is `https://example.com` ADA compliant?

> Scan `https://stripe.com/pricing` for WCAG 2.2 AA violations.

> Audit my staging site at `https://staging.acme.com` and explain the top 3 issues.

The agent will call `scan_url`, get the structured violation report, summarize by severity, and link to the `/r/<id>` shareable certificate URL.

## Removing the rate limit

The free tier is 5 scans / day per IP. To remove the limit, get an API key from <https://axle-iota.vercel.app/pricing> and add it to the env:

```json
{
  "mcpServers": {
    "axle": {
      "command": "npx",
      "args": ["-y", "axle-mcp"],
      "env": {
        "AXLE_API_KEY": "sk_axle_..."
      }
    }
  }
}
```

## Privacy & data flow

When the agent calls `scan_url`, the URL you pass is sent to `https://axle-iota.vercel.app/api/scan`. The axle hosted scanner loads that URL in headless Chromium and runs axe-core 4.11 against it. The scan result (violations, passes, the page title) is persisted to the axle KV store with a public `/r/<id>` permalink so you can share it; the scan _input_ (your URL) is logged for rate-limiting and abuse prevention but is not exposed publicly.

If you don't want the public permalink, scan locally with the [axle CLI](https://www.npmjs.com/package/axle-cli) instead — it runs entirely on your machine.

## Why use axle vs the existing axe-core MCP servers?

- **Same engine as the GitHub Action** — what you see in chat is exactly what the CI will block on PR.
- **Public shareable certificate URLs** — `/r/<id>` is a permanent public report you can paste into a Jira ticket, a sales-engineering doc, or an EAA conformance bundle.
- **No local Chromium** — runs against the hosted scanner, so it works even when you don't have Playwright / Chromium installed.
- **Local-first option** — if you _do_ want fully local scanning, swap to [`axle-cli`](https://www.npmjs.com/package/axle-cli) (same project, same engine, no network calls).

## Honest scope

axe-core (and therefore this server) catches roughly **57% of WCAG issues** automatically. The other 43% require manual review by a qualified human auditor. Treat the output as a high-recall first pass, not a conformance certificate.

## License

MIT

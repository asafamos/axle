# Reddit post — r/ClaudeAI + r/cursor + r/LocalLLaMA

Newest surface, freshest news. Post first because MCP-discovery audience is small but extremely high-intent.

**Posting strategy:**
- Post #1 to **/r/ClaudeAI** (highest-intent MCP audience) → wait 24h → reply to all comments
- Post #2 to **/r/cursor** with a re-worded title (same body, different angle) → wait 48h
- Post #3 to **/r/LocalLLaMA** ONLY if first two get traction — different audience, may read as off-topic

---

## /r/ClaudeAI — recommended starter

**Title**: `Built an MCP server that lets Claude scan any URL for WCAG accessibility violations`

**Body**:

For folks installing MCP servers — there's now a dedicated one for accessibility scanning. Lets Claude (Desktop or Cursor or Cline or Continue.dev) audit any public URL against WCAG 2.1 / 2.2 AA in one tool call.

Two tools:
- `scan_url(url)` — runs axe-core 4.11 against the URL in headless Chromium, returns violations grouped by severity (critical / serious / moderate / minor) plus a public shareable certificate page at `/r/<id>` so you can paste a link into Jira / a sales doc / a conformance bundle.
- `explain_violation(rule_id)` — given an axe-core rule like `color-contrast` or `image-alt`, returns the WCAG criterion mapping + ADA / EAA framing + Deque University remediation patterns.

Install in Claude Desktop — edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Restart Claude Desktop. The 🔨 icon shows up in the composer and `axle.scan_url` is callable. Then just ask:

> Is https://example.com ADA compliant?
> Scan https://stripe.com/pricing for WCAG 2.2 AA violations.
> Audit my staging site at https://staging.acme.com and explain the top 3 issues.

It's the same axe-core 4.11 engine that powers the GitHub Action / CLI / Storybook / VSCode plugins, so what you see in chat matches CI exactly.

Free tier: 5 scans/day per IP. Source + Cursor / Cline / Continue configs: https://axle-iota.vercel.app/mcp

(Honest scope: axe-core catches ~57% of WCAG issues. Manual review by a human auditor is still recommended before claiming full conformance. The MCP server is a high-recall first pass, not a certificate.)

Curious if folks are using MCP for anything I'm not thinking of — what other agent-style accessibility workflows have people built?

---

## /r/cursor — adapted title

**Title**: `Free MCP server for accessibility scanning — wired into Cursor in 2 lines`

**Body**:

If you're shipping web code in Cursor and want Cursor itself to flag WCAG violations during code review: this is a dedicated MCP server for that.

Settings → Features → Model Context Protocol → Add server:

```
Command: npx -y axle-mcp
```

Now Cursor's agent can call `scan_url` on any public URL — preview deploy, staging, production, prod-of-a-competitor for benchmarking. Returns violations grouped by severity plus a shareable public certificate URL at `/r/<id>`.

Engine is axe-core 4.11 (the same one Deque's tools use and the same one most CI a11y scanners run). Free tier: 5 scans/day per IP. Removing the limit is `$49/mo` and you paste the key into the MCP config env.

Source + configs for Claude Desktop / Cline / Continue if anyone uses those: https://axle-iota.vercel.app/mcp

What other MCP-based workflows are people running in Cursor? I keep hearing it's the killer feature but haven't seen a definitive list of "this is what's actually useful."

---

## Posting tips for this audience

1. **r/ClaudeAI moderators are strict about self-promo.** The post above leads with the install snippet (high utility) and the link is at the bottom as supporting docs, not the headline. If the title sounds like an ad, it'll get auto-removed.
2. **Engage in comments.** First-hour comments drive the algorithm. Reply substantively to every "does it work with X?" question — and *demo it live* if anyone shares a URL to scan.
3. **Don't cross-post the same body.** I drafted /r/cursor with a different angle on purpose. Reddit's spam filter ranks duplicate-body multi-sub posts.
4. **Watch for "this is overlay-bashing" comments.** Pre-empt: axle is NOT an overlay — it's CI tooling, source-code scanning, no runtime JavaScript injection on the public site.

# axle — Slack App

Run accessibility scans from any Slack channel. Drop:

```
/axle scan https://example.com
```

into a channel and axle posts the WCAG 2.1 / 2.2 AA violations grouped by severity, plus a public shareable certificate URL at `/r/<id>`.

## Install

There are two paths.

### Path A — install the hosted app (recommended)

Once the Slack-listed version is live, click **Add to Slack** at <https://axle-iota.vercel.app/slack>. Authorize against your workspace. Done.

(That listing is in the pipeline — see [adopter signals](https://axle-iota.vercel.app/case-studies) for status.)

### Path B — self-host

If you'd rather run your own Slack App instance (e.g. for enterprise-mode deployments, single-tenant data residency, or to avoid axle's free-tier rate limits without buying a plan):

1. Open <https://api.slack.com/apps> → **Create New App** → **From an app manifest**.
2. Pick your workspace.
3. Paste the contents of `packages/axle-slack/manifest.yaml` into the manifest field.
4. Review and create. Slack will generate the OAuth credentials.
5. Set environment variables on your deployment:

   ```bash
   SLACK_SIGNING_SECRET=<from "Basic Information" tab>
   SLACK_CLIENT_ID=<from "Basic Information" tab>
   SLACK_CLIENT_SECRET=<from "Basic Information" tab>
   ```

6. Update the `url:` fields in the manifest to point at your deployment (e.g. `https://your-axle.example.com/api/slack/command` and `https://your-axle.example.com/api/slack/oauth`).
7. In the Slack App admin **Install App** tab, click **Install to Workspace** and authorize.

## What axle requests

| Scope | Why |
|---|---|
| `commands` | Register the `/axle` slash command |
| `chat:write` | Post scan results back to the channel |
| `chat:write.public` | Post in channels axle hasn't been invited to (so a one-off `/axle scan` works without an admin step) |

axle does **not** request `channels:history`, `users:read`, or anything that would let it read messages or DMs. The only data leaving Slack is the URL you explicitly type after `/axle scan`.

## Data flow

```
You: /axle scan https://example.com   (in #design or any channel)
   ↓ POST https://axle-iota.vercel.app/api/slack/command
   ↓ axle responds with ephemeral "scanning..." within 3s (Slack timeout)
   ↓ async: axle launches headless Chromium, runs axe-core 4.11
   ↓ when scan completes, axle POSTs the result back via response_url
   ↓ block-kit message in channel: severity summary + top 3 violations
       + button "Full report at /r/<id>"
```

Scan results are persisted at `/r/<id>` for 30 days. Free tier limits and pricing apply as elsewhere in axle.

## Pricing

Same as the rest of axle: 5 scans/day per workspace on free; Team ($49/mo) and Business ($299/mo) plans remove the limit and add multi-repo features. See <https://axle-iota.vercel.app/pricing>.

## Honest scope

axe-core catches ~57% of WCAG issues. Manual review by a human auditor is still recommended for full conformance. The Slack App is a high-recall first-pass scanner, not a certificate.

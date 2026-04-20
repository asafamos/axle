# axle-vercel-plugin

Run the axle accessibility scanner against every Vercel deploy preview. Fails the build when WCAG 2.1 / 2.2 AA violations cross your threshold.

## Install

Set your Vercel project's **Build Command** (Project Settings → General → Build & Development Settings):

```
next build && npx -y axle-vercel-plugin
```

Or add it as a postbuild hook in `package.json`:

```json
{
  "scripts": {
    "postbuild": "axle-vercel-plugin"
  }
}
```

## Configuration (env vars)

Set these in Vercel → Project Settings → Environment Variables.

| Variable | Default | Notes |
|----------|---------|-------|
| `AXLE_FAIL_ON` | `serious` | `critical` / `serious` / `moderate` / `minor` / `none` |
| `AXLE_WITH_AI_FIXES` | `"false"` | Set to `"true"` + `ANTHROPIC_API_KEY` for Claude-generated diffs |
| `AXLE_MAX_AI_FIXES` | `10` | Cost guard on AI calls per build |
| `AXLE_URL` | `$VERCEL_BRANCH_URL` / `$VERCEL_URL` | Override the target URL |
| `ANTHROPIC_API_KEY` | — | Required only if `AXLE_WITH_AI_FIXES=true` |

## What it does

1. Waits for your build to finish.
2. Reads `VERCEL_BRANCH_URL` (preferred) or `VERCEL_URL` — Vercel sets these automatically.
3. Invokes `axle-cli scan` against the preview URL.
4. Writes `axle-report.json` + `axle-report.md` into the project root so they're viewable in the deployment.
5. Prints the first ~4kB of the markdown report into build logs.
6. Exits non-zero when violations meet or exceed `AXLE_FAIL_ON` — this fails the deployment.

## Not a compliance certificate

Remediation assistance only. Automated tools catch ~57% of WCAG issues — manual human review is still recommended.

---

Learn more: [axle-iota.vercel.app](https://axle-iota.vercel.app?utm_source=axle-vercel) · [GitHub](https://github.com/asafamos/axle?utm_source=axle-vercel)

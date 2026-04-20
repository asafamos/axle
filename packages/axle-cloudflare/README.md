# axle-cloudflare-plugin

Scan your Cloudflare Pages preview URL for WCAG 2.1 / 2.2 AA violations on every deploy.

## Install

Add to your Cloudflare Pages build step:

```
npx axle-cloudflare-plugin
```

Or add to your `package.json`:

```json
{
  "scripts": {
    "postbuild": "axle-cloudflare-plugin"
  }
}
```

## Configuration (env vars)

| Variable | Default | Notes |
|----------|---------|-------|
| `AXLE_FAIL_ON` | `serious` | `critical` / `serious` / `moderate` / `minor` / `none` |
| `AXLE_WITH_AI_FIXES` | `"false"` | Set to `"true"` + `ANTHROPIC_API_KEY` to include Claude-generated diffs |
| `AXLE_MAX_AI_FIXES` | `10` | Cost guard |
| `AXLE_URL` | `$CF_PAGES_URL` | Override the target URL |

Set these in Cloudflare Pages → Settings → Environment Variables.

## What it does

1. Reads the preview URL from `CF_PAGES_URL` (Cloudflare sets this during builds).
2. Invokes `axle-cli` to scan against axe-core 4.11 + Claude Sonnet 4.6.
3. Writes a JSON + markdown report next to your publish dir.
4. Prints the first ~4kB of the report into build logs.
5. Exits non-zero when violations meet/exceed `AXLE_FAIL_ON`.

## Not a compliance certificate

Remediation assistance only. Automated tools catch ~57% of WCAG issues — manual human review is still recommended.

---

Learn more: [axle-iota.vercel.app](https://axle-iota.vercel.app?utm_source=axle-cloudflare) · [GitHub](https://github.com/asafamos/axle?utm_source=axle-cloudflare)

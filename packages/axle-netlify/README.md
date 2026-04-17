# @axle/netlify-plugin

Netlify Build Plugin that runs the axle accessibility scanner against your deploy-preview URL and fails the build on WCAG regressions.

## Install

```toml
# netlify.toml
[[plugins]]
  package = "@axle/netlify-plugin"
  [plugins.inputs]
    failOn = "serious"           # critical | serious | moderate | minor | none
    withAiFixes = false           # set true + ANTHROPIC_API_KEY env to enable AI diffs
    maxAiFixes = 10
    # url = "https://preview.mydomain.dev"  # optional override
```

Set `ANTHROPIC_API_KEY` in Netlify site → Environment if you want AI fix suggestions in the build log.

## What it does

1. Waits for Netlify to finish the build.
2. Reads the deploy-prime URL from `DEPLOY_PRIME_URL`.
3. Runs `@axle/cli scan` against it with your threshold.
4. Writes `axle-report.json` + `axle-report.md` next to your `publish` dir (so you can download them from the deploy).
5. Fails the build if violations meet or exceed `failOn`.

## Not a compliance certificate

Remediation assistance only. Manual human review still recommended for full WCAG conformance.

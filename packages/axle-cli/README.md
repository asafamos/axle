# axle-cli

Command-line accessibility compliance runner. Scans a URL for WCAG 2.1 / 2.2 AA violations with axe-core and optionally generates surgical code-fix suggestions using Claude Sonnet.

```bash
npx axle-cli scan https://example.com \
  --fail-on serious \
  --with-ai-fixes \
  --markdown-out a11y.md
```

- No signup. Run locally, in CI, on a cron.
- `npx axle-cli scan --help` for all options.
- Works behind any host: localhost, Vercel preview, Netlify preview, production.
- Produces a machine-readable JSON report and a human-readable markdown report.
- Exits non-zero at or above `--fail-on` severity (perfect for CI).

## Why not just use axe-core directly?

axe-core tells you what's wrong. `axle-cli` also proposes the fix, writes the PR comment, tracks regressions, and ships artifacts your compliance officer needs (accessibility statement, audit trail, badge). Same engine underneath, a workflow around it.

## Not a compliance certificate

Remediation assistance only. Automated tools catch ~57% of WCAG issues. Human review recommended for full conformance.

---

Learn more: [axle-iota.vercel.app](https://axle-iota.vercel.app?utm_source=axle-cli) · [GitHub](https://github.com/asafamos/axle?utm_source=axle-cli)

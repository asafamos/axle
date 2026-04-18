# axle — Chrome Extension

Scan the current tab for WCAG 2.1 / 2.2 AA accessibility violations with axe-core, in 2 seconds.

## Features

- **One-click scan** of the active tab, right from the browser toolbar.
- **Live summary** with critical / serious / moderate / minor counts.
- **Violation list** with rule ID, affected element count, and severity.
- **Open full report** link that jumps to the hosted axle web UI for AI fix suggestions.

## Privacy

- 100% client-side. axe-core runs inside the page, no network calls to axle's servers.
- No account, no tracking, no personal data collected.

## Install

Once listed in the Chrome Web Store: search "axle accessibility".

## Dev

1. Copy `node_modules/axe-core/axe.min.js` to this directory.
2. Generate icon PNGs into `./icons/` (16, 32, 48, 128).
3. Load unpacked at `chrome://extensions` with Developer Mode.

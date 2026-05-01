---
title: "React accessibility — what actually moves the needle in 2026"
published: false
description: "A practical, engineering-focused guide to making React apps accessible. Component semantics, useId, focus management on route changes, dialogs, live regions, jest-axe + Playwright testing, and a CI pipeline that prevents regressions."
tags: react, accessibility, a11y, webdev
canonical_url: https://axle-iota.vercel.app/guides/react-accessibility
cover_image:
---

> **Posting instructions for asaf**: paste this whole file (without this blockquote) into dev.to. The `react` tag is huge — this is the broadest-reach of the four. Best post day: Tuesday/Wednesday morning Pacific time.

---

A React app is "accessible" when keyboard-only users, screen-reader users, and users with low vision or motor impairments can complete the same tasks as everyone else. That's it. The rest of this post is how to actually achieve that without losing your mind.

This is the engineering-focused version. WCAG 2.2 AA is the practical legal target. Most teams I work with cover ~80% of WCAG with disciplined patterns, then catch the rest with tooling. None of this is React-specific in spirit, but React-specific patterns matter because the framework lets you ship 10× more bugs 10× faster.

## Component semantics — the cardinal sin

The single most common React accessibility bug:

```jsx
// Wrong — screen readers don't announce divs as interactive
<div onClick={handleClick} className="btn">Submit</div>

// Right — semantic, keyboard-focusable, announced correctly
<button type="button" onClick={handleClick} className="btn">Submit</button>
```

If a thing is interactive, use the right HTML element. The shortlist:

- Submitting a form → `<button type="submit">`
- Navigating between routes → `<a href>` (or your router's `<Link>`)
- Toggling a value → `<input type="checkbox">` or `<input type="radio">`
- Accepting text → `<input type="text">` or `<textarea>`

When you genuinely need a custom interactive pattern (combobox, menu, tab list, disclosure), follow the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). For most patterns, [Headless UI](https://headlessui.com/), [Radix UI](https://www.radix-ui.com/), or [React Aria](https://react-spectrum.adobe.com/react-aria/) implement them correctly. Use one rather than hand-rolling.

## Forms with `useId`

React 18 introduced `useId`. Use it for label/input wiring:

```jsx
function Field({ label, error, ...props }) {
  const id = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

Three things going on:

1. `htmlFor={id}` couples the label to the input — screen readers announce the label name on focus.
2. `aria-describedby={errorId}` links the error message to the input.
3. `role="alert"` makes the error announce the moment it renders.

Don't rely on `placeholder` as a label substitute — fails WCAG 3.3.2 and most autofill heuristics.

## Focus management on route changes

React Router does not move focus on navigation. Keyboard and screen-reader users get left behind on the previous page's activation point. WCAG 2.4.3 fail.

```jsx
import { useLocation } from "react-router-dom";

function FocusOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    const target = document.querySelector("h1, [role='main']");
    if (target instanceof HTMLElement) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: false });
    }
  }, [pathname]);
  return null;
}

// Mount once at the app root
<FocusOnRouteChange />
```

Pair with updating `document.title` per route — most screen-reader/browser combinations announce the title on navigation.

For Next.js App Router, the same pattern works inside `app/template.tsx` with `usePathname`.

## Dialogs — use the native `<dialog>`

The native `<dialog>` element handles focus trap, backdrop, and Escape-to-close for you in modern browsers. Prefer it to a custom `role="dialog"` div:

```jsx
function Modal({ open, onClose, children, label }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} aria-label={label} onClose={onClose}>
      {children}
    </dialog>
  );
}
```

If you need headless behaviour (custom animation, portal, nested dialogs), Radix's `Dialog` or Headless UI's `Dialog` are the path of least breakage. **Don't hand-roll focus trap** — the known-bad patterns always bite.

## Live regions for async state

Async actions that complete visibly — toast notifications, search-result counts, form-submit success — need to announce to screen readers via an ARIA live region.

```jsx
function LiveAnnouncer({ message }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
```

Use `aria-live="polite"` for status updates, `aria-live="assertive"` for time-critical errors. Use assertive sparingly — it interrupts whatever the user was listening to.

## Testing — jest-axe + Playwright

Component-level test:

```js
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend({ toHaveNoViolations });

test("ProductCard has no a11y violations", async () => {
  const { container } = render(<ProductCard {...props} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Page-level test (Playwright):

```js
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage is accessible", async ({ page }) => {
  await page.goto("/");
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations).toEqual([]);
});
```

Component tests catch most of what your design system controls. Page-level Playwright tests catch interaction issues, layout problems, and rendered-state issues that unit tests miss.

## CI pipeline

GitHub Actions:

```yaml
name: Accessibility
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1
        with:
          url: ${{ secrets.PREVIEW_URL }}
          fail-on: serious
```

Free for one repo. Posts a sticky comment on the PR with the violations grouped by severity, fails the check if anything serious slips through. There are alternatives — `axe-core/cli` directly, Pa11y, Lighthouse CI — pick one that fits your stack.

## Cost framing

A typical React SaaS app needs:

- 1 week of focused work to get the baseline clean
- Continuous CI to prevent regression (basically free)
- ~$5-15K annual human audit for the 43% of WCAG criteria automated tools can't evaluate

Total cost is *much* lower than the alternatives:

- Overlay widget: $5K-$20K/year, doesn't actually pass regulator scrutiny ([FTC fined accessiBe $1M](https://www.ftc.gov/news-events/news/press-releases) in January 2025 over this exact thing)
- Audit-firm tier: $40K+/year for the relevant rigour
- ADA lawsuit settlement: $8K-$40K typical, but you also pay the engineering effort to actually fix the issues, so you'd have done the work anyway

## Common gotchas in React specifically

- **Custom select / combobox** without `role="listbox"` + `aria-activedescendant` or actual focus management. Single biggest source of "serious" violations.
- **Conditional render of the wrong subtree** — focus jumps to nowhere when content disappears. Track focus explicitly across conditionals.
- **`onClick` on `<div>`** — see top of post.
- **Floating tooltips** without `aria-describedby` linking to the trigger. Sighted users see them; screen reader users don't.
- **`useEffect` that fires on every render and re-announces** the same status — debounce or only announce on state transitions.
- **Image components** that omit `alt`. Next.js's `<Image>` requires `alt` explicitly. Don't use `alt=""` unless the image is purely decorative — and then use it deliberately.

## Resources

- [Full version of this post](https://axle-iota.vercel.app/guides/react-accessibility) on axle
- [Free axe-core scan](https://axle-iota.vercel.app/free-scan) — full WCAG 2.2 AA report by email
- [axle GitHub Action](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci) — CI scanning, free for one repo
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — the reference for custom interactive patterns
- [Radix UI](https://www.radix-ui.com/) / [Headless UI](https://headlessui.com/) / [React Aria](https://react-spectrum.adobe.com/react-aria/) — accessible primitives so you don't have to hand-roll

---

Happy to answer questions in the comments — particularly which tools to use for what. If you're at the "we just got a demand letter" stage, my [first-48-hours playbook](https://axle-iota.vercel.app/ada-demand-letter) is more useful than this post.

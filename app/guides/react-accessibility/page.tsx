import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "React accessibility — WCAG 2.1 AA for components, hooks, testing (2026)",
  description:
    "Practical accessibility for React 19 apps: semantic components, ARIA patterns, useEffect-safe focus management, form associations, testing with jest-axe, and CI setup that blocks accessibility regressions in PRs.",
  keywords: [
    "React accessibility",
    "React a11y",
    "React WCAG",
    "ARIA React",
    "jest-axe",
    "React focus management",
    "React 19 accessibility",
    "axle",
  ],
  openGraph: {
    title: "React accessibility — a practical WCAG 2.1 AA guide",
    description:
      "Component patterns, focus management, form labels, jest-axe testing, and a CI pipeline that blocks regressions.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/react-accessibility" },
};

export default function ReactAccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          React · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          React accessibility — a practical WCAG 2.1 AA guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          React is a component toolkit, not an accessibility framework. Most accessibility
          problems in React apps are caused by devs writing <code>&lt;div onClick&gt;</code> where
          a <code>&lt;button&gt;</code> belongs, or spreading ARIA attributes without
          understanding what they imply. This guide covers the patterns that come up in
          every real React codebase, focus management in a SPA, form associations, and
          the tooling that catches regressions before they ship.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#semantics">Use the right element first</a></li>
            <li><a className="hover:underline" href="#forms">Form inputs and labels</a></li>
            <li><a className="hover:underline" href="#focus">Focus management across routes</a></li>
            <li><a className="hover:underline" href="#dialogs">Dialogs, menus, and focus traps</a></li>
            <li><a className="hover:underline" href="#live">Live regions and async status</a></li>
            <li><a className="hover:underline" href="#testing">Testing — jest-axe + Playwright + axe-core</a></li>
            <li><a className="hover:underline" href="#ci">CI pipeline</a></li>
          </ol>
        </nav>

        <section id="semantics" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Use the right element first</h2>
          <p className="mt-3 text-slate-700">
            Before you reach for ARIA, reach for HTML. <code>&lt;button&gt;</code> is
            focusable by default, fires on Enter / Space, has a role of &quot;button&quot;, and is
            announced by screen readers correctly. A <code>&lt;div onClick&gt;</code> has
            none of that.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// ❌ Inaccessible — not focusable, not keyboard-operable, wrong role
<div onClick={handleClick} className="btn">Submit</div>

// ✅ Use the native element
<button type="button" onClick={handleClick} className="btn">Submit</button>

// ✅ If you must use div (rare), you'd need all of this
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  }}
  aria-pressed={pressed}
>
  Submit
</div>`}</code></pre>
        </section>

        <section id="forms" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Form inputs and labels</h2>
          <p className="mt-3 text-slate-700">
            Every interactive input needs a programmatic label. <code>useId()</code>{" "}
            (React 18+) is the cleanest way to wire <code>htmlFor</code> to a server-safe
            unique id:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`import { useId } from "react";

function EmailField({ error }) {
  const id = useId();
  const errorId = \`\${id}-error\`;
  return (
    <>
      <label htmlFor={id}>Email address</label>
      <input
        id={id}
        type="email"
        required
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p id={errorId} role="alert" className="text-red-600">{error}</p>}
    </>
  );
}`}</code></pre>
          <p className="mt-3 text-slate-700">
            Placeholder text is not a label. Screen readers often don&apos;t announce
            placeholders; when the user starts typing, the placeholder disappears and
            the field loses context. Always pair placeholder with a visible or
            visually-hidden <code>&lt;label&gt;</code>.
          </p>
        </section>

        <section id="focus" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Focus management across routes
          </h2>
          <p className="mt-3 text-slate-700">
            When a user clicks a link in a traditional page, the browser moves focus to
            the top of the new page. In a React SPA (or Next.js App Router), focus stays
            where it was — which disorients keyboard and screen-reader users.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// Pattern: focus the h1 of the new page on route change
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageFocusManager() {
  const pathname = usePathname();
  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return; // don't steal focus on initial load
    }
    const h1 = document.querySelector<HTMLHeadingElement>("h1[tabindex='-1']");
    h1?.focus();
  }, [pathname]);
  return null;
}

// In each page:
<h1 tabIndex={-1} className="outline-none">Pricing</h1>`}</code></pre>
          <p className="mt-3 text-slate-700">
            Also include a skip link at the top of the document, visible only on focus:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
  Skip to main content
</a>
<main id="main" tabIndex={-1}>…</main>`}</code></pre>
        </section>

        <section id="dialogs" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Dialogs, menus, and focus traps
          </h2>
          <p className="mt-3 text-slate-700">
            Most WCAG violations cluster around modal interactions. The native{" "}
            <code>&lt;dialog&gt;</code> element handles focus trap, Escape key, and
            backdrop click out of the box. Use it instead of rolling your own:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`function ConfirmDialog({ open, onClose, title, children }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (open && !ref.current.open) ref.current.showModal();
    if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="dlg-title"
      className="rounded-lg p-6 backdrop:bg-black/50"
    >
      <h2 id="dlg-title">{title}</h2>
      {children}
    </dialog>
  );
}`}</code></pre>
          <p className="mt-3 text-slate-700">
            If you need a custom dialog (e.g., for transition animations), libraries like{" "}
            <code>@radix-ui/react-dialog</code> and <code>react-aria</code> handle focus
            trap, ARIA wiring, and Escape key correctly. Don&apos;t write that plumbing yourself.
          </p>
        </section>

        <section id="live" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Live regions and async status
          </h2>
          <p className="mt-3 text-slate-700">
            When a form submission completes, a toast appears, or a search result updates —
            sighted users see it. Screen-reader users don&apos;t, unless you mark the
            container as an ARIA live region.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// Assertive — interrupts the screen reader immediately (errors)
<div role="alert" aria-live="assertive">
  {error && error.message}
</div>

// Polite — waits for a pause (status, toasts, save indicators)
<div role="status" aria-live="polite">
  {saving ? "Saving…" : "Saved ✓"}
</div>`}</code></pre>
          <p className="mt-3 text-slate-700">
            Don&apos;t sprinkle <code>aria-live</code> everywhere — it causes announcement
            storms. One <code>role=&quot;status&quot;</code> region per logical area is
            usually enough.
          </p>
        </section>

        <section id="testing" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Testing — jest-axe + Playwright + axe-core
          </h2>
          <p className="mt-3 text-slate-700">
            Two layers of testing catch different things:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Unit-level with jest-axe</strong> — render a component in a test
              and run axe against its DOM. Catches the basics (missing alt, wrong ARIA).
            </li>
            <li>
              <strong>E2E with Playwright + @axe-core/playwright</strong> — scan a full
              rendered page in a real headless browser. Catches interaction-driven
              issues (live regions, focus order).
            </li>
          </ul>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// unit: jest-axe
import { axe } from "jest-axe";
test("PricingCard is accessible", async () => {
  const { container } = render(<PricingCard tier="team" />);
  expect(await axe(container)).toHaveNoViolations();
});

// e2e: Playwright
import AxeBuilder from "@axe-core/playwright";
test("homepage has no serious violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations.filter(v => v.impact === "serious" || v.impact === "critical")).toHaveLength(0);
});`}</code></pre>
        </section>

        <section id="ci" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">CI pipeline</h2>
          <p className="mt-3 text-slate-700">
            Unit + E2E tests live in your existing CI. For the end-user-facing
            &quot;block merges on new accessibility regressions&quot; outcome, add axle
            alongside:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`# .github/workflows/accessibility.yml
name: Accessibility
on: pull_request

permissions:
  contents: read
  pull-requests: write

jobs:
  axle:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1
        with:
          install-command: npm ci
          build-command: npm run build
          start-command: npm start
          wait-on-port: "3000"
          fail-on: serious
          with-ai-fixes: "true"
          anthropic-api-key: \${{ secrets.ANTHROPIC_API_KEY }}`}</code></pre>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <Link
              href="/guides/nextjs-accessibility"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Next.js-specific guide
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← axle home
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Updated: 21 April 2026. Covers React 18 + 19. Class-component patterns
            (pre-hooks) are broadly similar; the <code>useEffect</code> + <code>useId</code>{" "}
            hooks map to <code>componentDidMount</code> + a stable instance id.
            Feedback:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

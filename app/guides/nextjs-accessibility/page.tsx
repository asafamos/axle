import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js accessibility — WCAG 2.1 AA checklist + CI setup (2026)",
  description:
    "Practical accessibility for Next.js apps: App Router SSR a11y, Image component alt text, Link vs anchor, forms, focus management, and how to put axe-core in CI so regressions fail your PR builds.",
  keywords: [
    "Next.js accessibility",
    "Next.js a11y",
    "WCAG Next.js",
    "App Router accessibility",
    "Next.js axe-core",
    "React accessibility CI",
    "EAA Next.js",
    "axle",
  ],
  openGraph: {
    title: "Next.js accessibility — a practical WCAG 2.1 AA guide",
    description:
      "App Router specifics, the pieces most developers get wrong, and a copy-paste CI setup that blocks merges on accessibility regressions.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/nextjs-accessibility" },
};

export default function NextjsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Next.js · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Next.js accessibility — a practical WCAG 2.1 AA guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Next.js gives you SSR, Image optimisation, and a routing system that developers
          love. It does not give you accessibility for free. This guide covers the Next.js
          specifics — App Router SSR quirks, the Image and Link components, form
          interactions, and focus management — plus a copy-paste CI pipeline that blocks
          merges on WCAG regressions. Written for Next 14 / 15 / 16.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#html-lang">Declare language on the html tag (App Router)</a></li>
            <li><a className="hover:underline" href="#images">The Image component — alt text and decorative images</a></li>
            <li><a className="hover:underline" href="#links">Link vs anchor vs button</a></li>
            <li><a className="hover:underline" href="#forms">Form labels and error messaging</a></li>
            <li><a className="hover:underline" href="#focus">Focus management on client-side navigation</a></li>
            <li><a className="hover:underline" href="#headings">Heading hierarchy across the App Router tree</a></li>
            <li><a className="hover:underline" href="#dialog">Dialogs and overlays — the 5 requirements</a></li>
            <li><a className="hover:underline" href="#ci">CI setup — block regressions in every PR</a></li>
          </ol>
        </nav>

        <section id="html-lang" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Declare language on the html tag
          </h2>
          <p className="mt-3 text-slate-700">
            WCAG 3.1.1 requires each page declares its primary language. In App Router,
            this lives in the root <code>app/layout.tsx</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">    {/* or "he", "de", "fr" for localised sites */}
      <body>{children}</body>
    </html>
  );
}`}</code></pre>
          <p className="mt-3 text-slate-700">
            For multi-language sites using a <code>[locale]</code> segment, pass locale
            through:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return <html lang={locale}>...</html>;
}`}</code></pre>
        </section>

        <section id="images" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            The Image component — alt text and decorative images
          </h2>
          <p className="mt-3 text-slate-700">
            <code>next/image</code> requires an <code>alt</code> prop — but TypeScript
            won&apos;t stop you from passing an empty string or a filename.
            <strong> Empty <code>alt=&quot;&quot;</code> is correct</strong> for
            decorative images that carry no information. <strong>Never</strong> put the
            filename or &quot;image&quot;.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// ✅ Informative image — describe what it shows
<Image src={hero} alt="Accessibility report showing 3 critical violations" />

// ✅ Decorative image — empty alt tells screen readers to skip
<Image src={splash} alt="" />

// ❌ Never this — screen readers read it literally
<Image src={logo} alt="logo.png" />
<Image src={ad} alt="image" />`}</code></pre>
          <p className="mt-3 text-slate-700">
            Logos are tricky: <code>alt=&quot;axle&quot;</code> is fine if the brand name
            is itself information. If the logo sits next to a text heading that already
            says &quot;axle&quot;, use <code>alt=&quot;&quot;</code> to avoid repetition for
            screen-reader users.
          </p>
        </section>

        <section id="links" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Link vs anchor vs button</h2>
          <p className="mt-3 text-slate-700">
            <code>next/link</code> renders an anchor. Use it for navigation. Use a{" "}
            <code>&lt;button&gt;</code> for actions that don&apos;t change URL (toggle a
            menu, open a modal, submit a form). This is WCAG 4.1.2 compliance — screen
            readers announce &quot;link&quot; vs &quot;button&quot; differently.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// ✅ Navigates to a route
<Link href="/pricing">See pricing</Link>

// ✅ Action, no URL change
<button onClick={() => setMenuOpen(true)}>Open menu</button>

// ❌ Confusing for assistive tech
<Link href="#" onClick={() => doSomething()}>Open menu</Link>

// ❌ Worse — div doesn't get keyboard focus at all
<div onClick={() => navigate()} role="link">Go</div>`}</code></pre>
          <p className="mt-3 text-slate-700">
            Opening a link in a new tab? Include visually-hidden text or an explicit
            indicator — users on screen readers can&apos;t see the <code>target=&quot;_blank&quot;</code>{" "}
            behaviour.
          </p>
        </section>

        <section id="forms" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Form labels and error messaging
          </h2>
          <p className="mt-3 text-slate-700">
            Placeholder text is not a label. When the user starts typing, it disappears —
            and screen readers often don&apos;t announce placeholders at all. WCAG 3.3.2
            requires every input have a programmatically associated label.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// ✅ Explicit label
<label htmlFor="email">Email address</label>
<input id="email" type="email" placeholder="you@example.com" required />

// ✅ Visually hidden label (when design requires no visible label)
<label htmlFor="search" className="sr-only">Search</label>
<input id="search" type="search" placeholder="Search…" />

// ❌ Placeholder-as-label
<input type="email" placeholder="Email address" />`}</code></pre>
          <p className="mt-3 text-slate-700">
            Error messages must be announced, not just coloured red. Associate them via{" "}
            <code>aria-describedby</code> so screen readers read them when the user focuses
            the field:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`<label htmlFor="email">Email</label>
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" role="alert" className="text-red-600">
    {error}
  </p>
)}`}</code></pre>
        </section>

        <section id="focus" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Focus management on client-side navigation
          </h2>
          <p className="mt-3 text-slate-700">
            When a user clicks <code>next/link</code> in the App Router, focus stays where
            it was. On a real document navigation, focus would have moved to the start of
            the page. For screen-reader users this is a disorientation.
          </p>
          <p className="mt-3 text-slate-700">
            Next.js 14+ partially handles this via the <code>focus-visible</code> hints on
            route changes, but for visually-hidden skip links and heading-focus patterns
            you still need manual focus management. A common pattern:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`// app/layout.tsx — skip link that jumps to main content
<body>
  <a href="#main-content" className="sr-only focus:not-sr-only ...">
    Skip to main content
  </a>
  <main id="main-content" tabIndex={-1}>
    {children}
  </main>
</body>

// Page-level components: focus the h1 on mount for SPA navigation
useEffect(() => {
  document.getElementById("page-title")?.focus();
}, [pathname]);`}</code></pre>
        </section>

        <section id="headings" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Heading hierarchy across the App Router tree
          </h2>
          <p className="mt-3 text-slate-700">
            WCAG 2.4.6 requires headings reflect the information hierarchy. A page must
            have exactly one <code>h1</code> and heading levels must not skip (no{" "}
            <code>h1</code> → <code>h3</code>).
          </p>
          <p className="mt-3 text-slate-700">
            The App Router nested layout model makes this tricky. If your root{" "}
            <code>layout.tsx</code> renders a header with an <code>h1</code> (e.g., your
            product name), then your page components should start at <code>h2</code>.
            Worse, nested route segments can accidentally introduce <code>h1</code>s that
            collide with the layout&apos;s.
          </p>
          <p className="mt-3 text-slate-700">
            Rule of thumb: <strong>only the leaf page renders the <code>h1</code></strong>.
            Layouts render <code>h2</code> and below for any visible headings.
          </p>
        </section>

        <section id="dialog" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Dialogs and overlays — the 5 requirements
          </h2>
          <p className="mt-3 text-slate-700">
            Modal dialogs are where most WCAG violations cluster. If you ship a modal, it
            must:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Move keyboard focus <em>into</em> the dialog on open, and back to the trigger on close.</li>
            <li>Trap Tab inside the dialog while it&apos;s open (so users can&apos;t tab out).</li>
            <li>Dismiss on <kbd>Escape</kbd> key.</li>
            <li>Have <code>role=&quot;dialog&quot;</code> and <code>aria-modal=&quot;true&quot;</code> (or use the native <code>&lt;dialog&gt;</code> element).</li>
            <li>Have a visible accessible name (<code>aria-labelledby</code> pointing to a heading inside the dialog).</li>
          </ol>
          <p className="mt-3 text-slate-700">
            The native <code>&lt;dialog&gt;</code> element handles focus trap and Escape
            automatically. Use it unless you have a reason not to — most component libraries
            still hand-roll this and get it wrong.
          </p>
        </section>

        <section id="ci" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            CI setup — block regressions in every PR
          </h2>
          <p className="mt-3 text-slate-700">
            The manual checks above are a one-time cleanup. To keep them clean, put
            axe-core in CI. Drop this into <code>.github/workflows/accessibility.yml</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-snug text-slate-100"><code>{`name: Accessibility
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
          <p className="mt-3 text-slate-700">
            What you get: a sticky PR comment with every violation grouped by severity, a
            downloadable JSON + Markdown report, and a non-zero exit code when violations
            cross the <code>fail-on</code> threshold — which blocks merge if you require
            the check.
          </p>
          <p className="mt-3 text-slate-700">
            This is the same pipeline we use on axle&apos;s own Next.js marketing site.
            If our own PR regresses accessibility, our own build fails first.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <a
              href="https://www.npmjs.com/package/axle-vercel-plugin"
              target="_blank"
              rel="noopener"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Vercel plugin →
            </a>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← Back to axle
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Updated: 21 April 2026. Covers Next.js 14–16. App Router patterns shown; Pages
            Router is broadly similar but focus-management timing differs. Feedback
            welcome:{" "}
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

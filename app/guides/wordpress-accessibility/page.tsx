import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WordPress accessibility — WCAG 2.1 AA for themes, plugins, content (2026)",
  description:
    "Practical accessibility for WordPress sites: theme a11y, Gutenberg blocks, alt text at scale, forms via Gravity/WPForms, and the plugin that scans every page for WCAG violations locally.",
  keywords: [
    "WordPress accessibility",
    "WordPress a11y",
    "WCAG WordPress",
    "WordPress WCAG compliance",
    "Gutenberg accessibility",
    "accessibility plugin WordPress",
    "EAA WordPress",
    "axle",
  ],
  openGraph: {
    title: "WordPress accessibility — a practical WCAG 2.1 AA guide",
    description:
      "Theme + Gutenberg + plugin practices, alt-text at scale, and a local scanner that works on LocalWP and staging.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/wordpress-accessibility" },
};

export default function WordPressPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          WordPress · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          WordPress accessibility — a practical WCAG 2.1 AA guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          WordPress powers roughly 40% of the public web — and a disproportionate share of
          small-and-medium-business sites hit by EAA 2025, ADA, and Israeli תקנה 35
          enforcement. This guide is the engineering checklist for WP specifically:
          themes, Gutenberg blocks, alt text at scale, forms, and the plugin setup that
          keeps you compliant without a dev team.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#theme">Theme choice matters more than anything</a></li>
            <li><a className="hover:underline" href="#gutenberg">Gutenberg — what blocks get wrong</a></li>
            <li><a className="hover:underline" href="#alt-text">Alt text at scale — Media Library practice</a></li>
            <li><a className="hover:underline" href="#forms">Forms: Gravity, WPForms, Contact Form 7</a></li>
            <li><a className="hover:underline" href="#menus">Menus and focus order</a></li>
            <li><a className="hover:underline" href="#plugins">Plugins that help (and the one that hurts)</a></li>
            <li><a className="hover:underline" href="#scanning">Scanning your WP site — locally and in CI</a></li>
            <li><a className="hover:underline" href="#statement">The statement — WP-specific considerations</a></li>
          </ol>
        </nav>

        <section id="theme" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Theme choice matters more than anything
          </h2>
          <p className="mt-3 text-slate-700">
            A WP site is only as accessible as its theme. The default bundled themes
            (Twenty Twenty-Four, Twenty Twenty-Five) are reasonably accessible — they
            pass axe-core cleanly on a fresh install. Most commercial themes do not.
          </p>
          <p className="mt-3 text-slate-700">
            Common theme-level issues:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Insufficient contrast</strong> on buttons, links in hero sections, and pagination (&quot;light grey on white&quot; aesthetic fails 4.5:1).</li>
            <li><strong>Decorative icons read aloud</strong> — SVGs with no <code>aria-hidden</code> attribute.</li>
            <li><strong>Missing focus styles</strong> — themes that reset <code>:focus</code> without providing an alternative make keyboard navigation invisible.</li>
            <li><strong>Mobile hamburger menus</strong> without proper <code>aria-expanded</code> / focus trap.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            If you&apos;re starting fresh, use a theme from the{" "}
            <a
              href="https://wordpress.org/themes/tags/accessibility-ready/"
              target="_blank"
              rel="noopener"
              className="underline"
            >
              official &quot;accessibility-ready&quot; tag
            </a>
            . If you&apos;re stuck with an existing theme that fails, you can usually fix
            contrast and focus styles via a child theme without replacing the parent.
          </p>
        </section>

        <section id="gutenberg" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Gutenberg — what blocks get wrong
          </h2>
          <p className="mt-3 text-slate-700">
            The WordPress block editor is substantially more accessible than the classic
            editor — but the defaults still let editors ship inaccessible content:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Image block</strong> — the alt field is not required in the UI. Editors routinely upload images without alt text.
            </li>
            <li>
              <strong>Heading block</strong> — editors can pick any H-level, enabling heading-level skips (H1 → H3) that break screen-reader outlines.
            </li>
            <li>
              <strong>Button block</strong> — the text is editable, so &quot;Click here&quot; and &quot;Read more&quot; are common. WCAG 2.4.4 requires link purpose in context.
            </li>
            <li>
              <strong>Cover / Media & Text</strong> — decorative background images can be read as informative; the alt defaults to nothing useful.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            The fix is editor education (not a tech fix). Train content editors to:
            always write alt text, use heading levels sequentially, and write button text
            that makes sense out of context (&quot;Read our pricing&quot; not &quot;Read more&quot;).
          </p>
        </section>

        <section id="alt-text" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Alt text at scale — Media Library practice
          </h2>
          <p className="mt-3 text-slate-700">
            Old WordPress sites accumulate thousands of images in the Media Library
            without alt text. Retrofitting is tedious but one-time. Approach:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Run a scan — identify the top 50-100 images appearing on indexed pages (your scanner tool will list them).</li>
            <li>Alt-text the &quot;informative&quot; ones — images that carry meaning readers would miss without.</li>
            <li>For purely decorative images (dividers, watermarks, background flourishes), set alt text to empty in the Media Library — this removes them from assistive tech.</li>
            <li>Don&apos;t bulk-generate alt text via AI for informative images without review — auto-alt is notorious for &quot;a person&quot; when the content is actually your CEO headshot, and &quot;a screenshot&quot; when it&apos;s a complex diagram.</li>
          </ol>
        </section>

        <section id="forms" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Forms: Gravity, WPForms, Contact Form 7
          </h2>
          <p className="mt-3 text-slate-700">
            Contact-form plugins are the #1 source of WCAG violations on WP sites.
            Accessibility rankings, roughly:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Gravity Forms</strong> — best out-of-box. Labels, descriptions, error messages all programmatically associated by default.</li>
            <li><strong>WPForms</strong> — good for Lite, some weaker patterns in Pro (multi-step forms skip focus).</li>
            <li><strong>Contact Form 7</strong> — default markup is weak. Needs manual fixes: explicit <code>&lt;label&gt;</code>, <code>aria-describedby</code> for errors.</li>
            <li><strong>Formidable Forms</strong> — improves with &quot;Accessibility&quot; option turned on, off by default.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            If a form has a CAPTCHA, make sure it&apos;s accessible: reCAPTCHA v3 is
            invisible so it&apos;s fine; v2 needs an audio-challenge fallback and often
            fails when the user is keyboard-only.
          </p>
        </section>

        <section id="menus" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Menus and focus order</h2>
          <p className="mt-3 text-slate-700">
            Hamburger menus on mobile, mega menus on desktop, and megamenus in particular
            trip up keyboard users. Minimum requirements:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Menu button has <code>aria-expanded</code> reflecting open/closed state.</li>
            <li>When menu opens, focus moves into it; when closed, focus returns to the toggle.</li>
            <li>Escape key closes it.</li>
            <li>Tab order follows visual order.</li>
            <li>Submenu triggers use <code>aria-haspopup=&quot;menu&quot;</code> and <code>aria-expanded</code>.</li>
          </ul>
        </section>

        <section id="plugins" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Plugins that help (and the one that hurts)
          </h2>
          <p className="mt-3 text-slate-700">
            <strong>Helpful:</strong>
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Axle Accessibility Scanner</strong> — runs axe-core in your browser inside WP admin. Free tier unlimited. <Link href="/" className="underline">Project home</Link>.</li>
            <li><strong>WP Accessibility (by Joe Dolson)</strong> — fixes small issues like adding skip links, removing duplicate IDs.</li>
            <li><strong>Sa11y</strong> — in-page auditor visible to editors while they edit.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Hurts (avoid):</strong>
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Accessibility overlay widgets</strong> (UserWay, accessiBe,
              EqualWeb, AudioEye Lite, Equally AI). These inject JavaScript that
              attempts to &quot;fix&quot; accessibility at runtime — they don&apos;t, and
              they cost accessiBe a $1,000,000 FTC settlement in January 2025. WP.org
              doesn&apos;t ban them, but using one does not provide legal defence under
              EAA / ADA / תקנה 35.
            </li>
          </ul>
        </section>

        <section id="scanning" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Scanning your WP site — locally and in CI
          </h2>
          <p className="mt-3 text-slate-700">
            If your WP lives behind a public URL you can point any scanner at it. If
            you&apos;re on LocalWP (<code>*.local</code>), staging behind basic auth, or
            on a VPN-only intranet WP, you need a <em>client-side</em> scanner that
            loads the page in a browser iframe and runs axe-core in the browser.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Axle&apos;s WordPress plugin</strong> does exactly this — Tools → axle
            in WP admin, click Scan Now, axe-core 4.11 runs in your admin browser against
            your chosen URL. Zero external calls for the scan itself. Daily WP-Cron scan
            is optional (uses the hosted scanner, requires a public URL).
          </p>
          <p className="mt-3 text-slate-700">
            For dev teams: if your WP site is built with a block theme and deployed via
            Git, you can also put axle in CI just like any other site — point the scanner
            at your staging URL and fail the build on regressions.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            The statement — WP-specific considerations
          </h2>
          <p className="mt-3 text-slate-700">
            WP themes often render the accessibility statement as a Page. A few checks:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>The statement page itself must be accessible — no PDF-only, no image-of-text.</li>
            <li>Link to it from the footer on every page (not just once).</li>
            <li>Keep the &quot;Last updated&quot; date visible — regulators look for stale statements as a signal of non-compliance.</li>
            <li>For multi-language WP (Polylang, WPML), publish a statement in every language the site serves.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            axle generates a Hebrew statement aligned with Israeli תקנה 35 that you can
            paste straight into a WP Page:{" "}
            <Link href="/statement" className="underline">
              /statement
            </Link>
            .
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/asafamos/axle/tree/main/packages/axle-wordpress"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Get the WP plugin →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Statement generator
            </Link>
            <Link
              href="/alternatives/accessibe"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Why overlays don&apos;t work
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Updated: 21 April 2026. Written for WordPress 6.7+ and modern block themes.
            Legacy theme tuning patterns exist but aren&apos;t covered here. Corrections:{" "}
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

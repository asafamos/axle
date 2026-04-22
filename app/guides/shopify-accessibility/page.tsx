import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shopify accessibility — WCAG 2.1 AA for storefronts, themes, checkout (2026)",
  description:
    "Practical accessibility for Shopify merchants: theme audit, Liquid template patterns, Checkout customisations, product-page compliance, and the regulatory pressure every DTC brand faces under EAA 2025, ADA, and Israeli תקנה 35.",
  keywords: [
    "Shopify accessibility",
    "Shopify WCAG",
    "Shopify a11y",
    "Liquid accessibility",
    "Shopify EAA 2025",
    "Shopify ADA lawsuit",
    "axle",
  ],
  openGraph: {
    title: "Shopify accessibility — a practical WCAG 2.1 AA guide",
    description:
      "What to audit on a Shopify theme, where ADA lawsuits hit hardest, and how to keep the store compliant at scale.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/shopify-accessibility" },
};

export default function ShopifyAccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Shopify · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Shopify accessibility — the practical guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Shopify stores are disproportionately targeted by ADA website-accessibility
          lawsuits in the United States. Of the ~4,000 web accessibility lawsuits filed
          in 2024, e-commerce accounted for more than 70% — and within e-commerce,
          Shopify was the #1 platform by volume. Under EAA 2025 the EU pressure matches.
          This guide walks through the Shopify-specific places to audit, common
          Liquid-template pitfalls, Checkout customisation limits, and how to keep a
          store compliant as the catalogue grows.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#theme">Pick (or audit) an accessible theme</a></li>
            <li><a className="hover:underline" href="#product-pages">Product pages — the single biggest lawsuit surface</a></li>
            <li><a className="hover:underline" href="#checkout">Checkout customisation and its limits</a></li>
            <li><a className="hover:underline" href="#collection">Collection + search pages</a></li>
            <li><a className="hover:underline" href="#apps">Apps are where things break</a></li>
            <li><a className="hover:underline" href="#scanning">Scanning at scale — catalog-wide</a></li>
            <li><a className="hover:underline" href="#statement">Accessibility statement placement</a></li>
          </ol>
        </nav>

        <section id="theme" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Pick (or audit) an accessible theme
          </h2>
          <p className="mt-3 text-slate-700">
            Shopify&apos;s own themes (Dawn, Craft, Sense, Studio) are built with
            accessibility in mind and pass axe-core cleanly on a fresh install. Most
            paid third-party themes from the Shopify Theme Store do not — contrast
            fails, focus-visible resets, and missing ARIA on custom UI are the
            top-three common issues.
          </p>
          <p className="mt-3 text-slate-700">
            Before buying a paid theme, scan the live preview. A clean pass on the demo
            store reduces remediation cost by 80-90%. Don&apos;t trust the theme
            marketing page that says &quot;WCAG compliant&quot; — run axe-core against it.
          </p>
        </section>

        <section id="product-pages" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Product pages — the single biggest lawsuit surface
          </h2>
          <p className="mt-3 text-slate-700">
            Plaintiff&apos;s law firms scan hundreds of product pages in a single
            investigation. The violations that come up most often:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Product images without alt text.</strong> Shopify&apos;s admin lets
              you upload product images without an alt field — so it&apos;s easy to
              accumulate thousands over time. Train your ops / content team to alt-text
              every uploaded image.
            </li>
            <li>
              <strong>Variant selectors that don&apos;t announce state.</strong> Colour
              swatches and size pickers often use <code>&lt;div&gt;</code> with click
              handlers and no <code>role=&quot;radio&quot;</code> / <code>aria-checked</code>. Screen
              readers can&apos;t tell which option is selected.
            </li>
            <li>
              <strong>Low-contrast &quot;SALE&quot; / &quot;SOLD OUT&quot; badges</strong>{" "}
              on top of product photos. Contrast requirements apply to overlaid text too.
            </li>
            <li>
              <strong>Image zoom / lightbox galleries</strong> with no keyboard
              close, no focus trap, no alt text on zoomed images.
            </li>
            <li>
              <strong>&quot;Add to cart&quot; confirmation messages</strong> that only
              appear as a toast — no ARIA live region means screen-reader users
              don&apos;t know the action succeeded.
            </li>
          </ul>
        </section>

        <section id="checkout" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Checkout customisation and its limits
          </h2>
          <p className="mt-3 text-slate-700">
            Shopify&apos;s hosted Checkout (Checkout Extensibility) is maintained by
            Shopify and audited regularly. If you&apos;re on Basic / Shopify / Advanced,
            your checkout inherits Shopify&apos;s accessibility. This is actually a
            compliance advantage — one fewer surface to audit.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Risk points:</strong>
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Checkout UI extensions</strong> you or a partner app install — these
              are your responsibility. Each extension&apos;s UI should be audited
              individually.
            </li>
            <li>
              <strong>Shopify Plus custom checkouts</strong> (pre-extensibility) on legacy
              Liquid checkout.liquid — these are fully your responsibility and often
              accumulate accessibility debt. If you&apos;re still on the old checkout,
              migrate to Checkout Extensibility.
            </li>
            <li>
              <strong>Post-purchase upsell apps</strong> (ReCharge, Bold Upsell, etc.) —
              check each for ARIA and keyboard support before install.
            </li>
          </ul>
        </section>

        <section id="collection" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Collection + search pages
          </h2>
          <p className="mt-3 text-slate-700">
            The category / collection pages are typically auto-generated from the theme
            template. Common failures:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Product tiles without a visible focus state when tabbed.</li>
            <li>Infinite-scroll pagination without ARIA announcement when new items load.</li>
            <li>Faceted filter UIs (price slider, size filters) not keyboard-operable.</li>
            <li>&quot;Quick view&quot; modals that don&apos;t trap focus.</li>
            <li>Empty-state messages not announced via live region.</li>
          </ul>
        </section>

        <section id="apps" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Apps are where things break
          </h2>
          <p className="mt-3 text-slate-700">
            Every app that injects UI into your storefront — reviews widgets, loyalty
            popups, size-guide modals, chat widgets, and (ironically) accessibility
            overlays — is a separate failure surface. Before installing:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Install on a development theme.</li>
            <li>Run axe-core against a page the app modifies.</li>
            <li>If violations appear, ask the app vendor if they&apos;re WCAG compliant; if they say &quot;we use an overlay&quot;, that&apos;s a red flag — not a solution.</li>
            <li>Budget remediation time if you&apos;re going to keep the app anyway.</li>
          </ol>
          <p className="mt-3 text-slate-700">
            Specifically: <strong>do not install accessibility overlay apps</strong>{" "}
            (accessiBe Shopify, UserWay Shopify, EqualWeb Shopify). See{" "}
            <Link href="/why-not-overlay" className="underline">
              Why accessibility overlay widgets don&apos;t work
            </Link>
            .
          </p>
        </section>

        <section id="scanning" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Scanning at scale — catalog-wide
          </h2>
          <p className="mt-3 text-slate-700">
            A single axe-core scan catches ~95% of accessibility issues on the page it
            scans. For a store with thousands of product pages, you need to sample
            intelligently:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Scan one product from each theme template variant (simple product, with-variants, bundle, subscription).</li>
            <li>Scan one collection page, one search results page, one empty search result.</li>
            <li>Scan the cart, mini-cart drawer, and each checkout extension.</li>
            <li>Scan the account area (login, register, order history).</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Once the theme passes across those ~15 representative pages, the rest of the
            catalog tends to inherit the fixes. Add axle to the theme repo&apos;s CI (if
            you manage it via a Git-linked theme workflow) so any template change
            that regresses accessibility fails before ship.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Accessibility statement placement
          </h2>
          <p className="mt-3 text-slate-700">
            Shopify stores typically publish an accessibility statement as a Page (under
            Online Store → Pages) and link to it from the footer. Hebrew / EU-language
            versions can be added as locale-specific Page copies.
          </p>
          <p className="mt-3 text-slate-700">
            axle&apos;s{" "}
            <Link href="/statement" className="underline">
              statement generator
            </Link>{" "}
            produces HTML you can paste directly into a Shopify Page. For EAA compliance
            with multiple EU markets, each localised version should contain the
            appropriate regulatory escalation channel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Scan your store free →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Statement generator
            </Link>
            <Link
              href="/why-not-overlay"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Why overlays don&apos;t work
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Updated: 21 April 2026. Covers Shopify themes on Online Store 2.0 (OS 2.0).
            Pre-OS-2.0 themes follow broadly similar patterns but section / block
            structure differs.{" "}
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

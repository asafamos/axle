import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title:
    "WooCommerce accessibility — fix your store's WCAG / ADA issues",
  description:
    "Is your WooCommerce store accessible? Scan product, cart, and checkout pages for WCAG 2.1 / 2.2 AA and ADA issues with a free axe-core plugin, then get code-level fixes from $19/mo. An inaccessible checkout is both a lawsuit risk and lost revenue.",
  keywords: [
    "woocommerce accessibility",
    "woocommerce ada compliance",
    "woocommerce wcag",
    "accessible woocommerce checkout",
    "ecommerce accessibility",
    "online store accessibility",
    "woocommerce accessibility plugin",
    "axle",
  ],
  openGraph: {
    title: "WooCommerce accessibility — fix your store's WCAG / ADA issues",
    description:
      "Scan WooCommerce product, cart & checkout for WCAG / ADA issues (free plugin), plus $19/mo hosted fixes. No overlay.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/woocommerce-accessibility" },
};

const FAQ = [
  {
    q: "Does a WooCommerce store have to be ADA compliant?",
    a: "In the US, courts treat online stores as 'places of public accommodation' under ADA Title III and apply WCAG 2.1 AA as the standard — e-commerce sites are among the most frequently sued. In the EU, the European Accessibility Act (June 2025) explicitly covers e-commerce. If you sell online, accessibility is a legal requirement, not a nice-to-have.",
  },
  {
    q: "Which WooCommerce pages matter most for accessibility?",
    a: "The purchase path first: product pages (add-to-cart, variation selectors, quantity steppers, image galleries), the cart, and especially checkout (form labels, error messages, payment fields). An inaccessible checkout blocks real customers from buying — so it's both a compliance failure and direct lost revenue. Scan those templates first.",
  },
  {
    q: "Will an accessibility overlay widget fix my WooCommerce store?",
    a: "No. Overlays layer JavaScript over broken markup and don't fix the underlying checkout, forms, or product templates; the FTC fined the largest overlay vendor $1M in 2025, and stores using them still get sued. Fixing the theme and template HTML is the only durable path — which is exactly what this plugin surfaces.",
  },
  {
    q: "Can I make WooCommerce accessible without a developer?",
    a: "Scanning is free and needs no developer — install the plugin and run it. For the fixes, the axle Site plan ($19/mo) generates the code-level change for each violation, so a store owner without a developer can still ship the fix into their theme or child theme.",
  },
];

export default function WooCommerceAccessibilityPage() {
  const siteEnabled = Boolean(process.env.POLAR_PRODUCT_ID_SITE);
  const wpPluginUrl =
    "https://wordpress.org/plugins/asafamos-accessibility-scanner/";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          WooCommerce · accessibility · WCAG 2.2 AA · ADA · EAA 2025
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          WooCommerce accessibility, without the lawsuit
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Your product pages, cart, and checkout are where accessibility bugs
          cost you twice — a blocked customer is both a lost sale and a legal
          risk. Scan your WooCommerce store for WCAG 2.1 / 2.2 AA and ADA issues
          with a free plugin, then fix the source with no overlay widget.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={wpPluginUrl}
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Install the free plugin →
          </a>
          {siteEnabled ? (
            <Link
              href="/pricing"
              className="rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Get hosted fixes — $19/mo →
            </Link>
          ) : null}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Scan your storefront free
          </h2>
          <p className="mt-3 text-slate-700">
            Start with your highest-traffic product page or the checkout. Enter
            the URL and get the full WCAG 2.2 AA report by email.
          </p>
          <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
            <FreeScanForm />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            The WooCommerce flows that get stores sued
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Checkout forms</strong> — unlabeled fields, inaccessible
              error messages, and payment inputs a screen reader can&apos;t
              announce. The single highest-risk page on the site.
            </li>
            <li>
              <strong>Add-to-cart &amp; variation selectors</strong> — custom
              swatches and quantity steppers that aren&apos;t keyboard-operable.
            </li>
            <li>
              <strong>Product galleries &amp; lightboxes</strong> — images with
              no alt text, modals that trap or lose focus.
            </li>
            <li>
              <strong>Faceted filters &amp; search</strong> — AJAX updates that
              never announce results to assistive tech.
            </li>
            <li>
              <strong>Colour contrast</strong> — sale badges, muted prices, and
              theme accents that fall below the 4.5:1 threshold.
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-5">
          <h3 className="font-semibold text-emerald-900">
            Accessibility is conversion work too
          </h3>
          <p className="mt-2 text-sm text-emerald-900">
            Every keyboard user who can&apos;t complete checkout, every
            screen-reader user who can&apos;t select a variation, is a customer
            who leaves. Fixing accessibility widens the funnel — it&apos;s the
            rare compliance task that also lifts revenue.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            WooCommerce accessibility FAQ
          </h2>
          <div className="mt-5 space-y-4">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Protect your store — start with a scan
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={wpPluginUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the free plugin →
            </a>
            {siteEnabled ? (
              <Link
                href="/pricing"
                className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                See axle Site — $19/mo →
              </Link>
            ) : null}
            <Link
              href="/wordpress-accessibility"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              WordPress accessibility guide
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 1 September 2026.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}

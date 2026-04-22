import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Shopify accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · Shopify",
    title: "Shopify accessibility — the practical guide.",
    subtitle:
      "Theme audit, product pages, Checkout Extensibility, app install risks, and catalog-scale scanning.",
    footer: "axle-iota.vercel.app  ·  Online Store 2.0  ·  WCAG 2.1 / 2.2 AA",
  });
}

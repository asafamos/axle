import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "WordPress accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · WordPress",
    title: "WordPress accessibility — the practical guide.",
    subtitle:
      "Themes, Gutenberg, alt text at scale, Gravity / WPForms / CF7 ranking, and a plugin that works on LocalWP.",
    footer: "axle-iota.vercel.app  ·  WP 6.7+  ·  WCAG 2.1 / 2.2 AA",
  });
}

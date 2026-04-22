import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Vue accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · Vue / Nuxt",
    title: "Vue accessibility — the practical guide.",
    subtitle:
      "Component semantics, useId forms, route focus, vitest-axe + Playwright, and CI.",
    footer: "axle-iota.vercel.app  ·  Vue 3.5+ · Nuxt 3.14+  ·  WCAG 2.1 / 2.2 AA",
  });
}

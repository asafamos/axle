import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "React accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · React",
    title: "React accessibility — the practical guide.",
    subtitle:
      "Component semantics, useId forms, focus management, jest-axe + Playwright, and a CI pipeline.",
    footer: "axle-iota.vercel.app  ·  React 18 / 19  ·  WCAG 2.1 / 2.2 AA",
  });
}

import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Angular accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · Angular",
    title: "Angular accessibility — the practical guide.",
    subtitle:
      "CDK a11y primitives, Material patterns, reactive forms, router focus, cypress-axe + Playwright, CI.",
    footer: "axle-iota.vercel.app  ·  Angular 17/18/19  ·  WCAG 2.1 / 2.2 AA",
  });
}

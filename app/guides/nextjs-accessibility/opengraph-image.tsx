import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Next.js accessibility — a practical WCAG 2.1 AA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Stack · Next.js",
    title: "Next.js accessibility — the practical guide.",
    subtitle:
      "App Router specifics, focus management, Image alt text, and a CI pipeline that blocks regressions.",
    footer: "axle-iota.vercel.app  ·  Next 14 / 15 / 16  ·  WCAG 2.1 / 2.2 AA",
  });
}

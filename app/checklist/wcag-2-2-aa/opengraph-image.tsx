import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "WCAG 2.2 AA checklist — 55 success criteria, print-ready";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Free resource · CC-BY",
    title: "WCAG 2.2 AA checklist.",
    subtitle:
      "All 55 Level A + AA success criteria. Plain-English test steps. Print-ready. Always free.",
    footer: "axle-iota.vercel.app  ·  Always updated  ·  Share freely with attribution",
  });
}

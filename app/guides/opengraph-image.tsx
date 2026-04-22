import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "axle — accessibility compliance guides hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Guides · hub",
    title: "Accessibility compliance guides.",
    subtitle:
      "EAA transpositions per country, תקנה 35 for Israel, and stack-specific engineering guides.",
    footer: "axle-iota.vercel.app  ·  8 regions  ·  4 stacks",
  });
}

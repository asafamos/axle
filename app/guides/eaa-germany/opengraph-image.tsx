import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "BFSG compliance for developers — Germany EAA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Germany · BFSG",
    title: "BFSG compliance for developers.",
    subtitle:
      "Fines up to €100,000 per violation. Enforced 28 June 2025. A practical CI-first guide.",
    footer: "axle-iota.vercel.app  ·  WCAG 2.1 AA  ·  EN 301 549  ·  BITV 2.0",
  });
}

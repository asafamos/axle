import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Web accessibility audit — scope, cost, template, deliverables";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Reference · Audit",
    title: "Web accessibility audit — the practical guide.",
    subtitle:
      "Scope, cost ranges, deliverables, VPAT, how pre-scans cut audit hours by 40-60%.",
    footer: "axle-iota.vercel.app  ·  WCAG 2.1 / 2.2 AA  ·  EN 301 549",
  });
}

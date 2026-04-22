import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "I got an ADA demand letter — the first 48 hours";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Emergency · ADA",
    title: "ADA demand letter — the first 48 hours.",
    subtitle:
      "Preserve evidence, scan and inventory, engage counsel, publish a plan. Engineering-side playbook.",
    footer: "axle-iota.vercel.app  ·  ADA Title III  ·  WCAG 2.1 AA",
  });
}

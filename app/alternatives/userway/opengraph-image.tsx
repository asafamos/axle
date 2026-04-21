import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "axle vs UserWay — source-code accessibility fixes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Compare · vs UserWay",
    title: "axle vs UserWay — real fixes, not a widget.",
    subtitle:
      "CI scanning + Claude code-fix diffs + published verified statement URL. $0 free tier.",
    footer: "axle-iota.vercel.app  ·  No overlay widget  ·  EAA 2025 ready",
  });
}

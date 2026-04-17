import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free compliance badge for your site",
  description:
    "Embed a live WCAG 2.1 / 2.2 AA compliance shield on your README or footer. Updates automatically on every axle scan. Free on any tier.",
  openGraph: {
    title: "axle compliance badge",
    description:
      "Prove WCAG compliance with a live, auto-updating shield. Free forever.",
    type: "article",
  },
  alternates: { canonical: "/badge" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

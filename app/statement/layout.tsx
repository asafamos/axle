import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hebrew accessibility statement generator",
  description:
    "מחולל הצהרת נגישות חינם בעברית, תואם תקנות שוויון זכויות לאנשים עם מוגבלות תקנה 35. הכל רץ בדפדפן, ללא הרשמה. Free Hebrew accessibility-statement generator aligned with Israeli equality-of-rights regulation 35. All in-browser, no signup.",
  openGraph: {
    title: "Hebrew accessibility statement — free generator",
    description:
      "Generate a lawyer-ready Hebrew accessibility statement in 60 seconds. תקנה 35-aligned. No signup.",
    type: "article",
  },
  alternates: { canonical: "/statement" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

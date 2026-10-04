import type { Metadata } from "next";

export const metadata: Metadata = {
  // Hebrew-first on purpose: the people who need this (Israeli site owners
  // legally required to publish a statement under regulation 35) search in
  // Hebrew, and the old English title never matched those queries.
  title: "מחולל הצהרת נגישות חינם לאתר (תקנה 35)",
  description:
    "מחולל הצהרת נגישות חינם בעברית לאתר שלך, לפי תקנה 35. ממלאים פרטים ומקבלים הצהרה מוכנה להדבקה, תוך דקה, בלי הרשמה. הכל רץ בדפדפן. Free Hebrew accessibility-statement generator for Israeli sites (regulation 35).",
  keywords: [
    "הצהרת נגישות",
    "מחולל הצהרת נגישות",
    "הצהרת נגישות לאתר",
    "הצהרת נגישות חינם",
    "תקנה 35",
    "נגישות אתרים",
    "הצהרת נגישות וורדפרס",
    "Hebrew accessibility statement generator",
  ],
  openGraph: {
    title: "מחולל הצהרת נגישות חינם לאתר — תקנה 35",
    description:
      "הצהרת נגישות מוכנה בעברית תוך דקה, בלי הרשמה. Free Hebrew accessibility statement, regulation 35.",
    type: "article",
    locale: "he_IL",
  },
  alternates: { canonical: "/statement" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

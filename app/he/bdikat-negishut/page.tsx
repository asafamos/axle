import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../../free-scan/form";

export const metadata: Metadata = {
  title: "בדיקת נגישות לאתר חינם — דוח WCAG תוך 20 שניות",
  description:
    "בדיקת נגישות חינם לכל אתר: מכניסים כתובת ומקבלים דוח לפי WCAG 2.2 AA, עם הבעיות לפי חומרה והסבר לכל אחת. בלי הרשמה, בדפדפן אמיתי עם axe-core. מתאים גם לאתרי וורדפרס וחנויות וו-קומרס.",
  keywords: [
    "בדיקת נגישות לאתר",
    "בדיקת נגישות אתר",
    "בדיקת נגישות חינם",
    "בדיקת נגישות אתר חינם",
    "בדיקת נגישות וורדפרס",
    "נגישות אתרים",
    "WCAG",
    "axe-core",
    "הצהרת נגישות",
    "axle",
  ],
  openGraph: {
    title: "בדיקת נגישות לאתר חינם — דוח WCAG תוך 20 שניות",
    description:
      "מכניסים כתובת אתר ומקבלים דוח נגישות לפי WCAG 2.2 AA, עם הבעיות לפי חומרה. בלי הרשמה.",
    type: "website",
    locale: "he_IL",
  },
  alternates: { canonical: "/he/bdikat-negishut" },
};

const FAQ = [
  {
    q: "איך בודקים אם אתר נגיש?",
    a: "מכניסים את כתובת האתר בטופס שלמעלה. הבדיקה טוענת את הדף בדפדפן אמיתי, מריצה את מנוע axe-core ומחזירה את הבעיות שנמצאו לפי חומרה (קריטי, חמור, בינוני, קל), עם קישור להסבר המלא על כל כלל. אותה בדיקה אפשר להריץ אחר כך בכל פעם שהאתר משתנה.",
  },
  {
    q: "האם בדיקה אוטומטית מספיקה?",
    a: "לא לבד. בדיקות אוטומטיות, כולל axe-core, תופסות בערך 57% מבעיות WCAG, למשל ניגודיות צבעים, תוויות חסרות, טקסט חלופי חסר וסדר כותרות. בעיות כמו האם הטקסט החלופי באמת מתאר את התמונה או האם הניווט הגיוני לקורא מסך דורשות בדיקה אנושית. הבדיקה כאן היא שלב ראשון מהיר וזול, לא תחליף לבדיקה מקצועית.",
  },
  {
    q: "מה נשמר כשאני מזין כתובת ואימייל?",
    a: "נשמרים כתובת האימייל וכתובת האתר שנבדק, כדי לשלוח לך את הדוח. לא מוכרים ולא משתפים את האימייל. פרטים במדיניות הפרטיות. הדוח עצמו מוצג בדף מיד, ועותק נשלח אליך במייל.",
  },
  {
    q: "מה ההבדל בין תוסף \"כפתור נגישות\" לבין תיקון אמיתי?",
    a: "תוספי כפתור (overlay) מוסיפים שכבת JavaScript מעל האתר ולא מתקנים את הקוד שמתחתיה, ולכן הבעיות עצמן נשארות. תיקון אמיתי נעשה במקור: בתבנית, בתוכן ובקוד. הבדיקה כאן מראה מה לתקן, והיא לא מוסיפה שום דבר לאתר שלך.",
  },
];

export default function BdikatNegishutPage() {
  const siteEnabled = Boolean(process.env.POLAR_PRODUCT_ID_SITE);
  const wpPluginUrl =
    "https://wordpress.org/plugins/asafamos-accessibility-scanner/";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "he",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main dir="rtl" lang="he" className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          בדיקת נגישות · WCAG 2.2 AA · חינם
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          בדיקת נגישות לאתר: חינם, תוך 20 שניות
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          מכניסים כתובת אתר ומקבלים דוח נגישות לפי תקן WCAG 2.2 AA: הבעיות
          מסודרות לפי חומרה, עם קישור להסבר על כל אחת. הבדיקה רצה בדפדפן אמיתי
          עם axe-core, מנוע שבו משתמשים גם כלים מקצועיים. בלי הרשמה.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <FreeScanForm locale="he" source="free-scan-he" />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            מה הבדיקה בודקת
          </h2>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-slate-700">
            <li>ניגודיות צבעים בין טקסט לרקע</li>
            <li>תוויות לשדות בטפסים</li>
            <li>טקסט חלופי לתמונות (קיום, לא איכות)</li>
            <li>סדר כותרות ומבנה הדף (landmarks)</li>
            <li>שימוש נכון ב-ARIA</li>
            <li>היכולת לנווט במקלדת ולראות פוקוס</li>
            <li>שפת הדף וכותרת הדף</li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border-s-4 border-amber-400 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            מה בדיקה אוטומטית לא תופסת
          </h3>
          <p className="mt-2 text-sm text-amber-900">
            כ-43% מבעיות הנגישות דורשות שיקול דעת אנושי: האם הטקסט החלופי באמת
            מתאר את התמונה, האם הניווט הגיוני בקורא מסך, האם הטפסים ברורים. אחרי
            שהבדיקה האוטומטית נקייה, מומלצת גם בדיקה אנושית. זו בדיקה אוטומטית
            בלבד, ואינה ייעוץ משפטי או אישור תאימות.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            ואחרי הבדיקה?
          </h2>
          <ul className="mt-3 list-disc space-y-3 ps-6 text-slate-700">
            <li>
              <strong>הצהרת נגישות.</strong> אתר שנותן שירות לציבור בישראל אמור
              לכלול הצהרת נגישות. יש לנו{" "}
              <Link
                href="/statement?utm_source=he-scan-page"
                className="underline"
              >
                מחולל חינמי בעברית
              </Link>{" "}
              שמכין טיוטה לבדיקת יועץ משפטי. כדאי לוודא מול יועץ מה חל עליכם.
            </li>
            <li>
              <strong>אתר וורדפרס?</strong> אפשר להריץ את הבדיקה ישירות מתוך
              לוח הבקרה עם{" "}
              <a
                href={wpPluginUrl}
                target="_blank"
                rel="noopener"
                className="underline"
              >
                התוסף החינמי
              </a>
              {siteEnabled ? (
                <>
                  , ולקבל תיקון בקוד לכל בעיה במסלול{" "}
                  <Link
                    href="/pricing?utm_source=he-scan-page"
                    className="underline"
                  >
                    Site ($19 לחודש)
                  </Link>
                  , בלי מפתח משלכם
                </>
              ) : null}
              .
            </li>
            <li>
              <strong>מדריך תקנה 35.</strong> סקירה של מה שצריך לדעת:{" "}
              <Link href="/he/takana-35" className="underline">
                מדריך תקנה 35 לנגישות אתרים
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            שאלות נפוצות
          </h2>
          <div className="mt-5 space-y-4">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
          עודכן: אוקטובר 2026.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "תקנה 35 נגישות אתרים — מדריך מעשי למפתחים (2026)",
  description:
    "תקנה 35 (שוויון זכויות לאנשים עם מוגבלות — התאמות נגישות לשירות) מחייבת כל אתר ישראלי לעמוד ב-WCAG 2.1/2.2 AA. מדריך טכני: מה חובה, איך לבדוק, ואיך לייצר הצהרה תקנית — בלי ווידג׳טי overlay.",
  keywords: [
    "תקנה 35",
    "נגישות אתרים",
    "הצהרת נגישות",
    "WCAG",
    "נגישות ישראל",
    "EAA 2025",
    "accessiBe",
    "axle",
  ],
  openGraph: {
    title: "תקנה 35 נגישות אתרים — מדריך מעשי למפתחים",
    description:
      "מה חובה ב-2026, איך לבדוק אוטומטית בכל PR, ואיך לייצר הצהרת נגישות עם URL מאומת לעורך הדין שלך.",
    type: "article",
    locale: "he_IL",
  },
  alternates: { canonical: "/he/takana-35" },
};

export default function TakanaPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          ישראל · מדריך compliance
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          תקנה 35 נגישות אתרים — מדריך מעשי למפתחים (2026)
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          אם לחברה שלך יש אתר אינטרנט שמשרת את הציבור בישראל — תקנה 35 חלה עליכם,
          נקודה. עודכנה באוקטובר 2024, אכיפתה הורחבה משמעותית ב-2025, ומכתבי
          התראה מגיעים לחברות בכל שבוע. זה המדריך שאני רוצה שחברה היו נותנים לי
          לקרוא לפני שהתחלתי לפתח.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            בעמוד זה
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li>
              <a className="hover:underline" href="#what">
                מה זו תקנה 35 בעברית ברורה
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#who">
                על מי זה חל
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#what-required">
                מה חובה טכנית
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#overlays">
                למה ווידג׳טים &quot;רובוט נגישות&quot; לא עוזרים
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#how">
                איך לעמוד בתקנה — תהליך שעובד
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#statement">
                הצהרת נגישות — מה חובה לכלול
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#axle">
                איך axle עוזר
              </a>
            </li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            מה זו תקנה 35 בעברית ברורה
          </h2>
          <p className="mt-3 text-slate-700">
            תקנה 35 היא חלק מ
            <em>
              תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
              תשע״ג-2013
            </em>{" "}
            — התקנות שיצאו מכוח חוק שוויון זכויות לאנשים עם מוגבלות התשנ״ח-1998.
            פרק ו׳ של התקנות עוסק ב
            <strong>נגישות השירות באינטרנט</strong>, ותקנה 35 ספציפית מפרטת את{" "}
            <strong>חובת ההצהרה</strong>: כל גוף ציבורי או עסקי שנותן שירות
            באינטרנט חייב לפרסם הצהרת נגישות באתר — בעברית, במבנה מחייב, עם פרטי
            רכז נגישות.
          </p>
          <p className="mt-3 text-slate-700">
            העדכון של אוקטובר 2024 הבהיר שהאכיפה רחבה יותר ממה שעסקים הניחו:
            כלל אתרי המסחר, הבנקאות, הבריאות, התיירות, ורוב ה-SaaS הישראליות —
            הכל תחת החובה.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">על מי זה חל</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              כל <strong>גוף ציבורי</strong> (משרדי ממשלה, רשויות מקומיות, חברות
              ממשלתיות).
            </li>
            <li>
              כל <strong>עוסק פרטי שנותן שירות לציבור</strong> באינטרנט — אתרי
              מסחר, דפי נחיתה של שירותים, אפליקציות ווב.
            </li>
            <li>
              עסקים <strong>קטנים מעל 100 אלף ש״ח מחזור</strong> שנתי (סעיף 35(א)).
              מתחת לסף, חלות חובות מצומצמות יותר.
            </li>
            <li>
              <strong>סטארטאפים B2B</strong>: גם אם הלקוחות שלכם הם חברות ולא
              אנשים פרטיים, דף הנחיתה הציבורי עדיין חייב לעמוד בתקנה — שם רואים
              משקיעים, עובדים פוטנציאליים, ועיתונאים.
            </li>
          </ul>
        </section>

        <section id="what-required" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">מה חובה טכנית</h2>
          <p className="mt-3 text-slate-700">
            תקנה 35(ב) קובעת שהאתר חייב לעמוד ב-
            <strong>תקן ישראלי ת״י 5568</strong> (שאגב, עוקב אחרי WCAG 2.1 ברמה
            AA). בפועל, זה אומר:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>טקסט חלופי (alt text)</strong> לכל תמונה אינפורמטיבית.
            </li>
            <li>
              <strong>ניווט במקלדת</strong> — כל פעולה שאפשר לעשות עם עכבר חייבת
              להיות אפשרית עם מקלדת בלבד.
            </li>
            <li>
              <strong>ניגודיות צבעים</strong> של 4.5:1 לטקסט רגיל, 3:1 לטקסט גדול.
            </li>
            <li>
              <strong>כותרות סמנטיות</strong> (h1 → h2 → h3, בלי קפיצות).
            </li>
            <li>
              <strong>תוויות שדות טופס</strong> (label תואם לכל input, לא רק
              placeholder).
            </li>
            <li>
              <strong>תמיכה בקוראי מסך</strong> (NVDA, JAWS, VoiceOver).
            </li>
            <li>
              <strong>ARIA נכון</strong> — וחשוב באותה מידה, אין ARIA שקרי. overlay
              widgets נופלים כאן (ראו למטה).
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            אלה אותן דרישות של WCAG 2.1 AA. תקנה 35 אימצה את התקן הבינלאומי
            במקום להמציא אחד חדש, מה שזה הופך את הכלים הבינלאומיים (axe-core,
            Lighthouse) לישירות רלוונטיים.
          </p>
        </section>

        <section id="overlays" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            למה ווידג׳טים &quot;רובוט נגישות&quot; לא עוזרים
          </h2>
          <p className="mt-3 text-slate-700">
            בינואר 2025 ה-FTC הגיעה להסדר של{" "}
            <strong>1 מיליון דולר</strong> עם accessiBe — החברה שמוכרת את ווידג׳ט
            ה-overlay הכתום-שחור שרואים בהרבה אתרים ישראליים. הטענה: הווידג׳ט
            הולך לתבוע מתחיל שגם לא עוזר וגם לפעמים{" "}
            <strong>מזיק למשתמשי קוראי מסך</strong> (הוא מוסיף תכונות ARIA
            שגויות על HTML שבור).
          </p>
          <p className="mt-3 text-slate-700">
            תקנה 35 לא אוסרת ווידג׳טים, אבל{" "}
            <strong>היא לא רואה בהם תחליף לעמידה בתקן</strong>. אם עורך דין של
            התובע יבדוק את האתר שלך ב-axe-core או ב-WAVE וימצא 30 חריגות WCAG —
            העובדה שיש לך ווידג׳ט לא רלוונטית להגנה.
          </p>
          <p className="mt-3 text-slate-700">
            מחקר Princeton (Van Lee et al., 2023) מצא שמשתמשי NVDA יכולים לחוות
            את חוויית ה-overlay כ
            <em>גרועה יותר</em> מחווית ה-HTML המקורי, כי ה-ARIA שה-overlay מזריק
            מבלבל את קורא המסך.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            איך לעמוד בתקנה — תהליך שעובד
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>סריקה אוטומטית ראשונה</strong>: הריצו את axe-core 4.11 על
              דף הבית + 3-5 דפים מרכזיים. תגלו 30-80 חריגות. 50% מהן פשוטות
              (חסר alt, חסר label). 50% דורשות עבודה.
            </li>
            <li>
              <strong>תיקון בקוד המקור</strong>: עריכה של תבניות React/Vue/WP,
              לא hack על הפלט. זה מה שהתקנה דורשת.
            </li>
            <li>
              <strong>CI במקום סריקה חד-פעמית</strong>: הכניסו את axe-core
              ל-pull request pipeline. חוסם merge על רגרסיות. זה החלק הקריטי —
              בלי אכיפה תמידית, האתר יחזור לחריגות תוך חודש.
            </li>
            <li>
              <strong>ביקורת אנושית</strong>: axe-core תופס בערך 57% מחריגות
              WCAG. את ה-43% הנותרים צריך יועץ נגישות. יועץ טוב לוקח 2-5K ש״ח
              לבדיקה של אתר בינוני.
            </li>
            <li>
              <strong>הצהרת נגישות</strong>: פרסם באתר לפי מבנה תקנה 35. יצור
              אותה בעברית, עם רכז נגישות אמיתי, עם URL קבוע (לא PDF).
            </li>
            <li>
              <strong>תיעוד</strong>: שמור לוג של סריקות לאורך זמן. בתביעה
              פוטנציאלית, המסמך הזה הוא ההגנה שלך — הראיה שאתה מנטר ומתקן.
            </li>
          </ol>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            הצהרת נגישות — מה חובה לכלול
          </h2>
          <p className="mt-3 text-slate-700">
            תקנה 35(ד) מפרטת במדויק מה חייב להופיע בהצהרה:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>שם מלא של העסק + כתובת רשמית + טלפון + אימייל.</li>
            <li>תיאור השירות שניתן באתר.</li>
            <li>
              <strong>פרטי רכז הנגישות</strong>: שם מלא, תפקיד, אימייל, טלפון. זה
              חייב להיות אדם אמיתי, לא &quot;support@&quot;.
            </li>
            <li>התקן שהוחל (ת״י 5568 AA או WCAG 2.1/2.2 AA).</li>
            <li>תאריך הביקורת האחרונה + שם הבודק (פנימי/חיצוני).</li>
            <li>רשימה של התאמות שבוצעו באתר.</li>
            <li>
              <strong>רשימה של מגבלות ידועות</strong> (עמודים שעוד לא נגישים
              במלואם, עם תאריך יעד לתיקון). לא חובה, אבל מקטין חשיפה בתביעה.
            </li>
            <li>ערוץ דיווח על בעיות נגישות (מייל, טופס, טלפון).</li>
            <li>תאריך עדכון אחרון של ההצהרה.</li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            אתר כמוכן עם{" "}
            <Link href="/statement" className="font-semibold underline">
              generator של הצהרת נגישות
            </Link>{" "}
            בעברית שתואם בדיוק את המבנה של תקנה 35. חינם, רץ בדפדפן, ללא signup.
          </p>
        </section>

        <section id="axle" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">איך axle עוזר</h2>
          <p className="mt-3 text-slate-700">
            axle הוא הדרך הקצרה ביותר להפעיל את התהליך שבפרק &quot;איך לעמוד
            בתקנה&quot;. במיוחד עבור חברות ישראליות קטנות-בינוניות:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>GitHub Action</strong> שסורק כל PR — 6 שורות YAML, חסימת
              merge על רגרסיות. פתרון ה-CI שתקנה 35 מניחה שיש לכם.
            </li>
            <li>
              <strong>plugin ל-WordPress / Netlify / Cloudflare Pages /
              Vercel</strong>{" "}
              — אם אתם לא על GitHub, תבחרו את צינור הפריסה שלכם.
            </li>
            <li>
              <strong>hebrew statement generator</strong> — עונה בדיוק על דרישות
              תקנה 35(ד). רץ בדפדפן, שום signup.
            </li>
            <li>
              <strong>URL מאומת להצהרה</strong> (Team plan) — במקום להטמיע את
              ההצהרה כ-HTML בתוך האתר שלכם, מפרסמים ב-
              <code className="mx-1 rounded bg-slate-100 px-1 text-xs">
                axle-iota.vercel.app/s/&lt;id&gt;
              </code>{" "}
              ומקשרים מה-footer. tamper-evident, עם חותמת זמן. עורך דין של תובע
              יכול לוודא שההצהרה לא שונתה.
            </li>
            <li>
              <strong>תיעוד אוטומטי</strong> — כל סריקה נשמרת ב-dashboard, טריל
              היסטורי להגנה משפטית.
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/statement"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              ייצור הצהרת נגישות חינם
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              התקן GitHub Action
            </a>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← עמוד הבית
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>הצהרת אחריות:</strong> המדריך הזה נכתב להבהרה טכנית
            למפתחים. הוא <em>אינו</em> ייעוץ משפטי ואינו מחליף יועץ נגישות
            מוסמך. במקרה של חשיפה משפטית קונקרטית, פנו לעורך דין מתמחה בדיני
            נגישות.
          </p>
          <p className="mt-3">
            עודכן: 20 באפריל 2026. מתעדכן כשחקיקה משתנה. תגובה על טעויות עובדתיות:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

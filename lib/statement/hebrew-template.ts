/**
 * Hebrew accessibility statement template, aligned with Israeli regulation
 * תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013,
 * פרק ו' (נגישות השירות באינטרנט), תקנה 35 (הצהרת נגישות).
 *
 * This generator produces a draft suitable for legal review. It is NOT a
 * compliance certificate. The organisation is responsible for the accuracy
 * of the data and for the actual accessibility of the site.
 */

export type StatementInput = {
  // Organisation
  organisationName: string;
  organisationLegalName: string;
  organisationAddress: string;
  websiteUrl: string;
  serviceDescription: string;

  // Accessibility coordinator (רכז נגישות)
  coordinatorName: string;
  coordinatorRole: string;
  coordinatorEmail: string;
  coordinatorPhone: string;

  // Technical
  platform: string;
  standard: StandardKey;
  lastAuditDate: string; // ISO yyyy-mm-dd
  auditor: string;
  auditorIsExternal: boolean;

  // Content
  adjustments: string[]; // list of implemented accessibility features
  limitations: string[]; // list of known gaps / exceptions

  // Reporting
  reportingEmail: string;
  reportingPhone?: string;
  reportingFormUrl?: string;

  // Meta
  lastUpdated: string; // ISO yyyy-mm-dd
};

export type StandardKey =
  | "is-5568-aa"
  | "wcag-2-1-aa"
  | "wcag-2-2-aa"
  | "is-5568-aaa";

export const STANDARD_LABELS: Record<StandardKey, string> = {
  "is-5568-aa": "תקן ישראלי ת\"י 5568 ברמה AA",
  "wcag-2-1-aa": "WCAG 2.1 Level AA",
  "wcag-2-2-aa": "WCAG 2.2 Level AA",
  "is-5568-aaa": "תקן ישראלי ת\"י 5568 ברמה AAA",
};

function formatIsraeliDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${Number(d)}.${Number(m)}.${y}`;
}

function bulletList(items: string[]): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "_(לא הוגדרו)_";
  return clean.map((item) => `- ${item}`).join("\n");
}

function reportingChannelsBlock(input: StatementInput): string {
  const lines: string[] = [];
  if (input.reportingEmail) lines.push(`- דואר אלקטרוני: ${input.reportingEmail}`);
  if (input.reportingPhone) lines.push(`- טלפון: ${input.reportingPhone}`);
  if (input.reportingFormUrl)
    lines.push(`- טופס מקוון: ${input.reportingFormUrl}`);
  if (lines.length === 0) return "_(לא הוגדרו ערוצי דיווח)_";
  return lines.join("\n");
}

export function renderHebrewStatementMarkdown(input: StatementInput): string {
  const standard = STANDARD_LABELS[input.standard];
  const auditDate = formatIsraeliDate(input.lastAuditDate);
  const updatedDate = formatIsraeliDate(input.lastUpdated);
  const auditorLine = input.auditorIsExternal
    ? `על ידי גורם חיצוני: **${input.auditor || "(טרם הוגדר)"}**`
    : `בבדיקה עצמית על ידי **${input.auditor || "(טרם הוגדר)"}**`;

  return `# הצהרת נגישות — ${input.organisationName || "[שם הארגון]"}

**${input.organisationLegalName || input.organisationName || "[שם מלא של הגוף המשפטי]"}** מחויבת לאפשר לכל אדם, לרבות אנשים עם מוגבלות, גישה מלאה ושוויונית לאתר ${input.websiteUrl || "[כתובת האתר]"}. הנגישות באתר נבחנה ומתוחזקת בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.

## תיאור השירות

${input.serviceDescription || "[תיאור קצר של השירות והשימושים המרכזיים באתר]"}

## תקן הנגישות החל

האתר נבדק ותוחזק לעמידה ב-**${standard}**. הסקירה האחרונה בוצעה בתאריך **${auditDate || "[תאריך]"}**, ${auditorLine}.

## הפלטפורמה הטכנולוגית

האתר מבוסס על: ${input.platform || "[שם הפלטפורמה / מסגרת העבודה]"}.

## התאמות נגישות שבוצעו

${bulletList(input.adjustments)}

## חריגים והגבלות ידועות

${bulletList(input.limitations)}

החברה פועלת לצמצום החריגים לעיל ולתיקון התקלות הידועות בהקדם האפשרי.

## רכז הנגישות

- **שם:** ${input.coordinatorName || "[שם מלא]"}
- **תפקיד:** ${input.coordinatorRole || "[תפקיד]"}
- **דואר אלקטרוני:** ${input.coordinatorEmail || "[דוא\"ל]"}
- **טלפון:** ${input.coordinatorPhone || "[טלפון]"}

## דיווח על בעיות נגישות

נתקלתם בבעיית נגישות באתר? נשמח לשמוע. אנו מתחייבים לטפל בפנייה ולהשיב בתוך זמן סביר.

${reportingChannelsBlock(input)}

## פרטי יצירת קשר עם הארגון

**${input.organisationName || "[שם הארגון]"}**
${input.organisationAddress || "[כתובת]"}

## עדכון אחרון

${updatedDate || "[תאריך]"}

---

_הצהרה זו נוצרה באמצעות axle — מחולל הצהרות נגישות חינם. הצהרה זו אינה תחליף לייעוץ משפטי או לבדיקת נגישות מקצועית. האחריות על דיוק התוכן ועמידה בדרישות החוק היא של הארגון המפרסם._
`;
}

export function renderHebrewStatementHtml(input: StatementInput): string {
  const md = renderHebrewStatementMarkdown(input);
  const html = markdownToHtml(md);
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<title>הצהרת נגישות — ${escapeHtml(input.organisationName || "")}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { font-family: "Rubik", "Assistant", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 780px; margin: 0 auto; padding: 2.5rem 1.5rem; color: #1f2937; line-height: 1.7; }
  h1 { font-size: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.75rem; margin-top: 0; }
  h2 { font-size: 1.25rem; margin-top: 2rem; color: #111827; }
  ul { padding-inline-start: 1.25rem; }
  li { margin: 0.25rem 0; }
  a { color: #1d4ed8; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 2.5rem 0 1rem; }
  em { color: #6b7280; font-style: normal; font-size: 0.9rem; }
  p { margin: 0.75rem 0; }
  strong { color: #111827; }
</style>
</head>
<body>
${html}
</body>
</html>
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Minimal markdown → HTML converter covering headings, bold, italic,
 *  links, bullet lists, horizontal rules, and paragraphs. Kept small and
 *  dependency-free so the /statement page can render without extra tooling.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length === 0) return;
    const joined = para.join(" ").trim();
    if (joined) out.push(`<p>${inline(joined)}</p>`);
    para = [];
  };

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      closeList();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      flushPara();
      closeList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      flushPara();
      closeList();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line === "---") {
      flushPara();
      closeList();
      out.push("<hr />");
    } else if (line.startsWith("- ")) {
      flushPara();
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else {
      closeList();
      para.push(line);
    }
  }
  flushPara();
  closeList();

  return out.join("\n");
}

function inline(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function defaultStatementInput(): StatementInput {
  const today = new Date().toISOString().slice(0, 10);
  return {
    organisationName: "",
    organisationLegalName: "",
    organisationAddress: "",
    websiteUrl: "",
    serviceDescription: "",
    coordinatorName: "",
    coordinatorRole: "רכז נגישות",
    coordinatorEmail: "",
    coordinatorPhone: "",
    platform: "",
    standard: "wcag-2-1-aa",
    lastAuditDate: today,
    auditor: "",
    auditorIsExternal: false,
    adjustments: [
      "ניווט מלא באמצעות מקלדת",
      "תיוג שדות טפסים בעברית לקוראי מסך",
      "יחסי ניגודיות מינימליים בהתאם לתקן",
    ],
    limitations: [],
    reportingEmail: "",
    reportingPhone: "",
    reportingFormUrl: "",
    lastUpdated: today,
  };
}

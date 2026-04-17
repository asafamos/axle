"use client";

import { useMemo, useState } from "react";
import {
  defaultStatementInput,
  renderHebrewStatementHtml,
  renderHebrewStatementMarkdown,
  STANDARD_LABELS,
  type StandardKey,
  type StatementInput,
} from "@/lib/statement/hebrew-template";

type StringField = Exclude<
  keyof StatementInput,
  "adjustments" | "limitations" | "auditorIsExternal" | "standard"
>;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export default function StatementPage() {
  const [input, setInput] = useState<StatementInput>(() =>
    defaultStatementInput()
  );
  const [copied, setCopied] = useState<null | "md" | "html">(null);

  const markdown = useMemo(
    () => renderHebrewStatementMarkdown(input),
    [input]
  );
  const html = useMemo(() => renderHebrewStatementHtml(input), [input]);
  const previewHtml = useMemo(() => {
    const body = renderHebrewStatementHtml(input).match(
      /<body>([\s\S]*)<\/body>/
    );
    return body?.[1] ?? "";
  }, [input]);

  function update<K extends StringField>(key: K, value: StatementInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function copyToClipboard(text: string, kind: "md" | "html") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safe = (input.organisationName || "accessibility-statement")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\u0590-\u05FF\-_.]/g, "");
    a.download = `${safe}-accessibility-statement.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                מחולל הצהרת נגישות
              </h1>
              <p className="mt-2 text-slate-600">
                הצהרה חוקית בעברית, תואמת תקנות שוויון זכויות לאנשים עם מוגבלות, תקנה 35. חינם, ללא הרשמה, הכל רץ בדפדפן.
              </p>
            </div>
            <a
              href="/"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              ← לסריקת נגישות
            </a>
          </div>
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            הצהרה זו היא טיוטה לבדיקת יועץ משפטי. אינה מהווה אישור תאימות ואינה
            מחליפה בדיקת נגישות מקצועית או רישום רכז נגישות.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Fieldset title="פרטי הארגון">
              <Field label="שם הארגון (מסחרי)">
                <input
                  type="text"
                  value={input.organisationName}
                  onChange={(e) =>
                    update("organisationName", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="שם משפטי מלא" hint="לדוגמה: דוגמה בע״מ">
                <input
                  type="text"
                  value={input.organisationLegalName}
                  onChange={(e) =>
                    update("organisationLegalName", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="כתובת האתר">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={input.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="כתובת פיזית של הארגון">
                <input
                  type="text"
                  value={input.organisationAddress}
                  onChange={(e) =>
                    update("organisationAddress", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="תיאור השירות באתר" hint="משפט או שניים">
                <textarea
                  rows={2}
                  value={input.serviceDescription}
                  onChange={(e) =>
                    update("serviceDescription", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
            </Fieldset>

            <Fieldset title="רכז נגישות">
              <Field label="שם מלא">
                <input
                  type="text"
                  value={input.coordinatorName}
                  onChange={(e) => update("coordinatorName", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="תפקיד">
                <input
                  type="text"
                  value={input.coordinatorRole}
                  onChange={(e) => update("coordinatorRole", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="דואר אלקטרוני">
                <input
                  type="email"
                  value={input.coordinatorEmail}
                  onChange={(e) =>
                    update("coordinatorEmail", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="טלפון">
                <input
                  type="tel"
                  value={input.coordinatorPhone}
                  onChange={(e) =>
                    update("coordinatorPhone", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
            </Fieldset>

            <Fieldset title="הסקר והתקן">
              <Field label="הפלטפורמה הטכנולוגית" hint="Next.js, WordPress, Shopify…">
                <input
                  type="text"
                  value={input.platform}
                  onChange={(e) => update("platform", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="תקן התאמה">
                <select
                  value={input.standard}
                  onChange={(e) =>
                    setInput((p) => ({
                      ...p,
                      standard: e.target.value as StandardKey,
                    }))
                  }
                  className="rounded-md border border-slate-300 bg-white px-3 py-2"
                >
                  {Object.entries(STANDARD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="תאריך בדיקה אחרונה">
                <input
                  type="date"
                  value={input.lastAuditDate}
                  onChange={(e) => update("lastAuditDate", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="מי ביצע את הבדיקה">
                <input
                  type="text"
                  value={input.auditor}
                  onChange={(e) => update("auditor", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={input.auditorIsExternal}
                  onChange={(e) =>
                    setInput((p) => ({
                      ...p,
                      auditorIsExternal: e.target.checked,
                    }))
                  }
                />
                הבדיקה בוצעה על ידי גורם חיצוני
              </label>
            </Fieldset>

            <Fieldset title="התאמות שבוצעו">
              <TextareaList
                value={input.adjustments}
                onChange={(next) =>
                  setInput((p) => ({ ...p, adjustments: next }))
                }
                placeholder={"שורה לכל התאמה. לדוגמה:\nניווט מלא במקלדת\nזום עד 200% ללא אובדן תוכן"}
              />
            </Fieldset>

            <Fieldset title="חריגים והגבלות ידועות">
              <TextareaList
                value={input.limitations}
                onChange={(next) =>
                  setInput((p) => ({ ...p, limitations: next }))
                }
                placeholder={"שורה לכל חריג. לדוגמה:\nעמוד /archive/* טרם עבר התאמה מלאה"}
              />
            </Fieldset>

            <Fieldset title="ערוצי דיווח על בעיות נגישות">
              <Field label="דואר אלקטרוני לדיווח">
                <input
                  type="email"
                  value={input.reportingEmail}
                  onChange={(e) => update("reportingEmail", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="טלפון לדיווח (לא חובה)">
                <input
                  type="tel"
                  value={input.reportingPhone ?? ""}
                  onChange={(e) => update("reportingPhone", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field label="טופס מקוון (לא חובה)">
                <input
                  type="url"
                  value={input.reportingFormUrl ?? ""}
                  onChange={(e) => update("reportingFormUrl", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </Field>
            </Fieldset>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadHtml}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                הורדה כ-HTML
              </button>
              <button
                onClick={() => copyToClipboard(markdown, "md")}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {copied === "md" ? "הועתק!" : "העתקה כ-Markdown"}
              </button>
              <button
                onClick={() => copyToClipboard(html, "html")}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {copied === "html" ? "הועתק!" : "העתקה כ-HTML"}
              </button>
            </div>

            <div
              className="prose prose-slate max-h-[80vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
      <legend className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function TextareaList({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const text = value.join("\n");
  return (
    <textarea
      rows={4}
      value={text}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(
          e.target.value
            .split("\n")
            .map((s) => s)
        )
      }
      className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
    />
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "WCAG 2.2 AA checklist — every success criterion, print-ready (2026)",
  description:
    "The complete WCAG 2.2 Level AA checklist for developers and compliance teams: all 55 Level A + AA success criteria with plain-English test steps. Print-ready, CC-BY, always free.",
  keywords: [
    "WCAG 2.2 checklist",
    "WCAG 2.2 AA success criteria",
    "accessibility checklist PDF",
    "WCAG 2.2 audit",
    "EAA 2025 checklist",
    "axle",
  ],
  openGraph: {
    title: "WCAG 2.2 AA checklist — 55 success criteria, print-ready",
    description:
      "The complete Level A + AA success criteria list with plain-English test steps. Free, always updated.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/checklist/wcag-2-2-aa" },
};

type Criterion = {
  id: string;
  title: string;
  level: "A" | "AA";
  test: string;
};

const CRITERIA: Criterion[] = [
  // 1. Perceivable
  { id: "1.1.1", title: "Non-text Content", level: "A", test: "Every informative image has a text alternative. Decorative images use alt=\"\"." },
  { id: "1.2.1", title: "Audio-only and Video-only (Prerecorded)", level: "A", test: "Prerecorded audio has a transcript. Prerecorded silent video has an audio description or text alternative." },
  { id: "1.2.2", title: "Captions (Prerecorded)", level: "A", test: "Synchronised captions exist for prerecorded video with audio." },
  { id: "1.2.3", title: "Audio Description or Media Alternative (Prerecorded)", level: "A", test: "Audio description or full-text alternative for prerecorded video." },
  { id: "1.2.4", title: "Captions (Live)", level: "AA", test: "Live captions for live audio." },
  { id: "1.2.5", title: "Audio Description (Prerecorded)", level: "AA", test: "Audio description for prerecorded video." },
  { id: "1.3.1", title: "Info and Relationships", level: "A", test: "Structure conveyed visually is also in the markup (headings, lists, tables, form labels)." },
  { id: "1.3.2", title: "Meaningful Sequence", level: "A", test: "Reading order in the DOM matches the visual order." },
  { id: "1.3.3", title: "Sensory Characteristics", level: "A", test: "Instructions don't rely solely on shape, colour, size, or position (\"click the round button\")." },
  { id: "1.3.4", title: "Orientation", level: "AA", test: "Content works in both portrait and landscape unless orientation is essential." },
  { id: "1.3.5", title: "Identify Input Purpose", level: "AA", test: "Form fields for common user info use autocomplete tokens (email, tel, name)." },
  { id: "1.4.1", title: "Use of Color", level: "A", test: "Colour is never the only way to convey information (error states, required fields)." },
  { id: "1.4.2", title: "Audio Control", level: "A", test: "Audio that plays for more than 3 seconds can be paused, stopped, or muted." },
  { id: "1.4.3", title: "Contrast (Minimum)", level: "AA", test: "4.5:1 for body text, 3:1 for large text (≥24px or ≥19px bold)." },
  { id: "1.4.4", title: "Resize Text", level: "AA", test: "Text can be resized 200% without loss of content or function." },
  { id: "1.4.5", title: "Images of Text", level: "AA", test: "Use real text instead of images of text (exceptions: logos, essential visuals)." },
  { id: "1.4.10", title: "Reflow", level: "AA", test: "Content reflows at 320px width without horizontal scrolling (except for images, maps, data tables)." },
  { id: "1.4.11", title: "Non-text Contrast", level: "AA", test: "UI components and meaningful graphics have 3:1 contrast against adjacent colours." },
  { id: "1.4.12", title: "Text Spacing", level: "AA", test: "No loss of content when line-height, paragraph-spacing, letter-spacing, word-spacing are increased." },
  { id: "1.4.13", title: "Content on Hover or Focus", level: "AA", test: "Tooltips and popovers are dismissible, hoverable, persistent (don't disappear on mouse-out if user moves onto them)." },
  // 2. Operable
  { id: "2.1.1", title: "Keyboard", level: "A", test: "All functionality is operable with the keyboard alone." },
  { id: "2.1.2", title: "No Keyboard Trap", level: "A", test: "Keyboard focus never gets stuck in a component." },
  { id: "2.1.4", title: "Character Key Shortcuts", level: "A", test: "Single-key shortcuts (e.g., \"s\" to save) are either off by default or remappable." },
  { id: "2.2.1", title: "Timing Adjustable", level: "A", test: "Time limits are adjustable, extendable, or can be turned off (exceptions for real-time events)." },
  { id: "2.2.2", title: "Pause, Stop, Hide", level: "A", test: "Moving, blinking, auto-updating content can be paused." },
  { id: "2.3.1", title: "Three Flashes or Below Threshold", level: "A", test: "No content flashes more than 3 times per second." },
  { id: "2.4.1", title: "Bypass Blocks", level: "A", test: "Skip-to-content link or landmarks to bypass repeated navigation." },
  { id: "2.4.2", title: "Page Titled", level: "A", test: "Each page has a unique, descriptive <title>." },
  { id: "2.4.3", title: "Focus Order", level: "A", test: "Tab order follows visual and logical reading order." },
  { id: "2.4.4", title: "Link Purpose (In Context)", level: "A", test: "Link text describes destination or is disambiguated by surrounding context." },
  { id: "2.4.5", title: "Multiple Ways", level: "AA", test: "More than one way to reach a page (nav menu + search, or nav + sitemap)." },
  { id: "2.4.6", title: "Headings and Labels", level: "AA", test: "Headings and labels describe topic or purpose." },
  { id: "2.4.7", title: "Focus Visible", level: "AA", test: "Keyboard focus is visually indicated." },
  { id: "2.4.11", title: "Focus Not Obscured (Minimum)", level: "AA", test: "When an element is focused, it is not entirely hidden by author-created content (sticky headers, popovers)." },
  { id: "2.5.1", title: "Pointer Gestures", level: "A", test: "Functionality operable with single-point actions, not only multi-point or path-based gestures." },
  { id: "2.5.2", title: "Pointer Cancellation", level: "A", test: "Down-event doesn't trigger an action, or can be aborted by moving off before release." },
  { id: "2.5.3", title: "Label in Name", level: "A", test: "Visible label text is part of the accessible name (for speech-input users)." },
  { id: "2.5.4", title: "Motion Actuation", level: "A", test: "Features triggered by device motion (shake) have an alternative UI control." },
  { id: "2.5.7", title: "Dragging Movements", level: "AA", test: "Any drag operation has a single-pointer alternative (click-tap sequence)." },
  { id: "2.5.8", title: "Target Size (Minimum)", level: "AA", test: "Pointer targets are at least 24×24 CSS px (exceptions for inline text links)." },
  // 3. Understandable
  { id: "3.1.1", title: "Language of Page", level: "A", test: "<html lang=\"xx\"> declared." },
  { id: "3.1.2", title: "Language of Parts", level: "AA", test: "Passages in a different language are marked with lang attribute." },
  { id: "3.2.1", title: "On Focus", level: "A", test: "Focusing an element doesn't trigger a context change (auto-submit, new window)." },
  { id: "3.2.2", title: "On Input", level: "A", test: "Changing a form value doesn't trigger a context change without warning." },
  { id: "3.2.3", title: "Consistent Navigation", level: "AA", test: "Repeated components appear in the same relative order across pages." },
  { id: "3.2.4", title: "Consistent Identification", level: "AA", test: "Components with the same function are identified consistently (same icon, same label)." },
  { id: "3.2.6", title: "Consistent Help", level: "A", test: "Help mechanisms (support email, contact form, FAQ link) appear in the same relative order across pages." },
  { id: "3.3.1", title: "Error Identification", level: "A", test: "Input errors are identified and described in text." },
  { id: "3.3.2", title: "Labels or Instructions", level: "A", test: "Labels or instructions provided when user input is required." },
  { id: "3.3.3", title: "Error Suggestion", level: "AA", test: "When an error is detected and suggestions are known, suggestions are given." },
  { id: "3.3.4", title: "Error Prevention (Legal, Financial, Data)", level: "AA", test: "For transactions affecting legal / financial / personal data, one of: reversible, checked, or confirmed before submission." },
  { id: "3.3.7", title: "Redundant Entry", level: "A", test: "Information previously entered or supplied is auto-filled or selectable in the same process." },
  { id: "3.3.8", title: "Accessible Authentication (Minimum)", level: "AA", test: "Login doesn't require a cognitive function test (remembering, transcribing) unless alternatives exist." },
  // 4. Robust
  { id: "4.1.2", title: "Name, Role, Value", level: "A", test: "All UI components have programmatically determinable name, role, and value." },
  { id: "4.1.3", title: "Status Messages", level: "AA", test: "Status messages are announced without receiving focus (aria-live regions)." },
];

export default function WcagChecklistPage() {
  const byPrinciple: Record<string, Criterion[]> = {
    "1. Perceivable": CRITERIA.filter((c) => c.id.startsWith("1.")),
    "2. Operable": CRITERIA.filter((c) => c.id.startsWith("2.")),
    "3. Understandable": CRITERIA.filter((c) => c.id.startsWith("3.")),
    "4. Robust": CRITERIA.filter((c) => c.id.startsWith("4.")),
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 print:py-4">
        <header className="mb-8 print:mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Free resource · CC-BY · Always updated
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            WCAG 2.2 Level AA checklist
          </h1>
          <p className="mt-2 text-slate-700">
            All {CRITERIA.length} Level A + AA success criteria, with plain-English test
            steps. <strong>Print-friendly</strong> — use your browser&apos;s print
            dialog (⌘P / Ctrl-P) to save as PDF. Published by{" "}
            <Link href="/" className="underline">axle</Link> · updated 21 April 2026.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <PrintButton />
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate an accessibility statement
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Scan your site free
            </Link>
          </div>
        </header>

        {Object.entries(byPrinciple).map(([principle, items]) => (
          <section key={principle} className="mb-8 print:mb-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900 print:text-lg">
              {principle}{" "}
              <span className="text-sm font-normal text-slate-500">
                ({items.length} criteria)
              </span>
            </h2>
            <table className="w-full border-collapse text-sm">
              <thead className="text-left text-xs uppercase text-slate-500 print:text-[10px]">
                <tr>
                  <th className="border-b border-slate-200 py-2 pr-3">
                    <span className="sr-only">Check</span>☐
                  </th>
                  <th className="border-b border-slate-200 py-2 pr-3">ID</th>
                  <th className="border-b border-slate-200 py-2 pr-3">Criterion</th>
                  <th className="border-b border-slate-200 py-2 pr-3">Level</th>
                  <th className="border-b border-slate-200 py-2">How to test</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="border-b border-slate-100 py-2 pr-3 font-mono text-base">
                      ☐
                    </td>
                    <td className="border-b border-slate-100 py-2 pr-3 font-mono text-xs text-slate-600">
                      {c.id}
                    </td>
                    <td className="border-b border-slate-100 py-2 pr-3 font-medium">
                      {c.title}
                    </td>
                    <td className="border-b border-slate-100 py-2 pr-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          c.level === "A"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        {c.level}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 py-2 text-slate-700">
                      {c.test}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>
            This checklist summarises WCAG 2.2 Level A + AA. It is not a substitute for
            the{" "}
            <a
              href="https://www.w3.org/TR/WCAG22/"
              className="underline"
              target="_blank"
              rel="noopener"
            >
              full W3C specification
            </a>{" "}
            nor for a human audit — axe-core automated scanning catches roughly 57% of
            issues. Published by axle under CC-BY 4.0. Share freely with attribution.
          </p>
          <p className="mt-2">
            Factual corrections welcome:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

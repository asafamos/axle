import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Angular accessibility — WCAG 2.1 AA for Angular 17/18/19 (2026)",
  description:
    "Practical accessibility for Angular: CDK a11y primitives (FocusTrap, LiveAnnouncer, FocusMonitor), Angular Material patterns, reactive forms, router focus management, cypress-axe, and CI. Written for teams targeting EAA 2025 / ADA / תקנה 35.",
  keywords: [
    "Angular accessibility",
    "Angular a11y",
    "Angular CDK a11y",
    "Angular Material accessibility",
    "cypress-axe",
    "Angular WCAG",
    "Angular EAA compliance",
    "axle",
  ],
  openGraph: {
    title: "Angular accessibility — a practical WCAG 2.1 AA guide",
    description:
      "Angular CDK a11y primitives, Material patterns, reactive forms, router focus, cypress-axe, and a CI pipeline.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/angular-accessibility" },
};

export default function AngularAccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Stack · Angular · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Angular accessibility — the practical guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Angular is the enterprise stack where accessibility matters most and is
          often tested least. Fortunately, Angular ships a serious a11y toolkit via
          <code>@angular/cdk/a11y</code> (FocusTrap, LiveAnnouncer, FocusMonitor,
          FocusKeyManager, InteractivityChecker, AriaDescriber). Angular Material
          builds on these primitives and is broadly accessible out of the box. This
          guide covers the Angular-specific patterns for WCAG 2.1 AA — written for
          teams shipping to markets under EAA 2025, ADA, and{" "}
          <Link href="/he/takana-35" className="underline">Israeli תקנה 35</Link>.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#cdk">CDK a11y — the primitives</a></li>
            <li><a className="hover:underline" href="#forms">Reactive forms with explicit labels</a></li>
            <li><a className="hover:underline" href="#router">Focus management on route change</a></li>
            <li><a className="hover:underline" href="#dialogs">Dialogs — FocusTrap and Material Dialog</a></li>
            <li><a className="hover:underline" href="#live">LiveAnnouncer for async state</a></li>
            <li><a className="hover:underline" href="#material">Angular Material — known accessible patterns</a></li>
            <li><a className="hover:underline" href="#testing">Testing with cypress-axe + Playwright</a></li>
            <li><a className="hover:underline" href="#ci">CI pipeline</a></li>
          </ol>
        </nav>

        <section id="cdk" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">CDK a11y — the primitives</h2>
          <p className="mt-3 text-slate-700">
            <code>@angular/cdk/a11y</code> is the Angular team&apos;s official a11y
            toolkit. It&apos;s framework-agnostic in spirit (works with any Angular
            app, not just Material). The four you&apos;ll use most:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>FocusTrap</strong> — restricts keyboard focus to a container. For modals, drawers, menus.</li>
            <li><strong>LiveAnnouncer</strong> — announces a string to screen readers via an <code>aria-live</code> region. For async state.</li>
            <li><strong>FocusMonitor</strong> — detects the origin of focus (mouse / keyboard / touch / program) and exposes it as a CSS modifier. For accurate focus-visible styling.</li>
            <li><strong>FocusKeyManager / ListKeyManager</strong> — implements arrow-key navigation within a list or menu, per APG patterns.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            If you&apos;re rolling a custom interactive pattern (tab list, combobox,
            tree, custom menu), start with the relevant KeyManager — the
            keyboard-interaction matrix from the{" "}
            <a className="underline" href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener">
              ARIA Authoring Practices Guide
            </a>{" "}
            is baked in.
          </p>
        </section>

        <section id="forms" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Reactive forms with explicit labels
          </h2>
          <p className="mt-3 text-slate-700">
            Angular&apos;s reactive forms are accessibility-neutral — you still need
            to wire <code>label</code> / <code>for</code> / <code>aria-describedby</code>{" "}
            manually. The most common mistake is a floating placeholder with no
            <code>label</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// field.component.ts
@Component({
  selector: 'app-field',
  template: \`
    <label [htmlFor]="id">{{ label }}</label>
    <input
      [id]="id"
      [formControl]="control"
      [attr.aria-invalid]="control.invalid && control.touched"
      [attr.aria-describedby]="error ? errorId : null"
    />
    <p *ngIf="error" [id]="errorId" role="alert">{{ error }}</p>
  \`,
})
export class FieldComponent {
  @Input() label!: string
  @Input() control!: FormControl
  @Input() error?: string | null

  private static counter = 0
  readonly id = \`fld-\${++FieldComponent.counter}\`
  readonly errorId = \`\${this.id}-err\`
}`}
          </pre>
          <p className="mt-3 text-slate-700">
            Use a per-component counter or the upcoming <code>@Input()</code>{" "}
            signal-based ID helper. Don&apos;t rely on random numbers — SSR will
            produce hydration mismatches.
          </p>
        </section>

        <section id="router" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Focus management on route change
          </h2>
          <p className="mt-3 text-slate-700">
            Angular Router does not move focus. WCAG 2.4.3 (Focus Order) and screen-
            reader UX both demand that focus move to meaningful content on
            navigation. Wire it in <code>AppComponent</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// app.component.ts
import { Component, inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { filter } from 'rxjs'

@Component({ /* ... */ })
export class AppComponent {
  private router = inject(Router)
  private live = inject(LiveAnnouncer)

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        // Defer so the new route has rendered
        requestAnimationFrame(() => {
          const h1 = document.querySelector<HTMLElement>('h1, [role="main"]')
          if (h1) {
            h1.setAttribute('tabindex', '-1')
            h1.focus({ preventScroll: false })
          }
          const title = document.title
          this.live.announce(\`Navigated to \${title}\`, 'polite')
        })
      })
  }
}`}
          </pre>
          <p className="mt-3 text-slate-700">
            Also update the document title on navigation via the{" "}
            <code>title</code> field on the route config (Angular 14+) — this is
            what screen readers read on navigation in many combinations.
          </p>
        </section>

        <section id="dialogs" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Dialogs — FocusTrap and Material Dialog
          </h2>
          <p className="mt-3 text-slate-700">
            Prefer <code>@angular/material/dialog</code> or the native
            <code>&lt;dialog&gt;</code> element. If you must hand-roll, wrap with{" "}
            <code>cdkTrapFocus</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`<div
  *ngIf="open"
  cdkTrapFocus
  cdkTrapFocusAutoCapture
  role="dialog"
  aria-labelledby="dialog-title"
  aria-modal="true"
>
  <h2 id="dialog-title">{{ title }}</h2>
  <ng-content></ng-content>
  <button (click)="close.emit()">Close</button>
</div>`}
          </pre>
          <p className="mt-3 text-slate-700">
            <code>cdkTrapFocusAutoCapture</code> moves initial focus into the dialog
            when it opens and restores focus to the opener on close. Not doing
            either is the single most common custom-dialog accessibility bug.
          </p>
        </section>

        <section id="live" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            LiveAnnouncer for async state
          </h2>
          <p className="mt-3 text-slate-700">
            Async actions that complete visibly — &ldquo;Saved&rdquo; toasts,
            search-result counts, form-submit success — should announce via
            LiveAnnouncer:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`import { LiveAnnouncer } from '@angular/cdk/a11y'

export class CartService {
  private live = inject(LiveAnnouncer)

  async addToCart(productId: string) {
    await this.api.addToCart(productId)
    this.live.announce(\`Added to cart\`, 'polite')
  }
}`}
          </pre>
          <p className="mt-3 text-slate-700">
            For urgent messages (errors, critical warnings) pass{" "}
            <code>'assertive'</code>. Use sparingly — assertive interrupts the
            user&apos;s current listening context.
          </p>
        </section>

        <section id="material" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Angular Material — known accessible patterns
          </h2>
          <p className="mt-3 text-slate-700">
            Angular Material is one of the more accessibility-conscious component
            libraries. Defaults are broadly correct, but a few gotchas:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>mat-form-field</strong> — requires <code>&lt;mat-label&gt;</code>. Floating placeholder alone does not substitute for a label.</li>
            <li><strong>mat-icon-button</strong> without text — set <code>aria-label</code> or screen readers announce &ldquo;button&rdquo; with no purpose.</li>
            <li><strong>mat-menu</strong> — keyboard and focus are handled; verify that trigger buttons have accessible names.</li>
            <li><strong>mat-tab-group</strong> — uses role=&quot;tablist&quot; correctly; ensure tab panels have descriptive <code>aria-label</code>.</li>
            <li><strong>mat-snack-bar</strong> — announces via LiveAnnouncer automatically; don&apos;t double-announce.</li>
            <li><strong>mat-autocomplete</strong> — correct ARIA combobox pattern; do not wrap in custom containers that break the relationship.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            For non-Material apps, PrimeNG and NGX-Bootstrap have varying
            accessibility quality; audit each component before shipping.
          </p>
        </section>

        <section id="testing" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Testing with cypress-axe + Playwright
          </h2>
          <p className="mt-3 text-slate-700">
            Component / page-level with Cypress and <code>cypress-axe</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// cypress/e2e/home.cy.ts
describe('Home page accessibility', () => {
  it('has no violations', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
  })
})`}
          </pre>
          <p className="mt-3 text-slate-700">
            Playwright + <code>@axe-core/playwright</code> covers anything Cypress
            can&apos;t and matches the engine the axle GitHub Action uses:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// e2e/home.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home page', async ({ page }) => {
  await page.goto('/')
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})`}
          </pre>
        </section>

        <section id="ci" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">CI pipeline</h2>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`name: Accessibility
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: asafamos/axle-action@v1
        with:
          url: \${{ secrets.PREVIEW_URL }}
          fail-on: serious`}
          </pre>
          <p className="mt-3 text-slate-700">
            For enterprise Angular shops on Azure DevOps Pipelines or Bitbucket
            Pipelines, use <code>axle-cli</code> directly:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`npx axle-cli scan https://staging.example.com \\
  --fail-on serious \\
  --json-out axle-report.json \\
  --markdown-out axle-report.md`}
          </pre>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Statement generator
            </Link>
            <Link
              href="/guides"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← All guides
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 22 April 2026. Covers Angular 17/18/19, Material 17+. Not legal
          advice.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          .
        </footer>
      </article>
    </main>
  );
}

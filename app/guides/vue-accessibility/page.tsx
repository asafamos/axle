import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vue accessibility — WCAG 2.1 AA for Vue 3, Nuxt, Pinia (2026)",
  description:
    "Practical accessibility for Vue 3 and Nuxt: single-file-component patterns, template directives, useId, router focus management, vitest-axe + Playwright, and CI. Written for developers targeting EAA 2025 / ADA / תקנה 35.",
  keywords: [
    "Vue accessibility",
    "Vue 3 a11y",
    "Nuxt accessibility",
    "vitest-axe",
    "Vue WCAG",
    "Vue EAA compliance",
    "axle",
  ],
  openGraph: {
    title: "Vue accessibility — a practical WCAG 2.1 AA guide",
    description:
      "How to build accessible Vue 3 + Nuxt applications: semantics, useId, focus management, testing, CI.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/vue-accessibility" },
};

export default function VueAccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Stack · Vue / Nuxt · accessibility engineering
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Vue accessibility — the practical guide
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Vue 3 gives you the primitives for accessible components — scoped slots,
          composables, and the <code>useId</code> composable in 3.5+. Nuxt adds
          file-based routing, which is where most Vue accessibility bugs come from:
          focus doesn&apos;t move, page titles don&apos;t update, and the assistive-tech
          story breaks at route transitions. This guide covers the Vue-specific
          patterns that matter for WCAG 2.1 AA — written for teams shipping to
          markets under EAA 2025, ADA, and <Link href="/he/takana-35" className="underline">Israeli תקנה 35</Link>.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#semantics">Component semantics</a></li>
            <li><a className="hover:underline" href="#forms">Forms with useId</a></li>
            <li><a className="hover:underline" href="#focus">Focus management across routes</a></li>
            <li><a className="hover:underline" href="#dialogs">Dialogs and the &lt;dialog&gt; element</a></li>
            <li><a className="hover:underline" href="#live">Live regions for async state</a></li>
            <li><a className="hover:underline" href="#testing">Testing with vitest-axe + Playwright</a></li>
            <li><a className="hover:underline" href="#nuxt">Nuxt specifics</a></li>
            <li><a className="hover:underline" href="#ci">CI pipeline</a></li>
          </ol>
        </nav>

        <section id="semantics" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Component semantics</h2>
          <p className="mt-3 text-slate-700">
            The cardinal Vue sin: <code>&lt;div @click=&quot;...&quot;&gt;</code> for
            things that should be <code>&lt;button&gt;</code>. Screen readers
            don&apos;t announce <code>div</code>s as interactive, and they aren&apos;t
            keyboard-focusable by default. The fix is almost always the native
            element:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`<!-- Wrong -->
<div class="btn" @click="handle">Submit</div>

<!-- Right -->
<button type="button" class="btn" @click="handle">
  Submit
</button>`}
          </pre>
          <p className="mt-3 text-slate-700">
            When you genuinely need a custom interactive pattern (tab list, combobox,
            disclosure), follow the{" "}
            <a className="underline" href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener">
              ARIA Authoring Practices Guide
            </a>{" "}
            and expose the right roles and state. The <code>headlessui/vue</code>{" "}
            library implements most common patterns correctly; use it rather than
            hand-rolling.
          </p>
        </section>

        <section id="forms" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Forms with useId</h2>
          <p className="mt-3 text-slate-700">
            Vue 3.5 added <code>useId()</code> — use it. Before 3.5 (and in
            component libraries that still target 3.4), a ref-counter composable is
            acceptable but prefer upgrading.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  label: string
  error?: string
}>()
const id = useId()
const errorId = useId()
</script>

<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
    />
    <p v-if="error" :id="errorId" role="alert">{{ error }}</p>
  </div>
</template>`}
          </pre>
          <p className="mt-3 text-slate-700">
            Key points: the <code>&lt;label for&gt;</code> wiring is what lets screen
            readers announce the field name on focus. The{" "}
            <code>aria-describedby</code> wiring is what couples the error message to
            the input. <code>role=&quot;alert&quot;</code> makes the error itself
            announce the moment it renders.
          </p>
        </section>

        <section id="focus" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Focus management across routes
          </h2>
          <p className="mt-3 text-slate-700">
            Vue Router (and Nuxt&apos;s router) does not move focus on navigation.
            Keyboard and screen-reader users are left focused on the previous page&apos;s
            activation point — a WCAG 2.4.3 failure. Fix it globally:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [/* ... */],
})

router.afterEach(() => {
  // Defer to next tick so the new page has mounted
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>('h1, [role="main"]')
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: false })
    }
  })
})

export default router`}
          </pre>
          <p className="mt-3 text-slate-700">
            Combine with updating <code>document.title</code> in the route meta or
            via <code>useHead</code> (Nuxt) / <code>@vueuse/head</code>. Screen readers
            read the title on navigation in many combinations.
          </p>
        </section>

        <section id="dialogs" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Dialogs and the &lt;dialog&gt; element
          </h2>
          <p className="mt-3 text-slate-700">
            The native <code>&lt;dialog&gt;</code> element handles focus trap,
            backdrop, and Escape-to-close for you. Prefer it to a custom <code>role=&quot;dialog&quot;</code>{" "}
            <code>div</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ open: boolean; label: string }>()
const emit = defineEmits<{ close: [] }>()
const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (open) => {
    if (!dialogRef.value) return
    if (open) dialogRef.value.showModal()
    else dialogRef.value.close()
  },
)
</script>

<template>
  <dialog
    ref="dialogRef"
    :aria-label="label"
    @close="emit('close')"
    class="rounded-lg p-6"
  >
    <slot />
  </dialog>
</template>`}
          </pre>
          <p className="mt-3 text-slate-700">
            If you need headless behaviour (custom animation, portal, nested
            dialogs), <code>@headlessui/vue</code>&apos;s <code>Dialog</code> is the
            path of least breakage. Do not hand-roll focus trap — the known-bad
            patterns always bite.
          </p>
        </section>

        <section id="live" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Live regions for async state
          </h2>
          <p className="mt-3 text-slate-700">
            Async operations that complete visibly — &ldquo;Added to cart&rdquo;
            toasts, search-result counts, form-submit success — need to announce to
            screen readers via an ARIA live region.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`<template>
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>`}
          </pre>
          <p className="mt-3 text-slate-700">
            For urgent updates (errors, time-sensitive warnings) use{" "}
            <code>aria-live=&quot;assertive&quot;</code>. Use it sparingly — assertive
            interrupts whatever the user was listening to.
          </p>
        </section>

        <section id="testing" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Testing with vitest-axe + Playwright
          </h2>
          <p className="mt-3 text-slate-700">
            Component-level with vitest and <code>@vitest-axe/vitest-axe</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// ProductCard.test.ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import { axe, toHaveNoViolations } from 'vitest-axe'
import ProductCard from './ProductCard.vue'

expect.extend({ toHaveNoViolations })

describe('ProductCard', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(ProductCard, {
      props: { name: 'T-shirt', price: 19.99 },
    })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})`}
          </pre>
          <p className="mt-3 text-slate-700">
            Page-level with Playwright and <code>@axe-core/playwright</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
{`// e2e/home.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage is accessible', async ({ page }) => {
  await page.goto('/')
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})`}
          </pre>
        </section>

        <section id="nuxt" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Nuxt specifics</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Page title per route</strong> — use <code>useHead({'{'} title: &apos;...&apos; {'}'})</code>{" "}
              in every page component. Nuxt&apos;s default is the app name only, which
              fails WCAG 2.4.2.
            </li>
            <li>
              <strong>lang on html</strong> — set via <code>useHead({'{'} htmlAttrs: {'{'} lang: &apos;en&apos; {'}'} {'}'})</code> or through the app config in{" "}
              <code>nuxt.config.ts</code>.
            </li>
            <li>
              <strong>Image component</strong> — <code>&lt;NuxtImg&gt;</code> requires{" "}
              <code>alt</code> explicitly. Decorative images: <code>alt=&quot;&quot;</code>. Never omit.
            </li>
            <li>
              <strong>Nuxt Content</strong> — if you render markdown via{" "}
              <code>&lt;ContentDoc&gt;</code>, audit the generated output; heading
              hierarchy from author content often skips levels.
            </li>
            <li>
              <strong>Nuxt UI / Nuxt UI Pro</strong> — the default components are
              broadly accessible; verify before shipping overrides.
            </li>
          </ul>
        </section>

        <section id="ci" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">CI pipeline</h2>
          <p className="mt-3 text-slate-700">
            Drop this in{" "}
            <code>.github/workflows/accessibility.yml</code> to fail PRs on new
            WCAG violations:
          </p>
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
            For a Vercel / Netlify preview flow, install the{" "}
            <code>axle-vercel-plugin</code> or <code>axle-netlify-plugin</code>{" "}
            directly so scans run inside the build.
          </p>

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
          Updated: 22 April 2026. Covers Vue 3.5+ and Nuxt 3.14+. Not legal advice.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
          .
        </footer>
      </article>
    </main>
  );
}

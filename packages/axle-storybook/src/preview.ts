import { addons } from "storybook/preview-api";
import type { Renderer, ProjectAnnotations } from "storybook/internal/types";
import axe from "axe-core";

import { EVENTS, PARAM_KEY } from "./constants";
import type { AxleStorybookParameters, ScanResult } from "./types";

/**
 * Decorator that runs axe-core against the rendered story after each
 * render. We intentionally run AFTER render (not during) so the story's
 * effects + async data fetches have a chance to complete. axe-core's
 * own internal debouncing handles the rest.
 *
 * For per-story config, the user passes `axle` in `parameters`:
 *
 *   export const MyStory = {
 *     parameters: {
 *       axle: {
 *         disable: false,
 *         options: { runOnly: { type: "tag", values: ["wcag2aa"] } },
 *       },
 *     },
 *   };
 */
async function runScan(
  channel: ReturnType<typeof addons.getChannel>,
  params: AxleStorybookParameters,
) {
  if (params.disable) return;
  const target = document.getElementById("storybook-root") || document.body;
  channel.emit(EVENTS.RUNNING);
  try {
    // Defer one tick so the story's render + post-render effects flush.
    await new Promise((r) => requestAnimationFrame(r));
    const results = await axe.run(target, {
      // Default to WCAG 2.x AA tags. axe-core's defaults already match
      // this in 4.11+, but being explicit makes the addon's intent
      // obvious to anyone reading.
      runOnly: params.options?.runOnly ?? {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
      rules: params.options?.rules,
    });
    const payload: ScanResult = {
      url: window.location.href,
      scannedAt: Date.now(),
      violations: results.violations,
      passes: results.passes.length,
      inapplicable: results.inapplicable.length,
    };
    channel.emit(EVENTS.RESULT, payload);
  } catch (err) {
    channel.emit(
      EVENTS.ERROR,
      err instanceof Error ? err.message : String(err),
    );
  }
}

const decorator: ProjectAnnotations<Renderer>["decorators"] = [
  (storyFn, context) => {
    const params = (context.parameters?.[PARAM_KEY] ?? {}) as AxleStorybookParameters;
    const channel = addons.getChannel();
    // Schedule the scan async — return the rendered story immediately
    // so Storybook isn't blocked.
    void runScan(channel, params).catch(() => {});
    return storyFn();
  },
];

const annotations: ProjectAnnotations<Renderer> = {
  decorators: decorator,
  parameters: {
    [PARAM_KEY]: {
      disable: false,
    } satisfies AxleStorybookParameters,
  },
};

export default annotations;

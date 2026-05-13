/**
 * Server-side entrypoint registered by Storybook's `addons` array in
 * .storybook/main.ts. We don't need any preset configuration for this
 * addon — the panel and decorator are wired through manager.tsx and
 * preview.ts respectively, which Storybook auto-discovers because of
 * the `exports` map in package.json.
 *
 * Kept as an empty preset so Storybook resolves `axle-storybook`
 * cleanly when listed in `addons`.
 */
export const managerEntries = [require.resolve("./manager")];
export const previewAnnotations = [require.resolve("./preview")];

export default {};

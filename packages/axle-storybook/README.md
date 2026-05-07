# axle-storybook

Storybook addon — runs **axe-core 4.11** against every story and shows WCAG 2.2 AA violations in a Storybook panel. Same engine as [axle](https://axle-iota.vercel.app)'s GitHub Action and CLI.

## Why use this and not `@storybook/addon-a11y`

Both addons run axe-core, so the engine is identical. The differences:

- `@storybook/addon-a11y` is the official, broadly-compatible addon focused on a panel + a11y testing during dev.
- `axle-storybook` is the same engine **packaged for the same compliance workflow as the axle GitHub Action**. Stories that fail the addon will fail axle CI on PR. The output schema matches the rest of the axle ecosystem (CLI, Vercel/Netlify/Cloudflare plugins, VS Code extension), so you can reason about a single set of rules across surfaces.

If you're already happy with `@storybook/addon-a11y` and don't use axle's CI, stick with it. If you do use axle CI and want consistency between dev (Storybook) and CI, use this.

## Install

```sh
npm install --save-dev axle-storybook
```

Add to `.storybook/main.ts`:

```ts
import type { StorybookConfig } from "@storybook/your-framework";

const config: StorybookConfig = {
  // ...
  addons: [
    "@storybook/addon-essentials",
    "axle-storybook",
  ],
};
export default config;
```

That's all. Open Storybook → switch stories — the **a11y / WCAG** panel will populate.

## Configuration

Per-story or per-component:

```ts
import type { Meta, StoryObj } from "@storybook/react";
import MyButton from "./MyButton";

const meta: Meta<typeof MyButton> = {
  component: MyButton,
  parameters: {
    axle: {
      // disable the addon for this component (e.g., demo of a known
      // failure case)
      disable: false,
      // override axe-core options
      options: {
        runOnly: { type: "tag", values: ["wcag2aa", "wcag22aa"] },
      },
    },
  },
};
export default meta;

export const Primary: StoryObj<typeof MyButton> = {};
```

Globally in `.storybook/preview.ts`:

```ts
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    axle: {
      options: {
        runOnly: { type: "tag", values: ["wcag2aa", "wcag22aa"] },
      },
    },
  },
};
export default preview;
```

## Companion tools

| Surface | Package |
|---|---|
| GitHub Action | `asafamos/axle-action@v1` |
| npm CLI | `axle-cli` |
| Netlify plugin | `axle-netlify-plugin` |
| Cloudflare Pages plugin | `axle-cloudflare-plugin` |
| Vercel plugin | `axle-vercel-plugin` |
| WordPress plugin | "AsafAmos Accessibility Scanner" on WP.org |
| VS Code extension | `axle-a11y` on VS Code Marketplace |
| Web (no install) | [axle-iota.vercel.app](https://axle-iota.vercel.app) |

All of these use the same axe-core 4.11 engine and the same rule set, so violations are consistent across surfaces.

## License

MIT.

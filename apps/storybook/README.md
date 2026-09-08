# UI Storybook and Chromatic

Stories exercise the public component families exported by `packages/ui`, with
composed examples for compound components (menus, dialogs, widgets, tables, and
settings). Storybook uses the Next.js Vite framework so links, images, and App
Router hooks work without a running application.

## Local development

From the repository root:

```sh
pnpm install
pnpm exec turbo run build --filter=@sushiswap/storybook^...
pnpm --filter @sushiswap/storybook dev
```

Storybook runs on port 6007. Rebuild workspace dependencies after changing
`packages/ui`, or run their development/watch scripts alongside Storybook.

## Validation and publishing

```sh
pnpm format
pnpm lint
pnpm --filter @sushiswap/storybook check
pnpm --filter @sushiswap/storybook build
```

The Chromatic workflow runs for changes to stories, UI, shared hooks, telemetry,
Tailwind, and dependency/build configuration. It builds workspace dependencies,
checks story types, then uses the lockfile-pinned Chromatic CLI to build and upload
Storybook. It can also be run with GitHub's workflow dispatch. Local publishing
uses `pnpm --filter @sushiswap/storybook chromatic` with
`CHROMATIC_PROJECT_TOKEN` in the environment.

## Adding coverage

- Add a kebab-case `*.stories.tsx` file under `stories` and use typed CSF stories.
- Include visible open states for portaled components. Use a `play` function when
  a component only opens through its trigger, and assert the resulting content.
- Cover meaningful variants, disabled/loading/empty states, and compound parts
  within the parent example. Utilities and providers are exercised through their
  consuming stories rather than empty standalone canvases.
- Chromatic captures light, dark, and black themes at 390px and 1280px. The footer
  is desktop-only because the component intentionally hides below `sm`.
- Use fixed dates and `withFixedTime` for clock-dependent stories. Timer stories
  wait for the first interval update before taking a snapshot.
- Reset only a story's own storage keys before rendering and restore them during
  cleanup. Keep fixtures local: the image story uses an unoptimized local SVG;
  Onramper covers a failed provider response and Swapped covers a disconnected
  wallet. Live third-party checkout iframe contents, signing, and analytics
  scripts are outside visual component coverage.
- Docs render stories in separate iframes so portals, themes, and clock/storage
  fixtures remain isolated.

The accessibility addon is enabled for inspection. Component accessibility
findings should be addressed in `packages/ui`; visual stories do not suppress
those findings.

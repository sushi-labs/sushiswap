// Tailwind config used ONLY to compile the design-sync stylesheet
// (packages/ui/dist/design-sync.css, wired as cfg.cssEntry).
//
// Why this file exists rather than reusing apps/storybook/tailwind.config.js:
// that config carries no `content` of its own and inherits the shared preset's
// RELATIVE globs ('./components/**', '../../packages/ui/src/**'). Run through
// the tailwindcss CLI those globs resolve to nothing — the scan reports
// "Potential classes: 1" and the output contains the preflight and
// react-datepicker rules but ZERO utilities, so every component ships
// unstyled. Absolute globs fix it (same run: 33,923 candidates, 76 KB of
// utilities). Storybook's own Vite/postcss pipeline resolves them fine, which
// is why the reference build looks correct and only the CLI path breaks.
//
// The content list is the shared preset's own list resolved against
// apps/storybook — deliberately IDENTICAL to what the reference storybook
// scans, so previews and the storybook oracle have the same class vocabulary.
// Note it does NOT include apps/storybook/stories/**: the preset omits it, so
// classes used only inside story files are absent from the reference render
// too. Adding them here would make previews render styling the oracle cannot,
// turning a config choice into a fidelity mismatch.
//
// Paths derive from import.meta.url so the compile works from any cwd and on
// any clone. The preset is imported by repo-relative path because this file
// lives in .design-sync/, whose only node_modules is the converter-deps symlink.

import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharedConfig from '../config/tailwindcss/index.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const storybookDir = join(repoRoot, 'apps/storybook')

export default {
  darkMode: 'class',
  presets: [sharedConfig],
  content: sharedConfig.content.map((glob) => resolve(storybookDir, glob)),
  theme: { extend: {} },
}

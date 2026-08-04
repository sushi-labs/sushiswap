// Patches .design-sync/sb-reference/iframe.html so the compare harness can tell
// that a story has rendered. Idempotent — safe to re-run.
//
// RUN THIS EVERY TIME THE REFERENCE STORYBOOK IS REBUILT:
//   npx storybook build -c apps/storybook/.storybook -o .design-sync/sb-reference
//   node .design-sync/patch-sb-reference.mjs
//
// Why it is needed
// ---------------
// compare.mjs decides a story is ready by waiting for
//   :is(#storybook-root, #root) > :not(style,script,link,meta,template)
// via playwright's waitForSelector, whose default state is 'visible'. Playwright
// resolves that selector to its FIRST match and waits for THAT element to become
// visible.
//
// Every story in this repo is wrapped by the .storybook/preview.tsx decorator in
// <BaseProviders>, which renders three portal mount points around its children:
//
//   <div id="network-check-portal" />   <- FIRST child, always empty
//   {children}
//   <div id="popover-portal" />
//   <div id="footer-portal" />
//
// So the first non-script child is an empty div with height 0 — never 'visible'.
// waitForSelector times out on all 66 stories and compare reports
// `sb-error: no storybook root content` for every one of them, even though the
// stories render perfectly (verified by hand: #storybook-root has 1152 bytes of
// HTML and innerText "Button" with zero page errors).
//
// compare.mjs already anticipates the shape of this problem — its comment notes
// that "CSS-in-JS runtimes often inject <style>/<script> as the first root child
// and waitForSelector locks onto the first match" — but its :not() list only
// excludes style/script/link/meta/template, not an empty layout div. The harness
// is the fidelity oracle and must not be forked, so the fix goes into the local
// reference artifact instead.
//
// Why this is layout-neutral (and so does not distort the oracle)
// -------------------------------------------------------------
// The three divs are always empty and already contribute 0 height in normal
// flow. `position: absolute` removes them from flow — no sibling moves — and the
// 1x1 box makes them 'visible' to playwright. They have no background, border or
// content, so they paint nothing and the screenshots are byte-comparable to an
// unpatched render. Verified: root height for primitives-button--default is 40px
// both with and without the patch.
//
// Portals opened by a story still work: radix/headless portals append their own
// children to document.body or to these mounts, and an absolutely-positioned
// mount does not clip descendants (no overflow:hidden is introduced).

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const iframe = join(here, 'sb-reference', 'iframe.html')

const MARKER = 'ds-sync-portal-visibility'
const STYLE = `<style id="${MARKER}">
/* injected by .design-sync/patch-sb-reference.mjs — see that file for why */
:is(#storybook-root, #root) > #network-check-portal,
:is(#storybook-root, #root) > #popover-portal,
:is(#storybook-root, #root) > #footer-portal {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
}
</style>`

let html = readFileSync(iframe, 'utf8')

if (html.includes(`id="${MARKER}"`)) {
  console.log('sb-reference already patched — nothing to do')
  process.exit(0)
}

if (!html.includes('</head>')) {
  console.error('✗ no </head> in', iframe, '— is this a storybook iframe.html?')
  process.exit(1)
}

html = html.replace('</head>', `${STYLE}\n</head>`)
writeFileSync(iframe, html)
console.log('✓ patched', iframe)

// Bundled into _ds_bundle.js AHEAD of the @sushiswap/ui entry (the converter
// emits cfg.extraEntries before the main entry in .bundle-entry.mjs, and ESM
// evaluates in that order) via cfg.extraEntries.
//
// Why this exists: @sushiswap/ui is Next-coupled — next/image, next/link,
// next/navigation and next/script are imported across avatar, link, table,
// navigation, data-table and the currency components. Next's client modules
// read process.env at MODULE SCOPE (e.g. next/dist/client/image-component.js
// reads process.env.__NEXT_IMAGE_OPTS), so in a plain browser the very first
// require of next/image throws `ReferenceError: process is not defined` while
// the IIFE is still initialising. That aborts the whole bundle before it can
// assign window.SushiswapUi, so EVERY component disappears — not just the
// Next-dependent ones.
//
// The repo's own storybook papers over the same problem with
// `define: { 'process.env': {} }` in .storybook/main.ts; claude.ai/design
// consumes the compiled bundle directly, so the shim has to travel inside it.
//
// Deliberately minimal: define only what Next's module-scope reads touch, and
// never clobber a real `process` if one exists.
const g = globalThis

if (!g.process) g.process = {}
if (!g.process.env) g.process.env = {}
if (typeof g.process.platform !== 'string') g.process.platform = 'browser'
if (typeof g.process.nextTick !== 'function') {
  g.process.nextTick = (fn, ...args) => {
    Promise.resolve().then(() => fn(...args))
  }
}
if (!g.process.version) g.process.version = ''
if (!g.process.versions) g.process.versions = {}

export {}

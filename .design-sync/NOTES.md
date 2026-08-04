# design-sync notes — @sushiswap/ui

Repo-specific gotchas for future syncs. Append as you learn.

## Install / build

- **`pnpm install` fails without `TRADING_VIEW_GH_READ_TOKEN`.** The root `preinstall`
  hook runs `scripts/require-trading-view-gh-read-token.js`, which hard-exits when that
  env var is unset — the install never reaches dependency resolution. For sync purposes
  use `pnpm install --frozen-lockfile --ignore-scripts`; it exits 0 and reports
  `Already up to date` against the committed lockfile. (Never pipe the install through
  `tail` — the pipe masks the exit code and the preinstall failure looks like success.)
- Node/pnpm are pinned: `.nvmrc` = `lts/krypton` (node 24), `packageManager` = `pnpm@10.34.5`.
- pnpm's isolated linker means **`react` is NOT at the repo-root `node_modules`**. Pass
  `--node-modules packages/ui/node_modules` — `react`, `react-dom`, and `@types/react`
  all resolve there.
- DS build is plain `tsc` (`packages/ui/package.json`), emitting `dist/` next to `src/`.
  Build with workspace deps: `pnpm -F "@sushiswap/ui..." build` (the trailing `...` is
  required — `@sushiswap/ui` depends on the `@sushiswap/hooks`, `@sushiswap/telemetry`,
  and `@sushiswap/tailwindcss-config` workspace packages).
- The dist entry `packages/ui/dist/index.js` is a 227-byte barrel of `export *`
  re-exports; that is correct, not a failed build.

## Styling

- `packages/ui/index.css` is **Tailwind source**, not compiled CSS (`@tailwind base;`
  etc. plus `@layer base` token definitions). It is not usable as `cfg.cssEntry`.
  The compiled CSS must come from the storybook build via the converter's
  `[CSS_FROM_STORYBOOK]` scrape.
- Fonts are npm packages shipping real woff2 files:
  `@fontsource-variable/inter` and `@fontsource-variable/orbitron`, imported at the top
  of `index.css`. Tokens `--font-sans` / `--font-orbitron` reference them.

## Providers

- `@sushiswap/ui` exports **`BaseProviders`**, which is what
  `apps/storybook/.storybook/preview.tsx` wraps every story in
  (`<BaseProviders forcedTheme={theme}>`). Theme comes from a storybook toolbar global,
  default `light`. It is a `next-themes` `ThemeProvider` with `attribute="class"`,
  `themes={['light','black','dark']}`, plus three portal divs
  (`#network-check-portal`, `#popover-portal`, `#footer-portal`).
- `cfg.provider` is set to `BaseProviders` with `forcedTheme: "light"` **explicitly**,
  rather than relying on the auto-bundled `.storybook/preview` decorators. The decorator
  bundle *cannot* work here: `preview.tsx` imports `@sushiswap/ui/index.css`, whose
  fontsource `@import`s pull `.woff2` files, and the decorator bundler has no loader for
  them (`! preview decorator bundle failed: No loader is configured for ".woff2" files`).
  Setting `cfg.provider` skips decorator bundling entirely.

## Root causes fixed on the first sync (2026-08-03)

Three independent, all-components-down failures. All three are `[GENERAL]`.

1. **`components: 0` / `exported PascalCase symbols: 0`** — `packages/ui/package.json`
   declares its types entry *only* under `exports['.'].types`; it has no top-level
   `types`/`typings`. The converter's `lib/dts.mjs` resolves the entry `.d.ts` from
   `publishConfig.types || types || typings || 'index.d.ts'`, so it looked for
   `packages/ui/index.d.ts`, didn't find it, never loaded the entry module, and found
   zero exports — even though `findTypesRoot` correctly located the 357-file `dist/`
   tree. No `cfg.*` knob covers this (`grep ASSUMPTION` confirms).
   **Fix:** `.design-sync/overrides/dts.mjs` (declared in `cfg.libOverrides`) adds an
   `exportsTypesEntry()` helper reading `exports['.'].types` and threads it into both
   `findTypesRoot` and `projectFor`. Worth reporting upstream — an `exports`-only types
   declaration is the modern norm.
2. **`ReferenceError: process is not defined` at bundle load** — killed the entire
   bundle before `window.SushiswapUi` was ever assigned, so *all* components vanished.
   `@sushiswap/ui` is Next-coupled (`next/image`, `next/link`, `next/navigation`,
   `next/script`, `next/dynamic` across avatar, link, table, navigation, data-table,
   breadcrumb, currency/*), and `next/dist/client/image-component.js` reads
   `process.env.__NEXT_IMAGE_OPTS` at module scope. The repo's storybook hides this with
   `define: { 'process.env': {} }` in `.storybook/main.ts`; the shipped bundle gets no
   such define, and the converter only defines `process.env.NODE_ENV`. There is no
   `cfg.define`/`cfg.external` key, and `lib/bundle.mjs` is never-fork.
   **Fix:** `.design-sync/ds-runtime-shim.mjs`, wired as the **first**
   `cfg.extraEntries` item so it evaluates before the DS entry (the converter emits
   extraEntries ahead of the main entry in `.bundle-entry.mjs`, and ESM evaluates in
   declaration order). It defines a minimal `globalThis.process` without clobbering a
   real one.
3. **`[CSS_PLACEHOLDER]` / `[CSS_RUNTIME]` — no CSS at all.** `packages/ui/index.css` is
   Tailwind *source*, unusable as `cfg.cssEntry`. The converter's storybook-CSS scrape
   (`lib/css-fallback.mjs`) looks for the largest local `<link rel=stylesheet>` in
   `sb-reference/iframe.html` — but **Storybook 8 + Vite injects its stylesheet from JS**
   (`assets/iframe-*.js` references `assets/preview-*.css`), so there is no `<link>` to
   find. The hashed artifact also can't be used as `cfg.cssEntry` directly: that field is
   bounded to the package dir.
   **Fix:** compile the DS's Tailwind CSS to a stable path under `packages/ui/dist/`
   (gitignored) and point `cfg.cssEntry` at it. Two reproducible commands — **re-run both
   whenever `packages/ui/src` or `index.css` changes**, before the converter:

   ```sh
   sed -e '/@fontsource-variable/d' -e 's#@import "\./#@import "../#' \
     packages/ui/index.css > packages/ui/dist/.ds-input.css
   (cd apps/storybook && npx tailwindcss -c ../../.design-sync/tailwind.config.mjs \
      -i ../../packages/ui/dist/.ds-input.css -o ../../packages/ui/dist/design-sync.css)
   ```

   The `sed` strips the two `@fontsource-variable` imports (their `@font-face` `url()`s
   are relative to the *fontsource* package, so they would dangle from `dist/`) and
   rewrites `./date-picker.css` → `../date-picker.css` for the new depth. Fonts are wired
   separately via `cfg.extraFonts` pointing at the two fontsource `index.css` files, which
   is the converter's designed path.

   **Use `.design-sync/tailwind.config.mjs`, NOT `apps/storybook/tailwind.config.js`.**
   This is the subtlest trap in the whole sync and it fails *silently*: the storybook
   config carries no `content` of its own and inherits the shared preset's **relative**
   globs (`./components/**`, `../../packages/ui/src/**`). Run through the `tailwindcss`
   CLI those globs match nothing — `DEBUG=tailwindcss:*` reports
   `Potential classes: 1` — so the output still contains the preflight, `date-picker.css`
   and the `@layer base` tokens (≈50 KB, looks plausible!) but **zero utilities**, and
   every component ships unstyled while the build and validator both exit 0. Storybook's
   own Vite/postcss pipeline resolves the same globs correctly, which is why the reference
   render looks right and only the CLI path breaks. Absolute globs fix it: the same run
   goes to 33.8k candidates and ≈139 KB.
   `.design-sync/tailwind.config.mjs` derives absolute paths from `import.meta.url` (so
   it is cwd- and clone-independent) and maps the shared preset's own content list through
   `resolve(apps/storybook, glob)` — deliberately the **same** set the reference storybook
   scans. It intentionally does *not* add `apps/storybook/stories/**`: the preset omits it,
   so story-only classes are missing from the reference render too, and adding them would
   let previews style things the oracle cannot — a self-inflicted fidelity mismatch.
   It imports the preset by repo-relative path (`../config/tailwindcss/index.js`) because
   `.design-sync/`'s only `node_modules` is the converter-deps symlink.
   **Sanity check after any CSS recompile** — never trust the byte count alone:
   `grep -c 'inline-flex' packages/ui/dist/design-sync.css` must be > 0.

   Do not use `packages/ui/tailwind.js` either: it sets `prefix: 'ui-'`, but the
   components emit *unprefixed* classes (`inline-flex gap-1`) and the storybook oracle
   renders unprefixed. (`packages/ui/src` contains exactly one stray `ui-items`.)

4. **Every one of the 66 stories reported `sb-error: no storybook root content`** on the
   first `compare.mjs` run — i.e. the *reference* side, not the previews. The stories
   render perfectly by hand (`#storybook-root` has 1152 bytes of HTML and innerText
   "Button", zero page errors). The cause is a genuine interaction between this DS's
   provider and the harness's readiness check: `compare.mjs` waits for
   `:is(#storybook-root, #root) > :not(style,script,link,meta,template)` with playwright's
   `waitForSelector`, whose default state is `visible`, and which resolves to the **first**
   match. `BaseProviders` renders `<div id="network-check-portal" />` as its first child,
   *before* `{children}` — an always-empty div with height 0, so the first match is never
   visible and the wait times out for every story. (`state: 'attached'` matches
   immediately; `state: 'visible'` does not — confirmed directly.)
   **Fix:** `node .design-sync/patch-sb-reference.mjs`, which injects a `<style>` into
   `.design-sync/sb-reference/iframe.html` making the three portal mounts
   `position: absolute; width: 1px; height: 1px`. Layout-neutral — they contribute 0
   height in flow today and paint nothing, and root height for
   `primitives-button--default` is 40px both with and without the patch — so the oracle is
   not distorted. `compare.mjs` is the fidelity oracle and must never be forked, which is
   why this lives in the local reference artifact instead.
   **`sb-reference/` is gitignored and regenerated, so this patch MUST be re-applied
   after every reference rebuild.** Always run the two together:

   ```sh
   npx storybook build -c apps/storybook/.storybook -o "$(git rev-parse --show-toplevel)/.design-sync/sb-reference"
   node .design-sync/patch-sb-reference.mjs
   ```

   The script is idempotent (second run prints "already patched"). Symptom if forgotten:
   100% `sb-error` across all components — that is this, not broken stories.
   Worth reporting upstream: the harness already excludes leading `style`/`script` nodes;
   an empty leading layout div is the same class of problem.

## Known render warns (triaged — an unrecorded warn is NEW, look at it)

- **`[RENDER_THIN] components/primitives/Separator`** — legitimate. Separator *is* a 1px
  hairline; the compare sheet shows it identical on both panels. Not a defect.
- **`[TOKENS_MISSING]` — 4 vars, all expected:**
  - `--radix-navigation-menu-viewport-height`, `--radix-navigation-menu-viewport-width`,
    `--radix-accordion-content-height` — radix sets these at runtime via inline style.
  - `--font-inter` — a genuine **upstream quirk**, not a sync problem, and worth fixing in
    the repo one day. `config/tailwindcss/index.js` maps `fontFamily.sans` to
    `var(--font-inter)`, but nothing in the design system ever defines that variable
    (`packages/ui/index.css` defines `--font-sans` and `--font-orbitron`). Consequence: the
    Tailwind `font-sans` **utility class** resolves to nothing. Text is still Inter because
    `index.css` sets `html, body { font-family: var(--font-sans) }` — verified in a
    rendered preview: computed font-family is `"Inter Variable", …` and
    `document.fonts.check('16px "Inter Variable"')` is true. So fonts ship and render
    correctly; only the explicit `font-sans` class is dead. `.design-sync/conventions.md`
    warns the design agent off it.

## Verification scope on the first sync (2026-08-03)

All 33 storied components graded `match` on every story — 66 stories in the reference
index, plus the 3 extra TextField stories the cap would have dropped.

- **TextField was captured with `--max-stories 9`** (the default cap is 6 and
  `[STORY_CAP]` flagged it). Its 9 stories are genuinely distinct variants
  (Default/Numeric/Percent/Icon/Unit/Adornments/Description/Variants/Sizes). Keep passing
  `--max-stories 9` for TextField, or the tail three ride on verified-by-upload without
  ever having been graded individually.
- **Interaction-driven stories render their closed state on BOTH panels** and are graded
  `match` on that basis, which is faithful but means the product cards show a trigger
  rather than an open overlay: Dialog (4 stories), Popover (2), Tooltip, Explainer. No
  `cfg.overrides.*.skip` was needed and no `[PORTAL?]` fired, because nothing is ever open
  in a static capture. If you later want open-overlay cards, that needs owned previews
  forcing the open state — plus `cardMode: "single"`.
- **Slider's reference panel is clipped, not different.** Storybook screenshots
  `#storybook-root`, whose height collapses to the ~5px track, so the round thumb is cut
  off vertically there while the preview captures the full page. Graded `match` on the
  component; re-confirm from `raw/*__sb.png` if it ever looks suspicious.

## Re-sync risks — what to watch

- **Re-apply the sb-reference patch after every reference rebuild.**
  `node .design-sync/patch-sb-reference.mjs`. Forgetting it presents as 100% `sb-error`.
- **Re-compile the DS stylesheet whenever `packages/ui/src` or `index.css` changes** (the
  two commands in the Styling section) — and then **verify utilities actually landed**:
  `grep -c 'inline-flex' packages/ui/dist/design-sync.css` must be > 0. A CSS with tokens
  but no utilities looks plausible at ~50 KB and ships every component unstyled while
  build and validate both exit 0. Expect ~139 KB / ~1,280 rules.
- **The shipped stylesheet is content-scanned, so it is NOT the full Tailwind universe.**
  It carries what `packages/ui/src` uses (plus most common layout utilities), but arbitrary
  utilities — especially responsive variants — can be missing (verified absent: `p-8`,
  `gap-8`, `md:grid-cols-2`, `lg:px-8`; each breakpoint has only 1–2 media blocks). This
  limits the layout glue the design agent can write, and `conventions.md` tells it so.
  **Deliberately not "fixed" on this run:** adding a safelist would give previews classes
  the reference storybook's own CSS lacks, breaking the lockstep the compare oracle depends
  on and invalidating all 33 grades. Doing it properly means safelist + `--force` full
  re-verify of every component in one run. Decide before broadening.
- **`.design-sync/ds-story-globals.mjs` is a deliberately narrow allow-list.** It re-exports
  exactly `Amount`, `ChainId`, `SUSHI`, `USDT` — the complete set of `sushi` imports across
  `apps/storybook/stories/` and `apps/storybook/components/` as of this sync. A story that
  starts importing anything else from `sushi` or `sushi/evm` gets `undefined` (because
  `cfg.storyImports.shim` routes all `sushi` imports to the global). Symptom: a cell error
  naming the missing symbol. Fix: add the export there.
- **`.design-sync/ds-runtime-shim.mjs` covers what Next 16.2.9 touches at module scope**
  (`process.env`, `platform`, `nextTick`). A Next major bump may read something new; the
  symptom is the whole bundle dying at load with `window.SushiswapUi` undefined, which
  makes *every* component vanish at once. Probe it by loading `_vendor/react.js`,
  `_vendor/react-dom.js` and `_ds_bundle.js` in a page and checking
  `Object.keys(window.SushiswapUi).length` (expect ~244).
- **`.design-sync/overrides/dts.mjs` is a fork** — diff it against the bundled
  `.ds-sync/lib/dts.mjs` on each re-sync and merge upstream changes. It can be deleted
  outright the day `packages/ui/package.json` grows a top-level
  `"types": "./dist/index.d.ts"`, which would be a good upstream fix.
- **Fresh clone setup:** `pnpm install --frozen-lockfile --ignore-scripts`, the `.ds-sync`
  dep install + `playwright@1.61.1`, the sb-reference build + patch, the CSS compile, and
  `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (the dts fork imports bare
  `ts-morph`).
- **Token images in Currency/Button/Card stories load from the network.** They resolved on
  both panels this run (no `[ASSETS_BLOCKED]`), but a sandboxed shell would blank them on
  both sides and grades would falsely pass.

## Toolchain

- Playwright: chromium build **1228** is what this machine has cached, which pins
  **playwright 1.61.1** (1.62.x wants 1234 and would re-download ~170MB). If
  `browserType.launch: Executable doesn't exist` appears, re-check the pin:
  `node -e "console.log(require('.ds-sync/node_modules/playwright-core/browsers.json').browsers.find(b=>b.name==='chromium').revision)"`.
- The `.design-sync/overrides/dts.mjs` fork imports bare `ts-morph`, so a fresh clone
  needs `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (gitignored link,
  committed fork).

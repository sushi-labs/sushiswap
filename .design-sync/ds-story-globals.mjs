// Bundled into _ds_bundle.js via cfg.extraEntries, and paired with
// cfg.storyImports.shim = ["/node_modules/sushi/_esm/"].
//
// The problem: previews compile the story module into their OWN esbuild bundle
// while the components come from the already-built _ds_bundle.js. Any class
// that crosses that boundary gets TWO identities. `packages/ui/dist/components/
// card.js` does `import { unwrapToken } from 'sushi'`, and unwrapToken is a
// chain of `currency instanceof EvmToken` checks — so a token built by the
// story's copy of sushi fails every branch and throws
// `Invariant failed: Unsupported currency type`, taking the whole Card preview
// down (both of its stories construct `new Amount(SUSHI[ChainId.ETHEREUM], 100)`).
// The repo's storybook never sees this because Vite gives it one module graph.
//
// The fix: re-export the handful of sushi symbols the stories actually use from
// HERE. Because this module is bundled into the same IIFE as the DS entry,
// esbuild dedupes it against card.js's own sushi import by absolute path, so
// window.SushiswapUi.SUSHI and card.js's EvmToken come from one class. The
// storyImports.shim pattern then routes the stories' `sushi` / `sushi/evm`
// imports to the global instead of bundling a second copy.
//
// Deliberately narrow — the entire sushi SDK on the DS global would bloat the
// bundle and pollute the namespace the design agent reads. This is the complete
// set of sushi imports across apps/storybook/stories/ and apps/storybook/
// components/ (verified by grep); a story that starts importing something else
// from sushi will see it as `undefined` and needs its symbol added here.
export { Amount, ChainId } from 'sushi'
export { SUSHI, USDT } from 'sushi/evm'

# yoga-wasm-web

[Yoga](https://github.com/facebook/yoga) but in WebAssembly. This is an **opinionated** fork from [pinqy520/yoga-layout-wasm](https://github.com/pinqy520/yoga-layout-wasm) with the following changes:

- Stick to bdc37b07971b645718d2d7400afa19d47056ef0f of Yoga that matches the `yoga-layout-prebuilt` package.
- Fix missing `YGMeasureMode` binding.
- Fix missing `YGUnit` binding.
- Set flag `DYNAMIC_EXECUTION=0` for `emcc` to remove `eval` and `Function` executions.
- Set flag `TEXTDECODER=0`.
- Force the `ENVIRONMENT` to be `web`.
- Add `pre.js` to set `document` as `this`.
- Replace Rollup with esbuild for bundling.
- Remove the asm.js build.
- Enable LTO.
- Enable SIMD128.


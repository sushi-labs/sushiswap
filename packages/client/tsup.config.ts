import { defineConfig } from 'tsup'

export default defineConfig({
  minify: true,
  // target: 'es2022',
  external: ['react', 'swr'],
  sourcemap: true,
  dts: true,
  format: ['esm'],
  // esbuildOptions(options) {
  //   options.banner = {
  //     js: '"use client"',
  //   }
  // },
})

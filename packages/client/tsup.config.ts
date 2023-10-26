import { defineConfig } from 'tsup'

export default defineConfig({
  minify: true,
  target: 'esnext',
  external: ['react', 'swr'],
  sourcemap: true,
  dts: true,
  format: ['esm'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    }
  },
})

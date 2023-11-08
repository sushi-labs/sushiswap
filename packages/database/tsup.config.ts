import { defineConfig } from 'tsup'

export default defineConfig({
  minify: true,
  target: 'esnext',
  external: [],
  sourcemap: true,
  dts: true,
  format: ['esm'],
})

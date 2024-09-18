import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~sushi': join(__dirname, '../src'),
      '~test': join(__dirname, '.'),
    },
    benchmark: {
      outputFile: './bench/report.json',
      reporters: process.env.CI ? ['json'] : ['verbose'],
    },
    coverage: {
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
      exclude: [
        '**/errors/utils.ts',
        '**/_cjs/**',
        '**/_esm/**',
        '**/_types/**',
        '**/*.test.ts',
        '**/test/**',
      ],
    },
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    setupFiles: [join(__dirname, './setup-files.ts')],
    globalSetup: [join(__dirname, './global-setup.ts')],
    testTimeout: 10_000,
  },
})

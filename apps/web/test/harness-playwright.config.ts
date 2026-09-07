import { defineConfig } from '@playwright/test'
import { reporting } from './reporting'

export default defineConfig({
  testDir: './harness',
  testMatch: '*.test.ts',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: { headless: true, trace: 'retain-on-failure' },
  globalSetup: './harness/setup.ts',
  ...reporting('harness'),
})

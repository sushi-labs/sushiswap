import { defineConfig } from '@playwright/test'
import { reporting } from '../reporting'

export default defineConfig({
  testDir: '.',
  testMatch: 'retry-probe.ts',
  workers: 1,
  retries: 1,
  timeout: 30_000,
  globalSetup: './setup.ts',
  ...reporting('retry-probe'),
})

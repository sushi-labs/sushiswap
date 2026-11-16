import { defineConfig } from '@playwright/test'
import config from './playwright.config'
import { reporting } from './reporting'

export default defineConfig({
  ...config,
  ...reporting('perps'),
  globalSetup: undefined,
  testMatch: ['direct-perps.test.ts'],
})

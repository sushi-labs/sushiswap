import { defineConfig } from '@playwright/test'
import config from './playwright.config'

const port = Number(process.env.PORT ?? 3000)

export default defineConfig({
  ...config,
  globalSetup: undefined,
  globalTeardown: undefined,
  testMatch: ['privy.test.ts'],
  use: {
    ...config.use,
    headless: true,
  },
  webServer: [
    {
      command: 'pnpm dev',
      port,
      reuseExistingServer: false,
      timeout: 120_000,
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
      env: {
        NEXT_PUBLIC_APP_ENV: 'test',
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ?? '137',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
})

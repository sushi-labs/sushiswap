import { defineConfig } from '@playwright/test'
import config from './playwright.config'

const port = Number(process.env.PORT ?? 3000)
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

if (!privyAppId) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is required for live Privy tests')
}

export default defineConfig({
  ...config,
  globalSetup: undefined,
  globalTeardown: undefined,
  testMatch: ['privy-live.test.ts'],
  timeout: 240_000,
  retries: process.env.CI ? 1 : 0,
  expect: {
    timeout: 60_000,
  },
  use: {
    ...config.use,
    actionTimeout: 60_000,
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm dev',
      port,
      reuseExistingServer: false,
      timeout: 180_000,
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
      env: {
        NEXT_PUBLIC_APP_ENV: 'test',
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ?? '137',
        NEXT_PUBLIC_PRIVY_APP_ID: privyAppId,
        NEXT_PUBLIC_PRIVY_E2E: 'true',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
})

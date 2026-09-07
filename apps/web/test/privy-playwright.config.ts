import { defineConfig } from '@playwright/test'
import config from './playwright.config'
import { reporting } from './reporting'

const port = Number(process.env.PORT ?? 3000)

export default defineConfig({
  ...config,
  ...reporting('privy'),
  workers: 1,
  fullyParallel: false,
  globalSetup: undefined,
  testMatch: ['privy.test.ts'],
  use: {
    ...config.use,
    headless: true,
  },
  webServer: [
    {
      command: 'pnpm dev',
      url: `http://localhost:${port}/ethereum/swap`,
      reuseExistingServer: false,
      timeout: 120_000,
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
      env: {
        PORT: String(port),
        NEXT_PUBLIC_APP_ENV: 'test',
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ?? '137',
        NEXT_PUBLIC_PRIVY_TEST_RUNTIME: 'true',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
})

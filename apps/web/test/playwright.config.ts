import nextEnv from '@next/env'
import { defineConfig, devices } from '@playwright/test'
import { reporting } from './reporting'

nextEnv.loadEnvConfig(process.cwd(), false)

const port = Number(process.env.PORT ?? 3000)

export default defineConfig({
  testDir: '.',
  testMatch: ['pool.test.ts', 'simple.test.ts', 'failure.test.ts'],
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // Validated with isolation probes and ten retry-free runs per configuration.
  workers: Number(process.env.E2E_WORKERS ?? 2),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  maxFailures: 0,
  ...reporting('fork'),
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    colorScheme: 'dark',
    serviceWorkers: 'block',
  },
  globalSetup: './global.setup.ts',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm start',
    url: `http://localhost:${port}/polygon/swap`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
    env: {
      PORT: String(port),
      NEXT_PUBLIC_APP_ENV: 'test',
      NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ?? '137',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
})

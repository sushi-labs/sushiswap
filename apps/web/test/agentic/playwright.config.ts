import nextEnv from '@next/env'
import { defineConfig, devices } from '@playwright/test'
import { TESTED_CHAINS } from './tested-chains'

nextEnv.loadEnvConfig(process.cwd(), false)

const appPort = Number(process.env.PORT ?? 3000)
const browserRpcPort = Number(process.env.AGENTIC_BROWSER_RPC_PORT ?? 9545)
const swapApiPort = Number(process.env.AGENTIC_SWAP_API_PORT ?? 9650)

export default defineConfig({
  expect: { timeout: 60_000 },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  outputDir: 'test-results/agentic',
  projects: TESTED_CHAINS.map((chain) => ({
    metadata: { chainId: chain.chainId },
    name: chain.slug,
    use: { ...devices['Desktop Chrome'] },
  })),
  reporter: process.env.CI
    ? [['github'], ['json', { outputFile: 'test-results/agentic/report.json' }]]
    : [['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  timeout: 180_000,
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    colorScheme: 'dark',
    headless: Boolean(process.env.CI),
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: { height: 720, width: 1280 },
  },
  webServer: {
    command: 'pnpm start',
    env: {
      ...process.env,
      NEXT_PUBLIC_AGENTIC_TEST: 'true',
      NEXT_PUBLIC_ANVIL_PORT: String(browserRpcPort),
      NEXT_PUBLIC_API_BASE_URL: `http://127.0.0.1:${swapApiPort}`,
      NEXT_PUBLIC_APP_ENV: 'test',
      NEXT_PUBLIC_CHAIN_ID: '1',
      NODE_ENV: 'test',
    },
    port: appPort,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  workers: 1,
})

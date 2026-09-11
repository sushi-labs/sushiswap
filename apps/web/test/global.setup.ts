import { startProxy } from '@viem/anvil'
import { assertAnvilVersion } from './anvil'
import { getAnvilPort, getForkOptions } from './constants'

export default async function globalSetup(): Promise<() => Promise<void>> {
  assertAnvilVersion()
  const shutdown = await startProxy({
    host: '127.0.0.1',
    port: getAnvilPort(),
    options: { ...getForkOptions(), startTimeout: 120_000 },
  })
  // Playwright calls the returned teardown on success and failure.
  return shutdown
}

import { test as base } from 'next/experimental/testmode/playwright.js'
import type { EvmToken } from 'sushi/evm'
import { installApiMocks } from './api-mocks'
import { chainId, getAnvilPort } from './constants'
import { createERC20 } from './erc20'
import { type ForkClient, createForkClient, stopFork } from './fork'
import { NetworkMocks } from './intercept-anvil'

export type Fork = { url: string; client: ForkClient; token: EvmToken }

export const test = base.extend<
  {
    fork: Fork
    mocks: NetworkMocks
  },
  { workerFork: Fork }
>({
  workerFork: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright requires a destructured fixture dependency argument.
    async ({}, use, workerInfo) => {
      // workerIndex changes on retries, unlike parallelIndex. Proxy IDs are numeric.
      const url = `http://127.0.0.1:${getAnvilPort()}/${workerInfo.workerIndex}`
      const client = createForkClient(url)
      try {
        const actualChain = await client.getChainId()
        if (actualChain !== chainId)
          throw new Error('Fork RPC returned the wrong chain')
        const token = await createERC20(client)
        await use({ url, client, token })
      } finally {
        await stopFork(url)
      }
    },
    { scope: 'worker', timeout: 120_000 },
  ],
  fork: async ({ workerFork }, use) => {
    // A fresh snapshot for each test; evm_revert consumes the snapshot.
    const id = await workerFork.client.snapshot()
    try {
      await use(workerFork)
    } finally {
      await workerFork.client.revert({ id })
    }
  },
  page: async ({ page, fork }, use) => {
    // The dependency ensures browser/Next teardown precedes the chain revert.
    void fork
    await use(page)
    await page.context().close()
  },
  mocks: [
    async ({ page, next, fork }, use, testInfo) => {
      const mocks = new NetworkMocks(fork.url)
      installApiMocks(mocks, fork)
      await mocks.install(page, next)
      await use(mocks)
      await testInfo.attach('network', {
        body: JSON.stringify(mocks.requests, null, 2),
        contentType: 'application/json',
      })
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'

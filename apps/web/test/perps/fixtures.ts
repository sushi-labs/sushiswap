import { test as base } from 'next/experimental/testmode/playwright.js'
import {
  ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS,
  type AnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { getAnvilPort } from '../constants'
import { NetworkMocks } from '../intercept-anvil'
import { installWalletConnectMocks } from '../walletconnect-mocks'
import {
  type PerpsApiMockController,
  installPerpsApiMocks,
  installPerpsWebSocketMocks,
} from './api-mocks'
import {
  PERPS_TEST_ADDRESS,
  type PerpsWalletMocks,
  installPerpsWalletMocks,
} from './wallet'

export const test = base.extend<{
  sourceChainId: AnyTokenAnyChainDepositChainId
  mocks: NetworkMocks
  perps: PerpsApiMockController
  wallet: PerpsWalletMocks
  network: undefined
}>({
  sourceChainId: [ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS[0], { option: true }],
  // biome-ignore lint/correctness/noEmptyPattern: Playwright requires destructured fixture dependencies.
  mocks: async ({}, use) => {
    // The test app's existing Wagmi mock uses this RPC URL. Every request is
    // handled by wallet.ts; these tests never need or forward to an Anvil fork.
    await use(new NetworkMocks(`http://127.0.0.1:${getAnvilPort()}`))
  },
  wallet: async ({ mocks, sourceChainId }, use) => {
    await use(installPerpsWalletMocks(mocks, sourceChainId))
  },
  perps: async ({ mocks, sourceChainId }, use) => {
    installWalletConnectMocks(mocks)
    await use(installPerpsApiMocks(mocks, sourceChainId, PERPS_TEST_ADDRESS))
  },
  network: [
    async ({ page, next, mocks, perps, wallet }, use, testInfo) => {
      void wallet
      await mocks.install(page, next)
      await installPerpsWebSocketMocks(page, perps)
      await use(undefined)
      await testInfo.attach('perps-network', {
        body: JSON.stringify(
          {
            requests: mocks.requests,
            quotes: perps.quoteRequests,
            steps: perps.stepRequests,
            status: perps.statusRequests.map(String),
            transactions: wallet.transactions,
            rpc: wallet.rpcRequests,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      })
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'

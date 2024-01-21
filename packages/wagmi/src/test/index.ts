import { MockConnector } from '@wagmi/core/connectors/mock'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { createConfig, configureChains } from 'wagmi'

import { accounts, testChains } from './constants'

const anvilPort = String(
  process.env.ANVIL_PORT || process.env.NEXT_PUBLIC_ANVIL_PORT || 8545,
)

const chainId = Number(
  process.env.CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || 137,
)
const testWalletIndex = Number(
  process.env.TEST_WALLET_INDEX ||
    process.env.NEXT_PUBLIC_TEST_WALLET_INDEX ||
    0,
)

const localHttpUrl = `http://127.0.0.1:${anvilPort}`

export const createTestConfig = () => {
  const { publicClient } = configureChains(
    testChains,
    [
      jsonRpcProvider({
        rpc: () => ({
          http: localHttpUrl,
        }),
      }),
    ],
    {
      pollingInterval: 1_000,
    },
  )
  const mockConnector = new MockConnector({
    options: {
      walletClient: createWalletClient({
        account: accounts.map((x) => privateKeyToAccount(x.privateKey))[
          testWalletIndex
        ],
        transport: http(localHttpUrl),
        chain: testChains.find((x) => x.id === chainId),
        pollingInterval: 1_000,
      }),
    },
  })
  return createConfig({
    publicClient,
    autoConnect: true,
    connectors: [mockConnector],
  })
}

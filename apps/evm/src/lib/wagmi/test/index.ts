import { mock } from '@wagmi/connectors'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { createConfig } from 'wagmi'

import { ChainId } from 'sushi'
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
  const mockConnector = mock({
    accounts: [
      accounts.map((x) => privateKeyToAccount(x.privateKey))[testWalletIndex]
        .address,
    ],
    features: {
      reconnect: true,
    },
  })

  const chain = testChains.find((x) => x.id === chainId)!

  return createConfig({
    chains: [chain],
    transports: {
      [ChainId.ETHEREUM]: http(localHttpUrl),
      [ChainId.POLYGON]: http(localHttpUrl),
      [ChainId.ARBITRUM]: http(localHttpUrl),
    },
    pollingInterval: 1_000,
    connectors: [mockConnector],
  })
}

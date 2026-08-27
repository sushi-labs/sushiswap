import { mock } from '@wagmi/connectors'
import { isLivePrivyE2eEnabled } from 'src/lib/wallet/privy/privy-e2e-mode'
import type { EvmChainId } from 'sushi/evm'
import { http, type HttpTransport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createConfig } from 'wagmi'
import { hasPersistedConnector } from '../persisted-connectors'
import { accounts, testChains } from './constants'

const anvilPort = String(
  process.env.ANVIL_PORT || process.env.NEXT_PUBLIC_ANVIL_PORT || 8545,
)

// const chainId = Number(
//   process.env.CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || 137,
// )
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

  return createConfig({
    chains: testChains,
    transports: testChains.reduce(
      (acc, chain) => {
        acc[chain.id] = http(localHttpUrl)
        return acc
      },
      {} as Record<EvmChainId, HttpTransport>,
    ),
    pollingInterval: 1_000,
    // The Privy test runtime registers its real injected connector lazily.
    // Keeping the default mock here would violate the app's one-wallet
    // invariant and make targeted Privy restoration intentionally fail.
    connectors:
      hasPersistedConnector('io.privy') || isLivePrivyE2eEnabled()
        ? []
        : [mockConnector],
  })
}

import { mock } from '@wagmi/connectors'
import type { Config } from '@wagmi/core'
import { isPrivyE2eEnabled } from 'src/lib/wallet/privy/privy-e2e-mode'
import {
  hasPrivyEvmReconnectIntent,
  isPrivyEvmConnectorId,
  privyEvmConnector,
} from 'src/lib/wallet/privy/privy-evm-connector'
import type { EvmChainId } from 'sushi/evm'
import { http, type HttpTransport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createConfig } from 'wagmi'
import {
  createConnectorRestoringStorage,
  hasPersistedConnectorMatching,
} from '../persisted-connectors'
import { accounts, getTestRpcUrl, testChains } from './constants'

// const chainId = Number(
//   process.env.CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || 137,
// )
const testWalletIndex = Number(
  process.env.TEST_WALLET_INDEX ||
    process.env.NEXT_PUBLIC_TEST_WALLET_INDEX ||
    0,
)

export const createTestConfig = () => {
  const storage = createConnectorRestoringStorage()
  const mockConnector = mock({
    accounts: [
      accounts.map((x) => privateKeyToAccount(x.privateKey))[testWalletIndex]
        .address,
    ],
    features: {
      reconnect: true,
    },
  })

  const config: Config = createConfig({
    chains: testChains,
    transports: testChains.reduce(
      (acc, chain) => {
        acc[chain.id] = http(getTestRpcUrl(chain.id))
        return acc
      },
      {} as Record<EvmChainId, HttpTransport>,
    ),
    pollingInterval: 1_000,
    storage,
    // Reconnect only one EVM wallet in the test app. The registered Privy
    // connector restores through ordinary Wagmi hydration.
    connectors: [
      privyEvmConnector({
        getWagmiState: () => config.state,
      }),
      ...(hasPersistedConnectorMatching(isPrivyEvmConnectorId) ||
      hasPrivyEvmReconnectIntent() ||
      isPrivyE2eEnabled()
        ? []
        : [mockConnector]),
    ],
    ssr: true,
  })
  return config
}

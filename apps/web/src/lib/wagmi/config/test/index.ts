'use client'

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mock } from '@wagmi/connectors'
import type { EvmChainId } from 'sushi/evm'
import { http, type HttpTransport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { projectId } from '../appkit'
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

export const testCustomRpcUrls = testChains.reduce(
  (acc, chain) => {
    acc[chain.id] = http(localHttpUrl)
    return acc
  },
  {} as Record<EvmChainId, HttpTransport>,
)

export const createTestWagmiAdapter = () => {
  const mockConnector = mock({
    accounts: [
      accounts.map((x) => privateKeyToAccount(x.privateKey))[testWalletIndex]
        .address,
    ],
    features: {
      reconnect: true,
    },
  })

  return new WagmiAdapter({
    networks: testChains,
    customRpcUrls: testCustomRpcUrls,
    pollingInterval: 1_000,
    connectors: [mockConnector],
    projectId,
  })
}

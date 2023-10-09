import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { Chain, configureChains, createConfig } from 'wagmi'

import { foundry } from '../chains'
import { MockConnector } from '../connectors/mock'
import { TestChainId, accounts, testChains } from './constants'

const foundryPort = String(
  process.env.ANVIL_PORT || process.env.NEXT_PUBLIC_ANVIL_PORT || 8545,
)

const { publicClient } = configureChains(
  testChains,
  [
    jsonRpcProvider({
      rpc: () => ({
        http: foundry.rpcUrls.default.http[0].replace('8545', foundryPort),
      }),
    }),
  ],
  {
    pollingInterval: 4_000,
  },
)

export function getNetwork(chain: Chain) {
  return {
    chainId: chain.id,
    ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    name: chain.name,
  }
}

export function getAccounts() {
  return accounts.map((x) => privateKeyToAccount(x.privateKey))
}

export function getTransport(chainId: TestChainId) {
  const chain = testChains.find((x) => x.id === chainId)
  if (!chain) throw Error(`No chain found for ${chainId}`)
  const url = foundry.rpcUrls.default.http[0].replace('8545', foundryPort)
  console.log({ url })
  return http(url)
}

export const createTestConfig = (
  chainId: TestChainId,
  accountIndex: number,
) => {
  console.log({
    chain: JSON.stringify(testChains.find((x) => x.id === chainId)),
  })
  const walletClient = createWalletClient({
    account: getAccounts()[accountIndex],
    transport: getTransport(chainId),
    chain: testChains.find((x) => x.id === chainId),
    pollingInterval: 4000,
  })

  const mockConnector = new MockConnector({
    options: {
      walletClient,
    },
  })

  return createConfig({
    publicClient,
    autoConnect: true,
    connectors: [mockConnector],
  })
}

/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { custom, defineChain, encodeFunctionResult } from 'viem'
import { expect, it, vi } from 'vitest'
import { WagmiContext, createConfig } from 'wagmi'
import { SUSHI_V1_LAUNCHPAD_ABI } from '../_providers/sushi-v1/contract'
import { SUSHI_V2_LAUNCHPAD_ABI } from '../_providers/sushi-v2/contract'
import { useFeeDistribution } from './use-fee-distribution'

vi.mock('@sushiswap/notifications', () => ({ createToast: vi.fn() }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each(['SushiV1LaunchpadToken', 'SushiV2LaunchpadToken'] as const)(
  'loads the %s preview without a connected wallet or connector',
  async (__typename) => {
    notifyManager.setNotifyFunction((callback) => act(callback))
    const chain = defineChain({
      id: EvmChainId.ROBINHOOD,
      name: 'Test launch network',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['http://localhost'] } },
    })
    const encoded =
      __typename === 'SushiV1LaunchpadToken'
        ? encodeFunctionResult({
            abi: SUSHI_V1_LAUNCHPAD_ABI,
            functionName: 'distributeFees',
            result: [20n, 10n, 2n, 1n],
          })
        : encodeFunctionResult({
            abi: SUSHI_V2_LAUNCHPAD_ABI,
            functionName: 'distributeFees',
            result: {
              quoteToSushi: 2n,
              launchTokenToSushi: 1n,
              quoteToReceiver: 18n,
              launchTokenToReceiver: 9n,
              launchTokenFeesBurned: 0n,
              quoteUsedForBuyback: 0n,
              launchTokenBoughtAndBurned: 0n,
              priorMeanTick: 0,
              recentMeanTick: 0,
              spotTick: 0,
            },
          })
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method !== 'eth_call') throw new Error(`Unexpected RPC: ${method}`)
      return encoded
    })
    const config = createConfig({
      chains: [chain],
      transports: { [chain.id]: custom({ request }) },
      multiInjectedProviderDiscovery: false,
    })
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const container = document.createElement('div')
    const root = createRoot(container)
    function Probe() {
      const { preview } = useFeeDistribution({
        chainId: chain.id,
        address: '0x1111111111111111111111111111111111111111',
        token: {
          __typename,
          factoryAddress: '0x2222222222222222222222222222222222222222',
          symbol: 'TEST',
        },
      })
      return (
        <span>
          {preview?.breakdown?.quoteToReceiver.toString()}:
          {preview?.breakdown?.launchTokenToReceiver.toString()}
        </span>
      )
    }
    try {
      expect(config.state.status).toBe('disconnected')
      expect(config.connectors).toHaveLength(0)
      await act(async () =>
        root.render(
          <WagmiContext.Provider value={config}>
            <QueryClientProvider client={client}>
              <Probe />
            </QueryClientProvider>
          </WagmiContext.Provider>,
        ),
      )
      await vi.waitFor(async () => {
        await act(async () => {})
        expect(container.textContent).toBe('18:9')
      })
      expect(request).toHaveBeenCalledOnce()
    } finally {
      act(() => root.unmount())
      client.clear()
      notifyManager.setNotifyFunction((callback) => callback())
    }
  },
)

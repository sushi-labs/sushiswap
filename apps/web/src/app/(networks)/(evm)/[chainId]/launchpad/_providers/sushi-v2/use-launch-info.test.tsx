/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { custom, defineChain, encodeFunctionResult, zeroAddress } from 'viem'
import { expect, it, vi } from 'vitest'
import { WagmiContext, createConfig } from 'wagmi'
import { SUSHI_V2_LAUNCHPAD_ABI, getSushiV2LaunchpadAddress } from './contract'
import { useSushiV2LaunchInfo } from './use-launch-info'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each([0, 1])(
  'reads fee mode %i from the contract and keeps the new mode after remounting',
  async (initialMode) => {
    notifyManager.setNotifyFunction((callback) => act(callback))
    let feeDisposition = initialMode
    const chain = defineChain({
      id: EvmChainId.ROBINHOOD,
      name: 'Test launch network',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['http://localhost'] } },
    })
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method !== 'eth_call')
        throw new Error(`Unexpected RPC method: ${method}`)
      return encodeFunctionResult({
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        functionName: 'launchInfo',
        result: {
          creator: zeroAddress,
          feeReceiver: zeroAddress,
          quoteToken: zeroAddress,
          pool: zeroAddress,
          custodian: zeroAddress,
          liquidityMode: 0,
          feeDisposition,
          sushiFeeBps: 1000,
          poolInitializedAt: 1n,
          supportsHolderRewards: true,
          rewardDistributor: zeroAddress,
        },
      })
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
    let refetch: (() => Promise<unknown>) | undefined
    function Probe() {
      const query = useSushiV2LaunchInfo({
        chainId: chain.id,
        factoryAddress: getSushiV2LaunchpadAddress(chain.id),
        address: zeroAddress,
        enabled: true,
      })
      refetch = query.refetch
      return <span>{query.data?.feeDisposition}</span>
    }
    async function render(key: string) {
      await act(async () =>
        root.render(
          <WagmiContext.Provider value={config}>
            <QueryClientProvider client={client}>
              <Probe key={key} />
            </QueryClientProvider>
          </WagmiContext.Provider>,
        ),
      )
    }
    try {
      await render('initial')
      await vi.waitFor(async () => {
        await act(async () => {})
        expect(container.textContent).toBe(
          initialMode === 0 ? 'DIRECT_PAYOUT' : 'BURN_LAUNCH_TOKEN_FEES',
        )
      })
      feeDisposition = 3
      await act(async () => {
        await refetch?.()
      })
      await vi.waitFor(async () => {
        await act(async () => {})
        expect(container.textContent).toBe('DISTRIBUTE_TO_HOLDERS')
      })
      await render('refreshed')
      expect(container.textContent).toBe('DISTRIBUTE_TO_HOLDERS')
      expect(request.mock.calls.length).toBeGreaterThanOrEqual(3)
    } finally {
      act(() => root.unmount())
      client.clear()
      notifyManager.setNotifyFunction((callback) => callback())
    }
  },
)

/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { custom, encodeFunctionResult, multicall3Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { expect, it, vi } from 'vitest'
import { WagmiContext, createConfig } from 'wagmi'
import { steerPeripheryAbi } from '../abi/steer-periphery'
import { useSteerVaultReserves } from './use-steer-vault-reserves'

vi.mock('src/lib/wagmi/hooks/watch/use-watch-by-block', () => ({
  useWatchByBlock: () => {},
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('loads vault reserves without a connected wallet so both deposit amounts can be calculated', async () => {
  notifyManager.setNotifyFunction((callback) => act(callback))
  const balances = encodeFunctionResult({
    abi: steerPeripheryAbi,
    functionName: 'vaultBalancesByAddressWithFees',
    result: { amountToken0: 100n, amountToken1: 200n },
  })
  const request = vi.fn(async ({ method }: { method: string }) => {
    if (method !== 'eth_call') throw new Error(`Unexpected RPC: ${method}`)
    return encodeFunctionResult({
      abi: multicall3Abi,
      functionName: 'aggregate3',
      result: [{ success: true, returnData: balances }],
    })
  })
  const config = createConfig({
    chains: [mainnet],
    transports: { [mainnet.id]: custom({ request }) },
    multiInjectedProviderDiscovery: false,
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const container = document.createElement('div')
  const root = createRoot(container)
  function Probe() {
    const { data } = useSteerVaultReserves({
      vaultId: '1:0x7187535269d7871bf3ad0c77b5350a5632282ee8',
    })
    return <span>{data && `${data.reserve0}:${data.reserve1}`}</span>
  }
  try {
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
      expect(container.textContent).toBe('100:200')
    })
    expect(config.state.status).toBe('disconnected')
    expect(request).toHaveBeenCalledOnce()
  } finally {
    act(() => root.unmount())
    client.clear()
    notifyManager.setNotifyFunction((callback) => callback())
  }
})

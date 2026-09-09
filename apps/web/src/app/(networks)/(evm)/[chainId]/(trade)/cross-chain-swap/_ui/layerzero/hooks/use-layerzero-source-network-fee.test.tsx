/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { LayerZeroSourceNetworkFeeEstimate } from 'src/lib/swap/layerzero/source-network-fee'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { http, createPublicClient, padHex } from 'viem'
import { mainnet } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLayerZeroSourceNetworkFee } from './use-layerzero-source-network-fee'

const { estimate } = vi.hoisted(() => ({
  estimate: vi.fn<() => Promise<LayerZeroSourceNetworkFeeEstimate>>(),
}))
vi.mock('src/lib/swap/layerzero/source-network-fee', () => ({
  estimateLayerZeroSourceNetworkFee: estimate,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const quote: LayerZeroQuote = {
  fromChainId: 1,
  toChainId: -4,
  sourceAddress: '0x000000000000000000000000000000000000dEaD',
  recipient: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
  amountIn: 1_000_000n,
  amountSent: 1_000_000n,
  amountOut: 10_000_000n,
  minAmountOut: 9_950_000n,
  nativeFee: 1_000n,
  maxNativeFee: 1_100n,
  sendParam: {
    dstEid: 30600,
    to: padHex('0x01', { size: 32 }),
    amountLD: 1_000_000n,
    minAmountLD: 995_000n,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  },
}
const publicClient = createPublicClient({ chain: mainnet, transport: http() })

function Harness({
  currentQuote,
  enabled,
}: { currentQuote: LayerZeroQuote; enabled: boolean }) {
  const fee = useLayerZeroSourceNetworkFee({
    quote: currentQuote,
    enabled,
    publicClient,
  })
  return (
    <span>
      {fee.status}
      {fee.status === 'estimated' ? `:${fee.amount}` : ''}
    </span>
  )
}

describe('LayerZero source network fee query', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient

  function render(currentQuote = quote, enabled = true) {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <Harness currentQuote={currentQuote} enabled={enabled} />
        </QueryClientProvider>,
      ),
    )
  }

  async function expectState(state: string) {
    await vi.waitFor(async () => {
      await act(async () => {})
      expect(container.textContent).toBe(state)
    })
  }

  beforeEach(() => {
    estimate.mockReset()
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('does not estimate disconnected or inactive routes', () => {
    render({ ...quote, sourceAddress: undefined })
    expect(container.textContent).toBe('connect-wallet')
    render(quote, false)
    expect(container.textContent).toBe('unavailable')
    expect(estimate).not.toHaveBeenCalled()
  })

  it('shows loading, then estimates, and invalidates on changes to the actual send', async () => {
    let resolve:
      | ((value: LayerZeroSourceNetworkFeeEstimate) => void)
      | undefined
    estimate.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    render()
    expect(container.textContent).toBe('loading')
    await act(async () => resolve?.({ status: 'estimated', amount: 123n }))
    await expectState('estimated:123')
    estimate.mockResolvedValue({ status: 'estimated', amount: 456n })
    render({ ...quote, maxNativeFee: 2_200n })
    expect(container.textContent).toBe('loading')
    await expectState('estimated:456')
    render({
      ...quote,
      sendParam: { ...quote.sendParam, minAmountLD: 990_000n },
    })
    await expectState('estimated:456')
    render({
      ...quote,
      sourceAddress: '0x0000000000000000000000000000000000000001',
    })
    await expectState('estimated:456')
    expect(estimate).toHaveBeenCalledTimes(4)
  })

  it('hides a previous successful estimate if a refresh fails', async () => {
    estimate.mockResolvedValueOnce({ status: 'estimated', amount: 123n })
    render()
    await expectState('estimated:123')
    estimate.mockRejectedValueOnce(new Error('RPC unavailable'))
    await act(async () => {
      await client.invalidateQueries({
        queryKey: ['layerzero-source-network-fee'],
      })
    })
    await expectState('unavailable')
    expect(estimate).toHaveBeenCalledTimes(2)
  })

  it('refreshes an approval-required estimate once the allowance changes', async () => {
    estimate.mockResolvedValueOnce({ status: 'approval-required' })
    render()
    await expectState('approval-required')
    estimate.mockResolvedValueOnce({ status: 'estimated', amount: 123n })
    await act(async () => {
      await client.invalidateQueries({
        queryKey: ['layerzero-source-network-fee'],
      })
    })
    await expectState('estimated:123')
  })
})

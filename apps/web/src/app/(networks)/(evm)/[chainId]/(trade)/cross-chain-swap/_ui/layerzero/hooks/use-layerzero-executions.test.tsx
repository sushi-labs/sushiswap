/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './use-layerzero-executions'

const { refetchChain } = vi.hoisted(() => ({ refetchChain: vi.fn() }))
vi.mock(
  '../../../../../../_common/ui/balance-provider/use-refetch-balances',
  () => ({
    useRefetchBalances: () => ({ refetchChain }),
  }),
)

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
    to: '0x',
    amountLD: 1_000_000n,
    minAmountLD: 995_000n,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  },
}

describe('LayerZero concurrent execution tracking', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let state: LayerZeroExecutionState
  const fetchStatus = vi.fn<typeof fetch>()

  function Harness() {
    state = useLayerZeroExecutions()
    return null
  }

  beforeEach(() => {
    refetchChain.mockReset()
    fetchStatus
      .mockReset()
      .mockImplementation(async () => Response.json({ status: 'PENDING' }))
    vi.stubGlobal('fetch', fetchStatus)
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <Harness />
        </QueryClientProvider>,
      ),
    )
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    vi.unstubAllGlobals()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('locks only source submission, then allows another swap while bridging', () => {
    act(() => {
      expect(state.mutate.beginExecution('first', quote)).toBe(true)
      expect(state.mutate.beginExecution('duplicate-click', quote)).toBe(false)
    })
    expect(state.isSubmitting).toBe(true)
    act(() => {
      state.mutate.updateExecution('first', {
        txHash: '0xfirst',
        sourceStatus: 'SUCCESS',
      })
      state.mutate.finishSubmission('first')
    })
    expect(state.isSubmitting).toBe(false)
    act(() => {
      expect(
        state.mutate.beginExecution('second', {
          ...quote,
          amountIn: 2_000_000n,
        }),
      ).toBe(true)
      // A late callback from the first transfer must not release the new lock.
      state.mutate.finishSubmission('first')
      expect(state.mutate.beginExecution('third', quote)).toBe(false)
    })
    expect(state.isSubmitting).toBe(true)
    expect(state.executions.map(({ id }) => id)).toEqual(['first', 'second'])
  })

  it('updates older transactions by id without replacing the newest trade snapshot', () => {
    const secondQuote = { ...quote, amountIn: 2_000_000n }
    act(() => {
      state.mutate.beginExecution('first', quote)
      state.mutate.updateExecution('first', {
        txHash: '0xfirst',
        sourceStatus: 'PENDING',
      })
      state.mutate.finishSubmission('first')
      state.mutate.beginExecution('second', secondQuote)
      state.mutate.updateExecution('second', {
        txHash: '0xsecond',
        sourceStatus: 'SUCCESS',
      })
      state.mutate.updateExecution('first', {
        txHash: '0xreplacement',
        sourceStatus: 'SUCCESS',
      })
      state.mutate.failExecution('first', 'RPC timeout')
    })
    expect(state.executions[0]).toMatchObject({
      id: 'first',
      txHash: '0xreplacement',
      error: 'RPC timeout',
      sourceStatus: 'SUCCESS',
    })
    expect(state.executions[1]).toMatchObject({
      id: 'second',
      txHash: '0xsecond',
      sourceStatus: 'SUCCESS',
      quote: secondQuote,
    })
    expect(state.executions[1]?.error).toBeUndefined()
  })

  it('retains a broadcast hash on timeout but marks pre-broadcast failures as failed', () => {
    act(() => {
      state.mutate.beginExecution('broadcast', quote)
      state.mutate.updateExecution('broadcast', {
        txHash: '0xpending',
        sourceStatus: 'PENDING',
      })
      expect(
        state.mutate.failExecution('broadcast', 'RPC timeout'),
      ).toMatchObject({ txHash: '0xpending', sourceStatus: 'PENDING' })
      state.mutate.finishSubmission('broadcast')
      state.mutate.beginExecution('rejected', quote)
      expect(
        state.mutate.failExecution('rejected', 'User rejected'),
      ).toMatchObject({ sourceStatus: 'FAILED' })
      state.mutate.finishSubmission('rejected')
    })
    expect(state.isSubmitting).toBe(false)
    expect(state.executions).toHaveLength(2)
  })

  it('polls each submitted route and refreshes destination balances once per delivery', async () => {
    const reverseQuote: LayerZeroQuote = {
      ...quote,
      fromChainId: -4,
      toChainId: 1,
    }
    act(() => {
      state.mutate.beginExecution('first', quote)
      state.mutate.updateExecution('first', {
        txHash: '0xfirst',
        sourceStatus: 'SUCCESS',
      })
      state.mutate.finishSubmission('first')
      state.mutate.beginExecution('second', reverseQuote)
      state.mutate.updateExecution('second', {
        txHash: 'second',
        sourceStatus: 'SUCCESS',
      })
      state.mutate.finishSubmission('second')
    })
    await vi.waitFor(async () => {
      await act(async () => {})
      expect(state.executions.map(({ delivery }) => delivery?.status)).toEqual([
        'PENDING',
        'PENDING',
      ])
    })
    expect(fetchStatus.mock.calls.map(([url]) => String(url))).toEqual(
      expect.arrayContaining([
        '/api/cross-chain/layerzero/status?txHash=0xfirst&fromChainId=1&toChainId=-4',
        '/api/cross-chain/layerzero/status?txHash=second&fromChainId=-4&toChainId=1',
      ]),
    )
    expect(refetchChain).not.toHaveBeenCalled()
    act(() =>
      client.setQueryData(['layerzero-status', -4, 1, 'second', 'second'], {
        status: 'SUCCESS',
        destinationTxHash: '0xdest',
      }),
    )
    await vi.waitFor(() => expect(refetchChain).toHaveBeenCalledWith(1))
    expect(state.executions[0]?.delivery?.status).toBe('PENDING')
    expect(state.executions[1]?.delivery?.destinationTxHash).toBe('0xdest')
    act(() =>
      client.setQueryData(['layerzero-status', 1, -4, '0xfirst', 'first'], {
        status: 'SUCCESS',
      }),
    )
    await vi.waitFor(() => expect(refetchChain).toHaveBeenCalledTimes(2))
    expect(refetchChain).toHaveBeenLastCalledWith(-4)
    act(() =>
      state.mutate.updateExecution('first', { sourceStatus: 'SUCCESS' }),
    )
    expect(refetchChain).toHaveBeenCalledTimes(2)
  })

  it('keeps the transfer and hash when the tracking API is unavailable', async () => {
    fetchStatus.mockResolvedValue(new Response(null, { status: 503 }))
    act(() => {
      state.mutate.beginExecution('first', quote)
      state.mutate.updateExecution('first', {
        txHash: '0xfirst',
        sourceStatus: 'PENDING',
      })
      state.mutate.finishSubmission('first')
    })
    await vi.waitFor(async () => {
      await act(async () => {})
      expect(state.executions[0]).toMatchObject({
        statusError: true,
        txHash: '0xfirst',
        sourceStatus: 'PENDING',
      })
    })
    expect(state.isSubmitting).toBe(false)
  })
})

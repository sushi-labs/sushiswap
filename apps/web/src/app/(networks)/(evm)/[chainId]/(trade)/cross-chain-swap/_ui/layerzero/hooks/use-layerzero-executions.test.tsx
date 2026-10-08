/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { makeExecutionTrade } from 'src/lib/swap/value-transfer/execution-test-fixtures'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
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

const quote = makeExecutionTrade()

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
    const secondQuote = {
      ...quote,
      amountIn: 2_000_000n,
      quote: { ...quote.quote, id: 'second-quote' },
    }
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
    const reverseQuote: ValueTransferTrade = {
      ...quote,
      fromChainId: 42161,
      toChainId: 8453,
      srcChain: quote.dstChain,
      dstChain: quote.srcChain,
      quote: { ...quote.quote, id: 'second-quote' },
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
        `/api/cross-chain/value-transfer/status?quoteId=${quote.quote.id}&txHash=0xfirst`,
        '/api/cross-chain/value-transfer/status?quoteId=second-quote&txHash=second',
      ]),
    )
    expect(refetchChain).not.toHaveBeenCalled()
    act(() =>
      client.setQueryData(
        ['value-transfer-status', 'second-quote', 'second', 'second'],
        {
          status: 'SUCCESS',
          destinationTxHash: '0xdest',
        },
      ),
    )
    await vi.waitFor(() => expect(refetchChain).toHaveBeenCalledWith(8453))
    expect(state.executions[0]?.delivery?.status).toBe('PENDING')
    expect(state.executions[1]?.delivery?.destinationTxHash).toBe('0xdest')
    act(() =>
      client.setQueryData(
        ['value-transfer-status', quote.quote.id, '0xfirst', 'first'],
        {
          status: 'SUCCESS',
        },
      ),
    )
    await vi.waitFor(() => expect(refetchChain).toHaveBeenCalledTimes(2))
    expect(refetchChain).toHaveBeenLastCalledWith(42161)
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
  it('polls signature submissions without a transaction hash and prevents resubmitting that quote', async () => {
    act(() => {
      state.mutate.beginExecution('signature', quote)
      state.mutate.updateExecution('signature', {
        submitted: true,
        sourceStatus: 'PENDING',
      })
      state.mutate.failExecution('signature', 'Submission response timed out')
      state.mutate.finishSubmission('signature')
      expect(state.mutate.beginExecution('duplicate', quote)).toBe(false)
    })
    await vi.waitFor(() =>
      expect(fetchStatus).toHaveBeenCalledWith(
        `/api/cross-chain/value-transfer/status?quoteId=${quote.quote.id}`,
        expect.anything(),
      ),
    )
    expect(state.executions[0]?.sourceStatus).toBe('PENDING')
  })
})

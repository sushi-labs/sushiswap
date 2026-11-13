/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, act, useEffect } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { USDC } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StepState } from './confirmation-dialog'
import {
  type LifiTrackingRecord,
  getLifiTrackingId,
  useSharedLifiTracking,
} from './tracking-context'
import { LifiTrackingProvider } from './tracking-provider'
import { useLifiTracking } from './trade-review-dialog/hooks/use-lifi-tracking'

const mocks = vi.hoisted(() => ({
  createToast: vi.fn(),
  createInfoToast: vi.fn(),
  waitForReceipt: vi.fn(),
  refetchChain: vi.fn(),
  reset: vi.fn(),
  setStepStates: vi.fn(),
  sendAnalyticsEvent: vi.fn(),
}))

vi.mock('@sushiswap/notifications', () => ({
  createToast: mocks.createToast,
  createInfoToast: mocks.createInfoToast,
}))
vi.mock('@sushiswap/telemetry', () => ({
  SwapEventName: {
    XSWAP_DST_TRANSACTION_COMPLETED: 'destination-completed',
    XSWAP_DST_TRANSACTION_FAILED: 'destination-failed',
  },
  sendAnalyticsEvent: mocks.sendAnalyticsEvent,
}))
vi.mock(
  'src/lib/swap/cross-chain',
  async () => import('src/lib/swap/cross-chain/hooks/use-lifi-scan-link'),
)
vi.mock('src/lib/svm/wait-for-svm-signature', () => ({
  waitForSvmSignature: mocks.waitForReceipt,
}))
vi.mock('wagmi', () => ({
  usePublicClient: () => ({ waitForTransactionReceipt: mocks.waitForReceipt }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: mocks.refetchChain }),
}))
vi.mock('./confirmation-dialog', () => ({
  StepState: {
    Sign: 0,
    NotStarted: 1,
    Pending: 2,
    PartialSuccess: 3,
    Success: 4,
    Failed: 5,
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const firstHash = `0x${'1'.repeat(64)}` as const
const secondHash = `0x${'2'.repeat(64)}` as const
const destinationHash = `0x${'3'.repeat(64)}` as const

function record(
  hash: LifiTrackingRecord['hash'],
  sourceReceipt: Promise<unknown> = Promise.resolve(),
): LifiTrackingRecord {
  return {
    chainId0: 1,
    chainId1: 10,
    hash,
    account: '0x0000000000000000000000000000000000000001',
    groupTimestamp: 12345,
    sourceReceipt,
    // Only fields used by the existing tracking summaries are needed here.
    route: {
      fromChainId: 1,
      toChainId: 10,
      fromToken: { symbol: 'USDC' },
      amountOut: new Amount(USDC[10], 2_000_000n),
      step: { includedStepsWithoutFees: [{ type: 'cross' }] },
    } as LifiTrackingRecord['route'],
  }
}

describe('shared LI.FI tracking', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let shared: NonNullable<ReturnType<typeof useSharedLifiTracking>>
  let fetchStatus: ReturnType<typeof vi.fn>
  let responses: Map<string, object>

  function CurrentReview({
    record,
  }: { record?: LifiTrackingRecord }): ReactNode {
    const tracking = useSharedLifiTracking()
    if (!tracking) throw new Error('Missing shared tracker')
    shared = tracking
    return record ? <ReviewObserver record={record} /> : null
  }

  function ReviewObserver({ record }: { record: LifiTrackingRecord }): null {
    const tracking = useSharedLifiTracking()
    const id = getLifiTrackingId(record.chainId0, record.hash)
    useLifiTracking({
      ...record,
      tradeId: id,
      sourceState: StepState.Success,
      reset: mocks.reset,
      setStepStates: mocks.setStepStates,
      enabled: false,
      effectsEnabled: false,
    })
    useEffect(
      () => tracking?.subscribeToCompletion(id, mocks.reset),
      [tracking, id],
    )
    return null
  }

  function render(currentRecord?: LifiTrackingRecord): void {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <LifiTrackingProvider>
            <CurrentReview record={currentRecord} />
          </LifiTrackingProvider>
        </QueryClientProvider>,
      ),
    )
  }

  async function advance(ms = 1): Promise<void> {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms)
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mocks.waitForReceipt.mockResolvedValue({ status: 'success' })
    responses = new Map()
    fetchStatus = vi.fn(async (input: string | URL) => {
      const hash = new URL(String(input)).searchParams.get('txHash') ?? ''
      return Response.json(
        responses.get(hash) ?? {
          sending: { txHash: hash },
          status: 'PENDING',
          lifiExplorerLink: `https://scan.li.fi/tx/${hash}`,
        },
      )
    })
    vi.stubGlobal('fetch', fetchStatus)
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Number.POSITIVE_INFINITY },
      },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('continues polling and destination notifications after the review unmounts', async () => {
    const receipt = Promise.withResolvers<unknown>()
    const submitted = record(firstHash, receipt.promise)
    render(submitted)
    act(() => shared.track(submitted))
    render()
    await advance()
    expect(fetchStatus).not.toHaveBeenCalled()

    await act(async () => receipt.resolve({ status: 'success' }))
    await advance()
    expect(fetchStatus).toHaveBeenCalledTimes(1)
    expect(mocks.createInfoToast).toHaveBeenCalledTimes(1)
    await advance(5000)
    expect(fetchStatus).toHaveBeenCalledTimes(2)

    responses.set(firstHash, {
      sending: { txHash: firstHash },
      receiving: { txHash: destinationHash },
      status: 'DONE',
      substatus: 'COMPLETED',
    })
    await advance(5000)
    expect(mocks.waitForReceipt).toHaveBeenCalledTimes(1)
    expect(mocks.waitForReceipt).toHaveBeenCalledWith({
      hash: destinationHash,
    })
    expect(mocks.createToast).toHaveBeenCalledTimes(1)
    expect(mocks.createToast).toHaveBeenCalledWith(
      expect.objectContaining({
        account: submitted.account,
        chainId: 10,
        groupTimestamp: submitted.groupTimestamp,
      }),
    )
    expect(mocks.refetchChain).toHaveBeenCalledTimes(1)
    expect(mocks.refetchChain).toHaveBeenCalledWith(10)
    expect(mocks.reset).not.toHaveBeenCalled()
    const requests = fetchStatus.mock.calls.length
    await advance(15000)
    expect(fetchStatus).toHaveBeenCalledTimes(requests)
  })

  it('uses one poller and one destination toast while the review observes its result', async () => {
    const submitted = record(firstHash)
    render(submitted)
    act(() => {
      shared.track(submitted)
      shared.track(submitted)
    })
    await advance()
    expect(fetchStatus).toHaveBeenCalledTimes(1)
    await advance(5000)
    expect(fetchStatus).toHaveBeenCalledTimes(2)
    responses.set(firstHash, {
      sending: { txHash: firstHash },
      receiving: { txHash: destinationHash },
      status: 'DONE',
      substatus: 'COMPLETED',
    })
    await advance(5000)
    render(submitted)
    await advance()
    expect(mocks.createToast).toHaveBeenCalledTimes(1)
    expect(mocks.reset).toHaveBeenCalledTimes(1)
    expect(mocks.setStepStates).toHaveBeenCalledWith({
      source: StepState.Success,
      bridge: StepState.Success,
      dest: StepState.Success,
    })
  })

  it('does not update or reset a newer review when an earlier transfer completes', async () => {
    const first = record(firstHash)
    const second = record(secondHash)
    render(first)
    act(() => shared.track(first))
    await advance()
    render(second)
    act(() => shared.track(second))
    await advance()
    responses.set(firstHash, {
      sending: { txHash: firstHash },
      receiving: { txHash: destinationHash },
      status: 'DONE',
      substatus: 'COMPLETED',
    })
    await advance(5000)
    expect(mocks.createToast).toHaveBeenCalledTimes(1)
    expect(mocks.reset).not.toHaveBeenCalled()
    expect(mocks.setStepStates).not.toHaveBeenCalled()
  })

  it('does not start bridge polling when the source receipt rejects', async () => {
    const receipt = Promise.withResolvers<unknown>()
    const submitted = record(firstHash, receipt.promise)
    render(submitted)
    act(() => shared.track(submitted))
    render()
    await act(async () => receipt.reject(new Error('Source reverted')))
    await advance(15000)
    expect(fetchStatus).not.toHaveBeenCalled()
    expect(mocks.createToast).not.toHaveBeenCalled()
    expect(mocks.refetchChain).not.toHaveBeenCalled()
  })

  it.each(['FAILED', 'DONE'])(
    'stops polling at the existing LI.FI terminal status %s',
    async (status) => {
      const submitted = record(firstHash)
      responses.set(firstHash, {
        sending: { txHash: firstHash },
        status,
        substatus: 'REFUNDED',
      })
      render()
      act(() => shared.track(submitted))
      await advance()
      const requests = fetchStatus.mock.calls.length
      expect(requests).toBe(1)
      await advance(15000)
      expect(fetchStatus).toHaveBeenCalledTimes(requests)
    },
  )
})

/* @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEvmSimpleSwapTradeReview } from './use-evm-simple-swap-trade-review'

const mocks = vi.hoisted(() => ({
  chainId: 4663,
  send: vi.fn(),
  errorToast: vi.fn(),
  client: { chain: { id: 4663 }, estimateFeesPerGas: vi.fn() },
}))

vi.mock('@sushiswap/notifications', () => ({
  createErrorToast: mocks.errorToast,
  createToast: vi.fn(),
}))
vi.mock('@sushiswap/telemetry', () => ({
  SwapEventName: {},
  sendAnalyticsEvent: vi.fn(),
  useTrace: () => ({}),
}))
vi.mock('src/lib/constants', () => ({ APPROVE_TAG_SWAP: 'swap' }))
vi.mock('src/lib/drilldown-log', () => ({ sendDrilldownLog: vi.fn() }))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [0.5],
}))
vi.mock('src/lib/logger', () => ({ logger: { error: vi.fn() } }))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogType: { Confirm: 'confirm', Review: 'review' },
  useDialog: () => ({ open: true }),
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  useApproved: () => ({ approved: true }),
}))
vi.mock(
  '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider',
  () => ({
    useDetailsInteractionTracker: () => ({
      state: {},
      mutate: { resetDetailsTrackedState: vi.fn() },
    }),
  }),
)
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: () => ({ data: undefined }),
}))
vi.mock('../common', () => ({
  isWrapTrade: () => false,
  isUnwrapTrade: () => false,
}))
vi.mock('../derivedstate-simple-swap-provider', () => ({
  useDerivedStateSimpleSwap: () => ({
    state: { chainId: mocks.chainId },
    mutate: { setSwapAmount: vi.fn() },
  }),
}))
vi.mock('../use-evm-simple-swap-trade', () => ({
  useEvmSimpleSwapTrade: () => ({
    data: {
      tx: {
        from: '0x0000000000000000000000000000000000000001',
        to: '0x0000000000000000000000000000000000000002',
        data: '0x1234',
        value: 5n,
        gas: 100_000n,
      },
    },
    isSuccess: true,
    isFetching: false,
    isError: false,
    error: null,
  }),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: '0x0000000000000000000000000000000000000001',
    chainId: mocks.chainId,
  }),
  usePublicClient: () => mocks.client,
  useSendTransaction: () => ({
    mutateAsync: mocks.send,
    isPending: false,
  }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('simple swap transaction fees', () => {
  let root: Root
  let container: HTMLDivElement
  let review: ReturnType<typeof useEvmSimpleSwapTradeReview>
  const confirm = vi.fn()
  const fees = {
    maxFeePerGas: 43_508_000n,
    maxPriorityFeePerGas: 0n,
  }

  function Harness() {
    review = useEvmSimpleSwapTradeReview({ variant: 'default' })
    return null
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.chainId = 4663
    mocks.client.estimateFeesPerGas.mockResolvedValue(fees)
    mocks.send.mockResolvedValue('0x1234')
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<Harness />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('refreshes Robinhood fees at submission with a doubled base-fee cap and unchanged gas margin', async () => {
    expect(mocks.client.estimateFeesPerGas).not.toHaveBeenCalled()

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(mocks.client.estimateFeesPerGas).toHaveBeenCalledWith({
      chain: expect.objectContaining({
        id: 4663,
        fees: { baseFeeMultiplier: 2 },
      }),
      type: 'eip1559',
    })
    expect(mocks.send).toHaveBeenCalledWith({
      chainId: 4663,
      account: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000002',
      data: '0x1234',
      value: 5n,
      gas: 180_000n,
      type: 'eip1559',
      gasPrice: undefined,
      ...fees,
    })
    expect(confirm).toHaveBeenCalledOnce()
  })

  it('shows pending state and prevents duplicate submissions while fees are refreshing', async () => {
    const estimate = Promise.withResolvers<typeof fees>()
    mocks.client.estimateFeesPerGas.mockReturnValue(estimate.promise)
    let write: Promise<void> | undefined

    await act(async () => {
      write = review.write?.(confirm)
    })
    expect(review.isWritePending).toBe(true)

    await act(async () => {
      await review.write?.(confirm)
    })
    expect(mocks.client.estimateFeesPerGas).toHaveBeenCalledOnce()
    expect(mocks.send).not.toHaveBeenCalled()

    await act(async () => {
      estimate.resolve(fees)
      await write
    })
    expect(mocks.send).toHaveBeenCalledOnce()
    expect(review.isWritePending).toBe(false)
  })

  it('shows fee RPC errors without sending and allows retrying', async () => {
    mocks.client.estimateFeesPerGas.mockRejectedValueOnce(
      new Error('RPC unavailable'),
    )

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(mocks.errorToast).toHaveBeenCalledOnce()
    expect(mocks.errorToast).toHaveBeenCalledWith(
      'RPC unavailable',
      false,
      'default',
    )
    expect(mocks.send).not.toHaveBeenCalled()
    expect(confirm).not.toHaveBeenCalled()
    expect(review.isWritePending).toBe(false)

    await act(async () => {
      await review.write?.(confirm)
    })
    expect(mocks.send).toHaveBeenCalledOnce()
    expect(confirm).toHaveBeenCalledOnce()
  })

  it('continues to leave fee estimation to the wallet on other chains', async () => {
    mocks.chainId = 1
    act(() => root.render(<Harness />))

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(mocks.client.estimateFeesPerGas).not.toHaveBeenCalled()
    expect(mocks.send).toHaveBeenCalledWith({
      chainId: 1,
      account: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000002',
      data: '0x1234',
      value: 5n,
      gas: 180_000n,
    })
  })
})

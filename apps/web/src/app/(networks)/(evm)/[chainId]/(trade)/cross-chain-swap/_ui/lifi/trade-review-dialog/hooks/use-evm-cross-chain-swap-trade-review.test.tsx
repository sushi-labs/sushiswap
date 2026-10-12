/* @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEvmCrossChainSwapTradeReview } from './use-evm-cross-chain-swap-trade-review'

const mocks = vi.hoisted(() => ({
  chainId: 4663,
  address: '0x0000000000000000000000000000000000000002',
  fees: vi.fn(),
  send: vi.fn(),
  onWriteError: vi.fn(),
  onWriteSuccess: vi.fn(),
  setStepStates: vi.fn(),
  client: { chain: { id: 4663 }, estimateFeesPerGas: vi.fn() },
}))

vi.mock('@sushiswap/telemetry', () => ({
  SwapEventName: {},
  sendAnalyticsEvent: vi.fn(),
}))
vi.mock('src/lib/logger', () => ({ logger: { error: vi.fn() } }))
vi.mock('src/lib/constants', () => ({ APPROVE_TAG_XSWAP: 'xswap' }))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogType: { Confirm: 'confirm', Review: 'review' },
  useDialog: () => ({ open: true }),
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  useApproved: () => ({ approved: true }),
}))
vi.mock('src/lib/wagmi/transactions/get-robinhood-transaction-fees', () => ({
  getRobinhoodTransactionFees: mocks.fees,
}))
vi.mock(
  'src/lib/hooks/react-query/cross-chain-trade/use-cross-chain-trade-step',
  () => ({
    useCrossChainTradeStep: () => ({
      data: {
        transactionRequest: {
          to: '0x0000000000000000000000000000000000000001',
          from: '0x0000000000000000000000000000000000000002',
          data: '0x1234',
          value: '5',
          gasPrice: '21452000',
        },
      },
      isError: false,
    }),
  }),
)
vi.mock('../../confirmation-dialog', () => ({
  StepState: { Sign: 'sign', NotStarted: 'not-started' },
}))
vi.mock('../../xswap-provider', () => ({
  useLifiXSwap: () => ({ state: { chainId0: mocks.chainId } }),
  useLifiXSwapSelectedTradeRoute: () => ({ data: {} }),
}))
vi.mock('./use-cross-chain-swap-trade-review-pre', () => ({
  useCrossChainSwapTradeReviewPre: () => ({
    routeRef: { current: null },
    groupTs: { current: undefined },
    setStepStates: mocks.setStepStates,
  }),
}))
vi.mock('./use-cross-chain-swap-trade-review-write-handlers', () => ({
  useCrossChainSwapTradeReviewWriteHandlers: () => ({
    onWriteError: mocks.onWriteError,
    onWriteSuccess: mocks.onWriteSuccess,
  }),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: mocks.address,
    chain: { id: mocks.chainId },
  }),
  usePublicClient: () => mocks.client,
  useEstimateGas: () => ({ data: 505_470n, isError: false, error: null }),
  useSendTransaction: () => ({
    mutateAsync: mocks.send,
    isPending: false,
    reset: vi.fn(),
  }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('LI.FI transaction fees', () => {
  let root: Root
  let container: HTMLDivElement
  let review: ReturnType<typeof useEvmCrossChainSwapTradeReview>
  const confirm = vi.fn()
  const fees = {
    type: 'eip1559',
    gasPrice: undefined,
    maxFeePerGas: 44_000_000n,
    maxPriorityFeePerGas: 1_000_000n,
  }

  function Harness() {
    review = useEvmCrossChainSwapTradeReview()
    return null
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.chainId = 4663
    mocks.address = '0x0000000000000000000000000000000000000002'
    mocks.fees.mockResolvedValue(fees)
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

  it('replaces the quoted gas price with fresh buffered Robinhood fees at submission', async () => {
    expect(mocks.fees).not.toHaveBeenCalled()

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(mocks.fees).toHaveBeenCalledWith(4663, mocks.client)
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        ...fees,
        chainId: 4663,
        gas: 505_470n,
        account: mocks.address,
      }),
    )
    expect(confirm).toHaveBeenCalledOnce()
  })

  it('preserves the quoted gas price on other chains', async () => {
    mocks.chainId = 1
    mocks.fees.mockResolvedValue(undefined)
    act(() => root.render(<Harness />))

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({ chainId: 1, gasPrice: 21_452_000n }),
    )
  })

  it('keeps submission pending and prevents duplicate sends while refreshing fees', async () => {
    const estimate = Promise.withResolvers<typeof fees>()
    mocks.fees.mockReturnValue(estimate.promise)
    let write: Promise<void> | undefined

    await act(async () => {
      write = review.write?.(confirm)
    })
    expect(review.isWritePending).toBe(true)

    await act(async () => {
      await review.write?.(confirm)
    })
    expect(mocks.fees).toHaveBeenCalledOnce()
    expect(mocks.send).not.toHaveBeenCalled()

    await act(async () => {
      estimate.resolve(fees)
      await write
    })
    expect(mocks.send).toHaveBeenCalledOnce()
    expect(review.isWritePending).toBe(false)
  })

  it.each(['fees', 'send'] as const)(
    'reports %s errors once and permits retrying',
    async (stage) => {
      const error = new Error('RPC unavailable')
      mocks[stage].mockRejectedValueOnce(error)

      await act(async () => {
        await review.write?.(confirm)
      })

      expect(mocks.onWriteError).toHaveBeenCalledOnce()
      expect(mocks.onWriteError).toHaveBeenCalledWith(error)
      expect(confirm).not.toHaveBeenCalled()
      expect(review.isWritePending).toBe(false)
      if (stage === 'fees') expect(mocks.send).not.toHaveBeenCalled()

      await act(async () => {
        await review.write?.(confirm)
      })
      expect(confirm).toHaveBeenCalledOnce()
    },
  )

  it.each(['account', 'chain'])(
    'does not submit the old quote if the connected %s changes while refreshing fees',
    async (changed) => {
      const estimate = Promise.withResolvers<typeof fees>()
      mocks.fees.mockReturnValue(estimate.promise)
      let write: Promise<void> | undefined

      await act(async () => {
        write = review.write?.(confirm)
      })
      if (changed === 'account')
        mocks.address = '0x0000000000000000000000000000000000000003'
      else mocks.chainId = 1
      act(() => root.render(<Harness />))

      await act(async () => {
        estimate.resolve(fees)
        await write
      })

      expect(mocks.send).not.toHaveBeenCalled()
      expect(mocks.onWriteError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'The connected wallet changed. Review the swap again.',
        }),
      )
      expect(confirm).not.toHaveBeenCalled()
      expect(review.isWritePending).toBe(false)
    },
  )
})

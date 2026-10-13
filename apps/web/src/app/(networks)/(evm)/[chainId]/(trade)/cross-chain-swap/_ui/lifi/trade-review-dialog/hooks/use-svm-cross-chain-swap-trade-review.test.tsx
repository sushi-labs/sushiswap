/* @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StepState } from '../../confirmation-dialog'
import type { useCrossChainSwapTradeReviewWriteHandlers } from './use-cross-chain-swap-trade-review-write-handlers'
import { useSvmCrossChainSwapTradeReview } from './use-svm-cross-chain-swap-trade-review'

type WriteHandlerParams = Parameters<
  typeof useCrossChainSwapTradeReviewWriteHandlers
>[0]

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  receipt: vi.fn(),
  confirm: vi.fn(),
  confirmOpen: false,
  selectedRoute: vi.fn(),
  onWriteSuccess: vi.fn(),
  onWriteError: vi.fn(),
  step: { transactionRequest: { data: 'AQID' } },
}))

vi.mock('@solana/connector', () => ({
  useTransactionSigner: () => ({ signer: {} }),
}))
vi.mock('src/lib/svm/hooks/use-svm-sign-and-send-transaction', () => ({
  useSvmSignAndSendTransaction: () => ({
    signAndSendTransaction: mocks.send,
  }),
}))
vi.mock('src/lib/svm/hooks/use-svm-estimate-gas', () => ({
  useSvmEstimateGas: () => ({ data: 5_000n, isError: false, error: null }),
}))
vi.mock('src/lib/svm/wait-for-svm-signature', () => ({
  waitForSvmSignature: vi.fn(),
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => '11111111111111111111111111111111',
}))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [0.5],
}))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogType: { Confirm: 'confirm', Review: 'review' },
  useDialog: (type: string) => ({
    open: type === 'confirm' ? mocks.confirmOpen : !mocks.confirmOpen,
    confirm: mocks.confirm,
  }),
}))
vi.mock(
  'src/lib/hooks/react-query/cross-chain-trade/use-cross-chain-trade-step',
  () => ({
    useCrossChainTradeStep: () => ({ data: mocks.step, isError: false }),
  }),
)
vi.mock('../../confirmation-dialog', () => ({
  StepState: {
    Sign: 'sign',
    NotStarted: 'not-started',
    Pending: 'pending',
    Success: 'success',
  },
}))
vi.mock('../../xswap-provider', () => ({
  useLifiXSwap: () => ({ state: { chainId0: 1151111081099710 } }),
  useLifiXSwapSelectedTradeRoute: () => ({ data: mocks.selectedRoute() }),
}))
vi.mock('./use-cross-chain-swap-trade-review-write-handlers', () => ({
  useCrossChainSwapTradeReviewWriteHandlers: (params: WriteHandlerParams) => ({
    onWriteSuccess: async (hash: unknown) => {
      mocks.onWriteSuccess(hash, params.routeRef.current)
      params.setStepStates({
        source: StepState.Pending,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })
      mocks.confirm()
      mocks.selectedRoute.mockReturnValue(undefined)
      await mocks.receipt()
      params.setStepStates({
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.NotStarted,
      })
    },
    onWriteError: mocks.onWriteError,
  }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('LI.FI Solana source confirmation', () => {
  let root: Root
  let container: HTMLDivElement
  let queryClient: QueryClient
  let review: ReturnType<typeof useSvmCrossChainSwapTradeReview>
  const route = { id: 'solana-route', step: mocks.step }

  function Harness() {
    review = useSvmCrossChainSwapTradeReview()
    return null
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.confirmOpen = false
    mocks.confirm.mockImplementation(() => {
      mocks.confirmOpen = true
    })
    mocks.selectedRoute.mockReturnValue(route)
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness />
        </QueryClientProvider>,
      )
    })
  })

  afterEach(() => {
    act(() => root.unmount())
    queryClient.clear()
    container.remove()
    vi.restoreAllMocks()
  })

  it('retains the submitted route during confirmation and stays closed after dismissal', async () => {
    const submission = Promise.withResolvers<{ base58TxSig: string }>()
    const receipt = Promise.withResolvers<void>()
    mocks.send.mockReturnValue(submission.promise)
    mocks.receipt.mockReturnValue(receipt.promise)
    let write: Promise<void> | undefined

    await act(async () => {
      write = review.write?.(mocks.confirm)
    })

    expect(review.routeRef.current).toBe(route)
    expect(review.stepStates.source).toBe(StepState.Sign)
    expect(mocks.confirm).not.toHaveBeenCalled()

    await act(async () => {
      submission.resolve({ base58TxSig: 'source-signature' })
    })

    expect(mocks.onWriteSuccess).toHaveBeenCalledWith('source-signature', route)
    expect(mocks.selectedRoute()).toBeUndefined()
    expect(review.routeRef.current).toBe(route)
    expect(review.stepStates.source).toBe(StepState.Pending)
    expect(mocks.confirmOpen).toBe(true)
    expect(mocks.confirm).toHaveBeenCalledOnce()

    mocks.confirmOpen = false
    await act(async () => {
      receipt.resolve()
      await write
    })

    expect(review.stepStates.source).toBe(StepState.Success)
    expect(mocks.confirm).toHaveBeenCalledOnce()
    expect(mocks.confirmOpen).toBe(false)
  })

  it('does not open confirmation when the wallet rejects submission', async () => {
    const error = new Error('User rejected the request')
    mocks.send.mockRejectedValue(error)
    vi.spyOn(console, 'log').mockImplementation(() => {})

    await act(async () => {
      await review.write?.(mocks.confirm)
    })

    expect(mocks.onWriteError).toHaveBeenCalledOnce()
    expect(mocks.onWriteError.mock.calls[0]?.[0]).toBe(error)
    expect(mocks.onWriteSuccess).not.toHaveBeenCalled()
    expect(mocks.confirm).not.toHaveBeenCalled()
    expect(mocks.confirmOpen).toBe(false)
  })
})

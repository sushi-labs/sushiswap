/* @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
  useMutation,
} from '@tanstack/react-query'
import { act, useRef, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  DialogProvider,
  DialogType,
  type UseDialog,
  useDialog,
} from 'src/lib/transaction-dialog/dialog-provider'
import { TransactionReceiptRevertedError } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StepState } from '../../confirmation-dialog'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../../xswap-provider'
import { useCrossChainSwapTradeReviewWriteHandlers } from './use-cross-chain-swap-trade-review-write-handlers'

const mocks = vi.hoisted(() => ({
  send: vi.fn<() => Promise<TxHashFor<1>>>(),
  waitForReceipt: vi.fn<(hash: TxHashFor<1>) => Promise<unknown>>(),
  setSwapAmount: vi.fn(),
  setTradeId: vi.fn(),
  refetch: vi.fn(),
  resetDetails: vi.fn(),
  createToast: vi.fn(),
  createErrorToast: vi.fn(),
  logger: vi.fn(),
}))

vi.mock('src/lib/transaction-dialog', async () =>
  vi.importActual('src/lib/transaction-dialog/dialog-provider'),
)
vi.mock('@sushiswap/notifications', () => ({
  createToast: mocks.createToast,
  createErrorToast: mocks.createErrorToast,
}))
vi.mock('@sushiswap/telemetry', () => ({
  SwapEventName: {},
  sendAnalyticsEvent: vi.fn(),
  useTrace: () => ({}),
}))
vi.mock('src/lib/drilldown-log', () => ({ sendDrilldownLog: vi.fn() }))
vi.mock('src/lib/logger', () => ({ logger: { error: mocks.logger } }))
vi.mock('src/lib/svm/rpc', () => ({ getSvmRpc: vi.fn() }))
vi.mock('src/lib/swap/cross-chain', () => ({
  getCrossChainFeesBreakdown: vi.fn(),
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => '0x0000000000000000000000000000000000000001',
}))
vi.mock(
  '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider',
  () => ({
    useDetailsInteractionTracker: () => ({
      state: { isDetailsCollapsed: true, wasDetailsTouched: false },
      mutate: { resetDetailsTrackedState: mocks.resetDetails },
    }),
  }),
)
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: mocks.refetch }),
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: () => ({ data: undefined }),
}))
vi.mock('../../confirmation-dialog', () => ({
  StepState: {
    Sign: 0,
    NotStarted: 1,
    Pending: 2,
    PartialSuccess: 3,
    Success: 4,
    Failed: 5,
  },
}))
vi.mock('../../xswap-provider', () => ({
  useLifiXSwap: () => ({
    state: { chainId0: 1, chainId1: 10 },
    mutate: {
      setSwapAmount: mocks.setSwapAmount,
      setTradeId: mocks.setTradeId,
    },
  }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const txHash: TxHashFor<1> = `0x${'1'.repeat(64)}`
const initialSteps = {
  source: StepState.NotStarted,
  bridge: StepState.NotStarted,
  dest: StepState.NotStarted,
}

describe('LI.FI source confirmation dialog', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let review: UseDialog<DialogType.Review>
  let confirmation: UseDialog<DialogType.Confirm>
  let stepStates: typeof initialSteps
  let mutation: ReturnType<typeof useMutation<TxHashFor<1>, Error, void>>

  function Harness() {
    review = useDialog(DialogType.Review)
    confirmation = useDialog(DialogType.Confirm)
    const [steps, setStepStates] = useState(initialSteps)
    stepStates = steps
    // Limit the route fixture to fields needed for source confirmation.
    const routeRef = useRef({
      toChainId: 10,
      step: { includedStepsWithoutFees: [{ type: 'cross' }] },
    } as UseLifiXSwapSelectedTradeRouteReturn<1, 10>)
    const groupTs = useRef<number | undefined>(undefined)
    const { onWriteSuccess, onWriteError } =
      useCrossChainSwapTradeReviewWriteHandlers<1, 10>({
        routeRef,
        groupTs,
        setStepStates,
        waitForReceipt: mocks.waitForReceipt,
        step: undefined,
        shouldIgnoreWriteError: (error) =>
          error.message === 'User rejected the request',
      })
    mutation = useMutation({
      mutationFn: mocks.send,
      onSuccess: onWriteSuccess,
      onError: onWriteError,
    })
    return null
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.send.mockResolvedValue(txHash)
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({
      defaultOptions: { mutations: { retry: false, gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => {
      root.render(
        <QueryClientProvider client={client}>
          <DialogProvider>
            <Harness />
          </DialogProvider>
        </QueryClientProvider>,
      )
    })
    act(() => review.setOpen(true))
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    vi.restoreAllMocks()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it.each([false, true])(
    'shows the pending source step before its receipt and preserves dismissal: %s',
    async (dismiss) => {
      const wallet = Promise.withResolvers<TxHashFor<1>>()
      const receipt = Promise.withResolvers<unknown>()
      mocks.send.mockReturnValue(wallet.promise)
      mocks.waitForReceipt.mockReturnValue(receipt.promise)
      let submitted: Promise<TxHashFor<1>> | undefined

      await act(async () => {
        submitted = mutation.mutateAsync()
      })
      expect(review.open).toBe(true)
      expect(confirmation.open).toBe(false)
      expect(mocks.waitForReceipt).not.toHaveBeenCalled()

      await act(async () => wallet.resolve(txHash))
      expect(review.open).toBe(false)
      expect(confirmation.open).toBe(true)
      expect(stepStates).toEqual({
        source: StepState.Pending,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })
      expect(mocks.waitForReceipt).toHaveBeenCalledWith(txHash)
      expect(mocks.setSwapAmount).toHaveBeenCalledWith('')
      expect(mutation.data).toBeUndefined()

      if (dismiss) act(() => confirmation.setOpen(false))

      await act(async () => {
        receipt.resolve({ status: 'success' })
        await submitted
      })
      expect(confirmation.open).toBe(!dismiss)
      expect(stepStates).toEqual({
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.NotStarted,
      })
      expect(mocks.refetch).toHaveBeenCalledWith(1)
    },
  )

  it('shows source failure without starting the bridge when the receipt reverts', async () => {
    const receipt = Promise.withResolvers<unknown>()
    mocks.waitForReceipt.mockReturnValue(receipt.promise)
    let submitted: Promise<TxHashFor<1>> | undefined
    await act(async () => {
      submitted = mutation.mutateAsync()
    })
    expect(confirmation.open).toBe(true)
    expect(stepStates.source).toBe(StepState.Pending)

    await act(async () => {
      receipt.reject(new TransactionReceiptRevertedError(txHash))
      await submitted
    })
    expect(confirmation.open).toBe(true)
    expect(stepStates).toEqual({
      source: StepState.Failed,
      bridge: StepState.NotStarted,
      dest: StepState.NotStarted,
    })
  })

  it('keeps the review open when the wallet rejects submission', async () => {
    const error = new Error('User rejected the request')
    mocks.send.mockRejectedValue(error)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    await act(async () => {
      await expect(mutation.mutateAsync()).rejects.toThrow(error)
    })
    expect(review.open).toBe(true)
    expect(confirmation.open).toBe(false)
    expect(mocks.waitForReceipt).not.toHaveBeenCalled()
    expect(mocks.setSwapAmount).not.toHaveBeenCalled()
    expect(mocks.createErrorToast).not.toHaveBeenCalled()
  })
})

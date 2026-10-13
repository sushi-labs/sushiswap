/* @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
  useMutation,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { EvmNative, USDC } from 'sushi/evm'
import type { TransactionReceipt } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEvmSimpleSwapTradeReview } from './use-evm-simple-swap-trade-review'

type Receipt = Pick<TransactionReceipt, 'status' | 'transactionHash' | 'from'>

const mocks = vi.hoisted(() => ({
  chainId: 4663,
  send: vi.fn<(transaction: unknown) => Promise<TxHashFor<1>>>(),
  errorToast: vi.fn(),
  sendDrilldownLog: vi.fn<() => Promise<void>>(),
  setSwapAmount: vi.fn(),
  refetchBalances: vi.fn(),
  client: {
    chain: { id: 4663 },
    estimateFeesPerGas: vi.fn(),
    waitForTransactionReceipt: vi.fn<() => Promise<Receipt>>(),
  },
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
vi.mock('src/lib/constants', () => ({
  APPROVE_TAG_SWAP: 'swap',
  NativeAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
}))
vi.mock('src/lib/drilldown-log', () => ({
  sendDrilldownLog: mocks.sendDrilldownLog,
}))
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
  useRefetchBalances: () => ({ refetchChain: mocks.refetchBalances }),
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
    mutate: { setSwapAmount: mocks.setSwapAmount },
  }),
}))
vi.mock('../use-evm-simple-swap-trade', () => ({
  useEvmSimpleSwapTrade: () => ({
    data: {
      amountIn: Amount.fromHuman(EvmNative.fromChainId(1), '1'),
      amountOut: Amount.fromHuman(USDC[1], '2000'),
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
  useSendTransaction: ({
    mutation,
  }: {
    mutation?: { onSuccess: (hash: TxHashFor<1>) => void | Promise<void> }
  } = {}) =>
    useMutation({
      mutationFn: (transaction: unknown) => mocks.send(transaction),
      onSuccess: mutation?.onSuccess,
    }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const receipt: Receipt = {
  status: 'success',
  transactionHash: '0x1234',
  from: '0x0000000000000000000000000000000000000001',
}

describe('simple swap transaction submission', () => {
  let root: Root
  let container: HTMLDivElement
  let queryClient: QueryClient
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

  function render() {
    act(() =>
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness />
        </QueryClientProvider>,
      ),
    )
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.chainId = 4663
    mocks.client.estimateFeesPerGas.mockResolvedValue(fees)
    mocks.client.waitForTransactionReceipt.mockResolvedValue(receipt)
    mocks.send.mockResolvedValue(receipt.transactionHash)
    mocks.sendDrilldownLog.mockResolvedValue(undefined)
    notifyManager.setNotifyFunction((callback) => act(callback))
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false, gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    render()
  })

  afterEach(() => {
    act(() => root.unmount())
    queryClient.clear()
    container.remove()
    vi.restoreAllMocks()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('opens confirmation on submission and shows success before telemetry finishes', async () => {
    mocks.chainId = 1
    render()
    const confirmation = Promise.withResolvers<Receipt>()
    const telemetry = Promise.withResolvers<void>()
    mocks.client.waitForTransactionReceipt.mockReturnValue(confirmation.promise)
    mocks.sendDrilldownLog.mockReturnValue(telemetry.promise)
    let submitted: Promise<void> | undefined
    let writeCompleted = false

    await act(async () => {
      submitted = review.write?.(confirm).then(() => {
        writeCompleted = true
      })
    })

    expect(confirm).toHaveBeenCalledOnce()
    expect(review.isWritePending).toBe(true)
    expect(review.txHash).toBe(receipt.transactionHash)
    expect(review.status).toBe('pending')
    expect(writeCompleted).toBe(false)
    expect(mocks.client.waitForTransactionReceipt).toHaveBeenCalledOnce()
    expect(mocks.sendDrilldownLog).not.toHaveBeenCalled()

    await act(async () => {
      await review.write?.(confirm)
    })
    expect(mocks.send).toHaveBeenCalledOnce()

    await act(async () => {
      confirmation.resolve(receipt)
      await submitted
    })

    expect(review.status).toBe('success')
    expect(review.isWritePending).toBe(false)
    expect(writeCompleted).toBe(true)
    expect(mocks.sendDrilldownLog).toHaveBeenCalledOnce()
    expect(mocks.setSwapAmount).toHaveBeenCalledWith('')
    expect(mocks.refetchBalances).toHaveBeenCalledWith(1)
    expect(confirm).toHaveBeenCalledOnce()

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await act(async () => telemetry.reject(new Error('Telemetry unavailable')))
    expect(warn).toHaveBeenCalledOnce()
    expect(review.status).toBe('success')
    expect(mocks.errorToast).not.toHaveBeenCalled()
  })

  it('shows a reverted receipt as an error after opening confirmation', async () => {
    const confirmation = Promise.withResolvers<Receipt>()
    mocks.client.waitForTransactionReceipt.mockReturnValue(confirmation.promise)

    await act(async () => {
      void review.write?.(confirm)
    })
    expect(confirm).toHaveBeenCalledOnce()
    expect(review.status).toBe('pending')

    await act(async () => {
      confirmation.resolve({ ...receipt, status: 'reverted' })
    })
    expect(review.status).toBe('error')
    expect(mocks.sendDrilldownLog).not.toHaveBeenCalled()
    expect(mocks.setSwapAmount).toHaveBeenCalledWith('')
    expect(mocks.refetchBalances).toHaveBeenCalledWith(4663)
  })

  it('handles a failed wallet submission without opening confirmation', async () => {
    mocks.send.mockRejectedValueOnce(new Error('Wallet unavailable'))

    await act(async () => {
      await review.write?.(confirm)
    })

    expect(confirm).not.toHaveBeenCalled()
    expect(review.isWritePending).toBe(false)
    expect(review.txHash).toBeUndefined()
    expect(mocks.client.waitForTransactionReceipt).not.toHaveBeenCalled()
    expect(mocks.errorToast).toHaveBeenCalledWith(
      'Wallet unavailable',
      false,
      'default',
    )
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
    render()

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

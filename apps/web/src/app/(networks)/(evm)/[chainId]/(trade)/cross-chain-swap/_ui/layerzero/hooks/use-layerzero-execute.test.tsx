/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { getLayerZeroCurrency } from 'src/lib/swap/layerzero/tokens'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { Amount } from 'sushi'
import type { Hex } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLayerZeroExecute } from './use-layerzero-execute'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './use-layerzero-executions'

const {
  useXswap,
  useApproved,
  writeContract,
  readContract,
  simulateContract,
  waitForReceipt,
  fetchQuote,
  checkRecipient,
  clearAmount,
  successToast,
  failedToast,
  infoToast,
  refetchChain,
} = vi.hoisted(() => ({
  useXswap: vi.fn(),
  useApproved: vi.fn(),
  writeContract: vi.fn(),
  readContract: vi.fn(),
  simulateContract: vi.fn(),
  waitForReceipt: vi.fn(),
  fetchQuote: vi.fn(),
  checkRecipient: vi.fn(),
  clearAmount: vi.fn(),
  successToast: vi.fn(),
  failedToast: vi.fn(),
  infoToast: vi.fn(),
  refetchChain: vi.fn(),
}))
vi.mock('../xswap-provider', () => ({ useLayerZeroXSwap: useXswap }))
vi.mock('src/lib/constants', () => ({
  APPROVE_TAG_XSWAP: 'xswap',
  TOAST_AUTOCLOSE_TIME: 5000,
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({ useApproved }))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: (chainId: number) =>
    chainId === -4
      ? 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
      : '0x000000000000000000000000000000000000dEaD',
}))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [{ toNumber: () => 0.005 }],
}))
vi.mock('./use-is-layerzero-xswap-maintenance', () => ({
  useIsLayerZeroXSwapMaintenance: () => ({ data: false }),
}))
vi.mock(
  '../../../../../../_common/ui/balance-provider/use-refetch-balances',
  () => ({ useRefetchBalances: () => ({ refetchChain }) }),
)
vi.mock('wagmi', () => ({
  usePublicClient: () => ({
    readContract,
    simulateContract,
    waitForTransactionReceipt: waitForReceipt,
  }),
  useWriteContract: () => ({ writeContractAsync: writeContract }),
}))
vi.mock('@sushiswap/notifications', () => ({
  createSuccessToast: successToast,
  createFailedToast: failedToast,
  createInfoToast: infoToast,
}))
vi.mock('src/lib/swap/layerzero/quote', async (importOriginal) => ({
  ...(await importOriginal<typeof import('src/lib/swap/layerzero/quote')>()),
  fetchLayerZeroQuote: fetchQuote,
}))
vi.mock('src/lib/swap/layerzero/stellar', () => ({
  assertStellarUsdt0Recipient: checkRecipient,
  buildStellarOftSend: vi.fn(),
}))
vi.mock('src/lib/wallet/namespaces/stellar/config', () => ({
  getStellarWalletKit: vi.fn(),
}))
vi.mock(
  'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client',
  () => ({ SorobanClient: {} }),
)
vi.mock(
  'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/transaction-helpers',
  () => ({ submitTransaction: vi.fn(), waitForTransaction: vi.fn() }),
)

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const txHash: Hex = `0x${'1'.repeat(64)}`
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

describe('LayerZero execution approval and submission safety', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let executions: LayerZeroExecutionState
  let execute: ReturnType<typeof useLayerZeroExecute>
  let currentQuote: LayerZeroQuote

  function Harness() {
    executions = useLayerZeroExecutions()
    useXswap.mockReturnValue({
      state: {
        chainId0: currentQuote.fromChainId,
        chainId1: currentQuote.toChainId,
        swapAmount: new Amount(
          getLayerZeroCurrency(currentQuote.fromChainId),
          currentQuote.amountIn,
        ),
      },
      mutate: { ...executions.mutate, clearSwapAmountIfUnchanged: clearAmount },
    })
    execute = useLayerZeroExecute()
    return null
  }

  function render() {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <Harness />
        </QueryClientProvider>,
      ),
    )
  }

  beforeEach(() => {
    vi.resetAllMocks()
    currentQuote = quote
    useApproved.mockReturnValue({ approved: true })
    readContract.mockResolvedValue(quote.amountIn)
    fetchQuote.mockResolvedValue(quote)
    writeContract.mockResolvedValue(txHash)
    waitForReceipt.mockResolvedValue({
      status: 'success',
      transactionHash: txHash,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ status: 'PENDING' })),
    )
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    render()
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    vi.unstubAllGlobals()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('requires the checker to pass before submitting', async () => {
    useApproved.mockReturnValue({ approved: false })
    render()
    await act(async () => {
      await expect(execute.mutateAsync({ id: 'first', quote })).rejects.toThrow(
        'Complete the swap checks',
      )
    })
    expect(executions.executions).toHaveLength(0)
    expect(writeContract).not.toHaveBeenCalled()
  })

  it('rechecks allowance and never performs an approval inside execution', async () => {
    readContract.mockResolvedValue(quote.amountIn - 1n)
    await act(async () => {
      await expect(execute.mutateAsync({ id: 'first', quote })).rejects.toThrow(
        'Approve the token before swapping',
      )
    })
    expect(readContract.mock.lastCall?.[0].functionName).toBe('allowance')
    expect(writeContract).not.toHaveBeenCalled()
    expect(executions.executions[0]?.sourceStatus).toBe('FAILED')
    expect(executions.isSubmitting).toBe(false)
  })

  it('sends once with the reviewed fee cap and minimum, then releases the source lock', async () => {
    fetchQuote.mockResolvedValue({
      ...quote,
      nativeFee: 900n,
      maxNativeFee: 990n,
      sendParam: { ...quote.sendParam, minAmountLD: 990_000n },
    })
    await act(async () => {
      await execute.mutateAsync({ id: 'first', quote })
    })
    expect(writeContract).toHaveBeenCalledTimes(1)
    expect(writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'send',
        value: quote.maxNativeFee,
        args: [
          quote.sendParam,
          { nativeFee: quote.maxNativeFee, lzTokenFee: 0n },
          quote.sourceAddress,
        ],
      }),
    )
    expect(simulateContract).toHaveBeenCalledOnce()
    expect(checkRecipient).toHaveBeenCalledWith(
      quote.recipient,
      quote.amountOut,
    )
    expect(clearAmount).toHaveBeenCalledWith(quote)
    expect(executions.executions[0]).toMatchObject({
      id: 'first',
      txHash,
      sourceStatus: 'SUCCESS',
      quote,
    })
    expect(executions.isSubmitting).toBe(false)
    expect(successToast).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: quote.fromChainId,
        account: quote.sourceAddress,
        href: `https://layerzeroscan.com/tx/${txHash}`,
      }),
    )
  })

  it('skips allowance reads for native OFTs that do not require approval', async () => {
    currentQuote = { ...quote, fromChainId: 42161 }
    fetchQuote.mockResolvedValue(currentQuote)
    render()
    await act(async () => {
      await execute.mutateAsync({ id: 'first', quote: currentQuote })
    })
    expect(readContract).not.toHaveBeenCalled()
    expect(writeContract.mock.lastCall?.[0].functionName).toBe('send')
  })

  it('preserves a broadcast hash and avoids a failure notification when confirmation times out', async () => {
    waitForReceipt.mockRejectedValue(new Error('RPC timeout'))
    await act(async () => {
      await expect(execute.mutateAsync({ id: 'first', quote })).rejects.toThrow(
        'RPC timeout',
      )
    })
    expect(executions.executions[0]).toMatchObject({
      txHash,
      sourceStatus: 'PENDING',
      error: 'RPC timeout',
    })
    expect(executions.isSubmitting).toBe(false)
    expect(failedToast).not.toHaveBeenCalled()
    expect(infoToast).toHaveBeenCalledWith(
      expect.objectContaining({
        txHash,
        href: `https://layerzeroscan.com/tx/${txHash}`,
      }),
    )
  })

  it('marks a confirmed source revert as failed while retaining its explorer hash', async () => {
    waitForReceipt.mockResolvedValue({
      status: 'reverted',
      transactionHash: txHash,
    })
    await act(async () => {
      await expect(execute.mutateAsync({ id: 'first', quote })).rejects.toThrow(
        'reverted or was cancelled',
      )
    })
    expect(executions.executions[0]).toMatchObject({
      txHash,
      sourceStatus: 'FAILED',
    })
    expect(infoToast).not.toHaveBeenCalled()
    expect(failedToast).toHaveBeenCalledWith(
      expect.objectContaining({ txHash }),
    )
  })

  it('keeps source confirmation tied to the submitted quote if the form changes', async () => {
    let finish:
      | ((receipt: { status: string; transactionHash: Hex }) => void)
      | undefined
    waitForReceipt.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    let completion: Promise<string> | undefined
    await act(async () => {
      completion = execute.mutateAsync({ id: 'first', quote })
      await vi.waitFor(() => expect(waitForReceipt).toHaveBeenCalled())
    })
    currentQuote = { ...quote, fromChainId: 42161, amountIn: 2_000_000n }
    render()
    await act(async () => {
      finish?.({ status: 'success', transactionHash: txHash })
      await completion
    })
    expect(executions.executions[0]?.quote).toEqual(quote)
    expect(refetchChain).toHaveBeenCalledWith(1)
    expect(successToast).toHaveBeenCalledWith(
      expect.objectContaining({ chainId: 1, account: quote.sourceAddress }),
    )
  })
})

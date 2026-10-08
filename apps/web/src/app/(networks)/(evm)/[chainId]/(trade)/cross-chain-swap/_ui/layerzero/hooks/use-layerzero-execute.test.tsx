/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  makeExecutionTrade,
  metadata,
  sender,
} from 'src/lib/swap/value-transfer/execution-test-fixtures'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { Amount } from 'sushi'
import type { Hex } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLayerZeroExecute } from './use-layerzero-execute'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './use-layerzero-executions'

const mocks = vi.hoisted(() => ({
  useXswap: vi.fn(),
  useApproved: vi.fn(),
  send: vi.fn(),
  estimate: vi.fn(),
  wait: vi.fn(),
  sign: vi.fn(),
  clear: vi.fn(),
  success: vi.fn(),
  failed: vi.fn(),
  info: vi.fn(),
  refetch: vi.fn(),
}))
vi.mock('../xswap-provider', () => ({ useLayerZeroXSwap: mocks.useXswap }))
vi.mock('src/lib/constants', () => ({
  APPROVE_TAG_XSWAP: 'xswap',
  TOAST_AUTOCLOSE_TIME: 5000,
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  useApproved: mocks.useApproved,
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
}))
vi.mock('./use-is-layerzero-xswap-maintenance', () => ({
  useIsLayerZeroXSwapMaintenance: () => ({ data: false }),
}))
vi.mock(
  '../../../../../../_common/ui/balance-provider/use-refetch-balances',
  () => ({ useRefetchBalances: () => ({ refetchChain: mocks.refetch }) }),
)
vi.mock('wagmi', () => ({
  usePublicClient: () => ({
    estimateGas: mocks.estimate,
    waitForTransactionReceipt: mocks.wait,
  }),
  useSendTransaction: () => ({ sendTransactionAsync: mocks.send }),
  useSignTypedData: () => ({ signTypedDataAsync: mocks.sign }),
}))
vi.mock('@sushiswap/notifications', () => ({
  createSuccessToast: mocks.success,
  createFailedToast: mocks.failed,
  createInfoToast: mocks.info,
}))
vi.mock('src/lib/svm/hooks/use-svm-sign-transaction', () => ({
  useSvmSignTransaction: () => ({ signTransaction: vi.fn() }),
}))
vi.mock('src/lib/svm/rpc', () => ({ getSvmRpc: vi.fn() }))
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
const fetchMock = vi.fn<typeof fetch>()

describe('Value Transfer sequential execution', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let executions: LayerZeroExecutionState
  let execute: ReturnType<typeof useLayerZeroExecute>
  let currentQuote: ValueTransferTrade

  function Harness() {
    executions = useLayerZeroExecutions()
    mocks.useXswap.mockReturnValue({
      state: {
        chainId0: currentQuote.fromChainId,
        chainId1: currentQuote.toChainId,
        swapAmount: new Amount(currentQuote.token0, currentQuote.amountIn),
        token0: currentQuote.token0,
        token1: currentQuote.token1,
      },
      mutate: { ...executions.mutate, clearSwapAmountIfUnchanged: mocks.clear },
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
    currentQuote = makeExecutionTrade()
    mocks.useApproved.mockReturnValue({ approved: true })
    mocks.estimate.mockResolvedValue(100_000n)
    mocks.send.mockResolvedValue(txHash)
    mocks.wait.mockResolvedValue({ status: 'success', transactionHash: txHash })
    mocks.sign.mockResolvedValue('0x1234')
    fetchMock.mockImplementation(async (url) => {
      if (String(url).endsWith('/build-user-steps'))
        return Response.json({ userSteps: currentQuote.quote.userSteps })
      if (String(url).endsWith('/metadata')) return Response.json(metadata)
      if (String(url).endsWith('/submit-signature')) return Response.json({})
      return Response.json({ status: 'PENDING' })
    })
    vi.stubGlobal('fetch', fetchMock)
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
    vi.restoreAllMocks()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('requires the existing checker before requesting execution', async () => {
    mocks.useApproved.mockReturnValue({ approved: false })
    render()
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('Complete the swap checks')
    })
    expect(executions.executions).toHaveLength(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rebuilds the reviewed quote and confirms approval before sending the bridge', async () => {
    await act(async () => {
      await execute.mutateAsync({ id: 'first', quote: currentQuote })
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cross-chain/value-transfer/build-user-steps',
      expect.objectContaining({
        body: JSON.stringify({ quoteId: currentQuote.quote.id }),
      }),
    )
    expect(mocks.send).toHaveBeenCalledTimes(2)
    expect(mocks.wait.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.send.mock.invocationCallOrder[1],
    )
    expect(mocks.send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        chainId: 8453,
        value: currentQuote.maxNativeFee,
        account: sender,
      }),
    )
    expect(executions.executions[0]).toMatchObject({
      txHash,
      sourceStatus: 'SUCCESS',
      submitted: true,
      quote: currentQuote,
    })
    expect(executions.isSubmitting).toBe(false)
  })

  it('does not send a bridge after approval failure', async () => {
    mocks.wait.mockResolvedValueOnce({
      status: 'reverted',
      transactionHash: txHash,
    })
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('reverted')
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
    expect(executions.executions[0]).toMatchObject({ sourceStatus: 'FAILED' })
    expect(executions.executions[0]?.txHash).toBeUndefined()
  })

  it('does not send when current-state simulation fails', async () => {
    mocks.estimate.mockRejectedValue(new Error('Insufficient balance'))
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('Insufficient balance')
    })
    expect(mocks.send).not.toHaveBeenCalled()
    expect(executions.isSubmitting).toBe(false)
  })

  it('retains a broadcast hash and uncertainty when source confirmation times out', async () => {
    mocks.wait
      .mockResolvedValueOnce({ status: 'success', transactionHash: txHash })
      .mockRejectedValueOnce(new Error('RPC timeout'))
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('RPC timeout')
    })
    expect(executions.executions[0]).toMatchObject({
      txHash,
      submitted: true,
      sourceStatus: 'PENDING',
    })
    expect(mocks.info).toHaveBeenCalledOnce()
    expect(mocks.failed).not.toHaveBeenCalled()
    act(() => {
      expect(executions.mutate.beginExecution('duplicate', currentQuote)).toBe(
        false,
      )
    })
  })

  it('tracks confirmed bridge reverts as failed', async () => {
    mocks.wait
      .mockResolvedValueOnce({ status: 'success', transactionHash: txHash })
      .mockResolvedValueOnce({ status: 'reverted', transactionHash: txHash })
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('reverted')
    })
    expect(executions.executions[0]).toMatchObject({
      txHash,
      sourceStatus: 'FAILED',
    })
    expect(mocks.failed).toHaveBeenCalledOnce()
  })

  it('submits Aori signatures after approval and tracks by quote ID without using the approval hash', async () => {
    currentQuote = makeExecutionTrade(true)
    render()
    await act(async () => {
      await execute.mutateAsync({ id: 'first', quote: currentQuote })
    })
    expect(mocks.send).toHaveBeenCalledTimes(1)
    expect(mocks.sign).toHaveBeenCalledWith(
      expect.objectContaining({ primaryType: 'Order', account: sender }),
    )
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cross-chain/value-transfer/submit-signature',
      expect.objectContaining({
        body: JSON.stringify({
          quoteId: currentQuote.quote.id,
          signatures: ['0x1234'],
        }),
      }),
    )
    expect(executions.executions[0]).toMatchObject({
      submitted: true,
      sourceStatus: 'SUCCESS',
    })
    expect(executions.executions[0]?.txHash).toBeUndefined()
  })

  it('retains signature submission uncertainty if its response is lost', async () => {
    currentQuote = makeExecutionTrade(true)
    const baseFetch = fetchMock.getMockImplementation()
    fetchMock.mockImplementation(async (...args) => {
      if (String(args[0]).endsWith('/submit-signature'))
        throw new Error('HTTP timeout')
      if (!baseFetch) throw new Error('Missing mock')
      return baseFetch(...args)
    })
    render()
    await act(async () => {
      await expect(
        execute.mutateAsync({ id: 'first', quote: currentQuote }),
      ).rejects.toThrow('HTTP timeout')
    })
    expect(executions.executions[0]).toMatchObject({
      submitted: true,
      sourceStatus: 'PENDING',
    })
    expect(mocks.info).toHaveBeenCalledOnce()
  })
})

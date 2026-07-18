import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import {
  fetchTransactionReceipt,
  transactionReceiptQueryKey,
} from './transaction-receipt-query'

const chainId = 1
const hash = '0xreceipt'

describe('transactionReceiptQueryOptions', () => {
  it('keys receipts by chain and transaction hash', () => {
    expect(transactionReceiptQueryKey(chainId, hash)).toEqual([
      'transactionReceipt',
      { chainId, hash },
    ])
  })

  it('retries non-terminal observation errors', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retryDelay: 0 } },
    })
    const receipt = { status: 'success' }
    const queryFn = vi
      .fn<() => Promise<typeof receipt>>()
      .mockRejectedValueOnce(new Error('RPC unavailable'))
      .mockResolvedValue(receipt)
    const onAttempt = vi.fn()
    const onRetry = vi.fn()

    await expect(
      fetchTransactionReceipt({
        queryClient,
        chainId,
        hash,
        queryFn,
        isTerminalError: () => false,
        onAttempt,
        onRetry,
      }),
    ).resolves.toBe(receipt)
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(onAttempt).toHaveBeenCalledTimes(2)
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not retry terminal receipt errors', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retryDelay: 0 } },
    })
    const terminalError = new Error('Transaction reverted')
    const queryFn = vi.fn().mockRejectedValue(terminalError)

    await expect(
      fetchTransactionReceipt({
        queryClient,
        chainId,
        hash,
        queryFn,
        isTerminalError: (error) => error === terminalError,
      }),
    ).rejects.toBe(terminalError)
    expect(queryFn).toHaveBeenCalledOnce()
  })

  it('deduplicates concurrent observers for the same receipt', async () => {
    const queryClient = new QueryClient()
    const receipt = { status: 'success' }
    let resolveReceipt: (value: typeof receipt) => void = () => {}
    const queryFn = vi.fn(
      () =>
        new Promise<typeof receipt>((resolve) => {
          resolveReceipt = resolve
        }),
    )
    const fetchReceipt = () =>
      fetchTransactionReceipt({
        queryClient,
        chainId,
        hash,
        queryFn,
        isTerminalError: () => false,
      })

    const firstObserver = fetchReceipt()
    const secondObserver = fetchReceipt()
    resolveReceipt(receipt)

    await expect(Promise.all([firstObserver, secondObserver])).resolves.toEqual(
      [receipt, receipt],
    )
    expect(queryFn).toHaveBeenCalledOnce()
  })
})

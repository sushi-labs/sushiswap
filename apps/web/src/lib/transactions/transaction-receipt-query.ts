import { type QueryClient, queryOptions } from '@tanstack/react-query'
import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'

type ReceiptChainId = EvmChainId | SvmChainId

interface FetchTransactionReceiptOptions<
  TChainId extends ReceiptChainId,
  TReceipt,
> {
  queryClient: QueryClient
  chainId: TChainId
  hash: TxHashFor<TChainId>
  queryFn: () => Promise<TReceipt>
  isTerminalError: (error: unknown) => boolean
  onAttempt?: () => void
  onRetry?: (error: unknown) => void
}

export function transactionReceiptQueryKey<TChainId extends ReceiptChainId>(
  chainId: TChainId,
  hash: TxHashFor<TChainId>,
) {
  return ['transactionReceipt', { chainId, hash }] as const
}

export function fetchTransactionReceipt<
  TChainId extends ReceiptChainId,
  TReceipt,
>({
  queryClient,
  chainId,
  hash,
  queryFn,
  isTerminalError,
  onAttempt,
  onRetry,
}: FetchTransactionReceiptOptions<TChainId, TReceipt>) {
  return queryClient.fetchQuery(
    queryOptions({
      queryKey: transactionReceiptQueryKey(chainId, hash),
      queryFn: async () => {
        onAttempt?.()
        try {
          return await queryFn()
        } catch (error) {
          if (!isTerminalError(error)) onRetry?.(error)
          throw error
        }
      },
      retry: (_failureCount, error) => !isTerminalError(error),
      staleTime: Number.POSITIVE_INFINITY,
    }),
  )
}

export function refetchTransactionReceipt<TChainId extends ReceiptChainId>(
  queryClient: QueryClient,
  chainId: TChainId,
  hash: TxHashFor<TChainId>,
) {
  return queryClient.refetchQueries(
    {
      queryKey: transactionReceiptQueryKey(chainId, hash),
      exact: true,
    },
    { cancelRefetch: false },
  )
}

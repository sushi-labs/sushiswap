'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getCowErrorMessage, logCowError } from 'src/lib/swap/cow/errors'
import { postCowCancellation } from 'src/lib/swap/cow/orderbook'
import { getCowOrdersQueryKey } from 'src/lib/swap/cow/query-keys'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { getCowCancellationTypedData } from 'src/lib/swap/cow/signing'
import { getCowInvalidateTransaction } from 'src/lib/swap/cow/transactions'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { usePublicClient, useSendTransaction, useSignTypedData } from 'wagmi'
import { toastCowOrder } from './cow-toast'

export interface CowCancelOrderState {
  busy: boolean
  error: string | undefined
  cancel(onchain: boolean): void
}

export function useCowCancelOrder(
  chainId: CowLimitChainId,
  order: CowOrder,
): CowCancelOrderState {
  const client = usePublicClient({ chainId })
  const { signTypedDataAsync } = useSignTypedData()
  const { sendTransactionAsync } = useSendTransaction()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (onchain: boolean): Promise<void> => {
      if (!client) throw new Error('Connect your wallet to continue.')
      if (onchain) {
        const hash = await sendTransactionAsync({
          ...getCowInvalidateTransaction(chainId, order.uid),
          account: order.owner,
          chainId,
        })
        await waitForSuccessfulReceipt(client, hash)
      } else {
        const signature = await signTypedDataAsync({
          ...(await getCowCancellationTypedData(chainId, order.uid)),
          account: order.owner,
        })
        await postCowCancellation(chainId, order.uid, signature)
      }
      toastCowOrder({
        chainId,
        owner: order.owner,
        uid: order.uid,
        summary: onchain
          ? 'Cancelled limit order'
          : 'Requested limit order cancellation',
      })
      await queryClient.invalidateQueries({
        queryKey: getCowOrdersQueryKey(chainId, order.owner),
      })
    },
    onError: (error) => logCowError(error, 'cancel-order'),
  })

  return {
    busy: mutation.isPending,
    error: mutation.error ? getCowErrorMessage(mutation.error) : undefined,
    cancel: (onchain) => mutation.mutate(onchain),
  }
}

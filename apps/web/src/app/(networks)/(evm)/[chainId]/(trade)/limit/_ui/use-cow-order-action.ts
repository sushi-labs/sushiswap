'use client'

import { OrderStatus, SigningScheme } from '@cowprotocol/cow-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import {
  CowUnsupportedSignatureError,
  getCowErrorMessage,
  logCowError,
} from 'src/lib/swap/cow/errors'
import {
  getCowOrder,
  getEditableCowOrder,
  postCowOrder,
} from 'src/lib/swap/cow/orderbook'
import { getCowOrdersQueryKey } from 'src/lib/swap/cow/query-keys'
import type { CowOrder, PreparedCowOrder } from 'src/lib/swap/cow/schema'
import { getCowOrderSignature, getCowTypedData } from 'src/lib/swap/cow/signing'
import {
  type CowTransactionRequest,
  getCowInvalidateTransaction,
  getCowPresignTransaction,
  getCowWrapTransaction,
} from 'src/lib/swap/cow/transactions'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import type { EvmAddress } from 'sushi/evm'
import { erc20Abi } from 'viem'
import { usePublicClient, useSendTransaction, useSignTypedData } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { toastCowOrder } from './cow-toast'

export interface CowReviewedOrder {
  prepared: PreparedCowOrder
  // The order being edited.
  previous: CowOrder | undefined
  // ECDSA orders are replaced in one step; others are cancelled on-chain first.
  atomicReplacement: boolean
  // Wrap the native amount the wrapped balance does not cover.
  wrapNative: boolean
}

// Completed steps, so a retry after a failure does not repeat them.
export interface CowOrderProgress {
  wrapped: boolean
  cancelled: boolean
  posted: boolean
}

const NO_PROGRESS: CowOrderProgress = {
  wrapped: false,
  cancelled: false,
  posted: false,
}

export interface CowOrderAction {
  review: CowReviewedOrder | undefined
  progress: CowOrderProgress
  error: string | undefined
  busy: boolean
  canPresign: boolean
  begin(review: CowReviewedOrder): void
  submit(onPlaced: () => void): void
  authorizeOnchain(onPlaced: () => void): void
  discard(): void
}

export function useCowOrderAction(
  chainId: CowLimitChainId,
  owner: EvmAddress | undefined,
): CowOrderAction {
  const [review, setReview] = useState<CowReviewedOrder>()
  const [progress, setProgress] = useState(NO_PROGRESS)
  const client = usePublicClient({ chainId })
  const { signTypedDataAsync } = useSignTypedData()
  const { sendTransactionAsync } = useSendTransaction()
  const { refetchChain } = useRefetchBalances()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (requestedPresign: boolean) => {
      if (!review || !client || !owner)
        throw new Error('Connect your wallet to continue.')
      const { prepared, previous, atomicReplacement, wrapNative } = review
      const { order } = prepared
      // Once a presigned order is posted, only its authorization is left.
      const presign = requestedPresign || progress.posted

      async function send(transaction: CowTransactionRequest): Promise<void> {
        const hash = await sendTransactionAsync({
          ...transaction,
          account: owner,
          chainId,
        })
        await waitForSuccessfulReceipt(client, hash)
      }

      function complete(step: Partial<CowOrderProgress>): void {
        setProgress((current) => ({ ...current, ...step }))
      }

      if (wrapNative && !progress.wrapped) {
        const balance = await client.readContract({
          address: order.sellToken,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [owner],
        })
        const missing = BigInt(order.sellAmount) - balance
        if (missing > 0n)
          await send(getCowWrapTransaction(order.sellToken, missing))
        complete({ wrapped: true })
        refetchChain(chainId)
      }

      if (previous && !progress.cancelled) {
        // The replacement is sized to what was left at review time.
        const latest = await getEditableCowOrder(chainId, previous.uid)
        if (
          latest.executedSellAmountBeforeFees !==
          previous.executedSellAmountBeforeFees
        )
          throw new Error(
            'More of the original order filled since your review. Go back and review the edit again.',
          )
        if (!atomicReplacement) {
          await send(getCowInvalidateTransaction(chainId, previous.uid))
          complete({ cancelled: true })
        }
      }

      if (previous && !atomicReplacement) {
        // Fills can still land while the cancellation is pending, and the
        // orderbook takes a moment to see the cancellation.
        let final = await getCowOrder(chainId, previous.uid)
        for (let attempt = 0; attempt < 5; attempt++) {
          if (final?.status !== OrderStatus.OPEN) break
          await new Promise((resolve) => setTimeout(resolve, 2_000))
          final = await getCowOrder(chainId, previous.uid)
        }
        if (final?.status === OrderStatus.OPEN)
          throw new Error(
            'The original order is cancelled. CoW is still updating its status; try again in a moment.',
          )
        if (
          final?.executedSellAmountBeforeFees !==
          previous.executedSellAmountBeforeFees
        )
          throw new Error(
            'More of the original order filled before it was cancelled. Place a new order for what remains.',
          )
      }

      if (presign) {
        if (!progress.posted) {
          await postCowOrder(prepared, owner, SigningScheme.PRESIGN)
          complete({ posted: true })
        }
        await send(getCowPresignTransaction(chainId, prepared.uid))
      } else {
        const { signature, scheme } = await getCowOrderSignature(
          prepared,
          await signTypedDataAsync({
            ...(await getCowTypedData(prepared)),
            account: owner,
          }),
        )
        // The orderbook only cancels the original for an ECDSA replacement.
        if (atomicReplacement && scheme !== SigningScheme.EIP712)
          throw new Error(
            'This wallet cannot replace the order in one step. Cancel the order, then place a new one.',
          )
        await postCowOrder(prepared, signature, scheme)
      }
    },
    onSuccess() {
      if (review)
        toastCowOrder({
          chainId,
          owner,
          uid: review.prepared.uid,
          summary: review.previous
            ? 'Replaced limit order'
            : 'Placed limit order',
        })
      refetchChain(chainId)
      void queryClient.invalidateQueries({
        queryKey: getCowOrdersQueryKey(chainId, owner),
      })
    },
    onError: (error) => logCowError(error, 'submit-order'),
  })

  function begin(next: CowReviewedOrder): void {
    mutation.reset()
    setProgress(NO_PROGRESS)
    setReview(next)
  }

  function discard(): void {
    mutation.reset()
    setProgress(NO_PROGRESS)
    setReview(undefined)
  }

  return {
    review,
    progress,
    error: mutation.error ? getCowErrorMessage(mutation.error) : undefined,
    busy: mutation.isPending,
    canPresign:
      progress.posted ||
      (mutation.error instanceof CowUnsupportedSignatureError &&
        !review?.atomicReplacement),
    begin,
    submit: (onPlaced) => mutation.mutate(false, { onSuccess: onPlaced }),
    authorizeOnchain: (onPlaced) =>
      mutation.mutate(true, { onSuccess: onPlaced }),
    discard,
  }
}

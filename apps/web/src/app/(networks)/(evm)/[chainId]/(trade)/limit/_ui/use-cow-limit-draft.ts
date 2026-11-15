'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { getOrderPrice, getRemainingSellAmount } from 'src/lib/swap/cow/amounts'
import {
  COW_DEFAULT_EXPIRATION,
  COW_NATIVE_BUY_ADDRESS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { getCowErrorMessage, logCowError } from 'src/lib/swap/cow/errors'
import { isEcdsaCowOrder, prepareCowOrder } from 'src/lib/swap/cow/order'
import { getEditableCowOrder } from 'src/lib/swap/cow/orderbook'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { type EvmAddress, EvmNative, isEvmAddressEqual } from 'sushi/evm'
import { formatUnits } from 'viem'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import type { CowLimitPricing } from './use-cow-limit-price'
import type { CowOrderAction } from './use-cow-order-action'

export interface CowLimitDraft {
  editing: CowOrder | undefined
  expiry: string
  setExpiry(value: string): void
  reviewing: boolean
  error: string | undefined
  edit(order: CowOrder): Promise<void>
  // Resolves whether an order was prepared for review.
  review(): Promise<boolean>
  stopEditing(): void
  discard(): void
}

export function useCowLimitDraft({
  chainId,
  owner,
  action,
  pricing,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  action: CowOrderAction
  pricing: CowLimitPricing
}): CowLimitDraft {
  const {
    state: { token0, token1 },
    mutate: { setTokens, setSwapAmount },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()
  const [expiry, setExpiry] = useState(String(COW_DEFAULT_EXPIRATION))
  const [editing, setEditing] = useState<CowOrder>()
  const task = useMutation({
    mutationFn: (run: () => Promise<boolean>) => run(),
    onError: (cause) => logCowError(cause, 'review-order'),
  })
  const prefilled = useRef<string | undefined>(undefined)
  const { sellAddress, buyAddress, sellAmount, buyAmount, resetPrice } = pricing

  // Populate only after metadata for the immutable pair has loaded.
  const pairMatchesEdit = Boolean(
    editing &&
      token0 &&
      buyAddress &&
      isEvmAddressEqual(token0.wrap().address, editing.sellToken) &&
      isEvmAddressEqual(buyAddress, editing.buyToken),
  )
  const { setLimitPrice } = pricing
  useEffect(() => {
    if (
      !editing ||
      !pairMatchesEdit ||
      !token0 ||
      !token1 ||
      prefilled.current === editing.uid
    )
      return
    prefilled.current = editing.uid
    setSwapAmount(formatUnits(getRemainingSellAmount(editing), token0.decimals))
    setLimitPrice(getOrderPrice(editing, token0, token1))
  }, [editing, pairMatchesEdit, token0, token1, setSwapAmount, setLimitPrice])

  function resetForm(): void {
    setEditing(undefined)
    setExpiry(String(COW_DEFAULT_EXPIRATION))
    resetPrice()
  }

  function startEditing(order: CowOrder): void {
    setEditing(order)
    prefilled.current = undefined
    setTokens(
      order.sellToken,
      isEvmAddressEqual(order.buyToken, COW_NATIVE_BUY_ADDRESS)
        ? EvmNative.fromChainId(chainId)
        : order.buyToken,
    )
    setExpiry('keep')
    resetPrice()
  }

  // Errors surface through `task.error`; the promise itself never rejects.
  async function withReviewing(run: () => Promise<boolean>): Promise<boolean> {
    return task.mutateAsync(run).catch(() => false)
  }

  async function edit(order: CowOrder): Promise<void> {
    await withReviewing(async () => {
      startEditing(await getEditableCowOrder(chainId, order.uid))
      return true
    })
  }

  function review(): Promise<boolean> {
    return withReviewing(async () => {
      if (!sellAddress || !buyAddress || !sellAmount || !buyAmount || !owner)
        return false
      // The original is already cancelled; reopen the pending replacement.
      if (
        editing &&
        action.progress.cancelled &&
        action.review?.previous?.uid === editing.uid
      )
        return true
      if (editing) {
        const latest = await getEditableCowOrder(chainId, editing.uid)
        if (
          latest.executedSellAmountBeforeFees !==
          editing.executedSellAmountBeforeFees
        ) {
          startEditing(latest)
          throw new Error(
            'More of this order filled. The remaining amount has been refreshed; review it again.',
          )
        }
      }

      // Only an EOA can sign an ECDSA order, and only those replace atomically.
      const atomicReplacement = Boolean(editing && isEcdsaCowOrder(editing))
      const prepared = await prepareCowOrder({
        chainId,
        owner,
        sellToken: sellAddress,
        buyToken: buyAddress,
        sellAmount,
        buyAmount,
        validTo:
          editing && expiry === 'keep'
            ? editing.validTo
            : Math.floor(Date.now() / 1000) + Number(expiry),
        replacedOrderUid: atomicReplacement ? editing?.uid : undefined,
      })

      // Without the atomic-replacement app data, an unchanged order gets the
      // original UID, which the on-chain cancellation invalidates for good.
      if (
        !atomicReplacement &&
        prepared.uid.toLowerCase() === editing?.uid.toLowerCase()
      )
        throw new Error(
          'Change the amount, price or expiry before replacing this order.',
        )
      action.begin({
        prepared,
        previous: editing,
        atomicReplacement,
        wrapNative: Boolean(token0?.isNative),
      })

      return true
    })
  }

  function discard(): void {
    action.discard()
    setSwapAmount('')
    resetForm()
  }

  return {
    editing,
    expiry,
    setExpiry,
    reviewing: task.isPending,
    error: task.error ? getCowErrorMessage(task.error) : undefined,
    edit,
    review,
    stopEditing: resetForm,
    discard,
  }
}

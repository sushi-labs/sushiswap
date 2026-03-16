'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  useCrossChainTradeSwap,
  useDerivedStateCrossChainSwap,
} from '../derivedstate-cross-chain-swap-provider'

export function TradeHeader() {
  const {
    state: { token0, token1, swapAmountString },
  } = useDerivedStateCrossChainSwap()
  const { data: swap } = useCrossChainTradeSwap()

  const amountOut = useMemo(() => {
    if (!swap?.quote || !token1) {
      return null
    }

    const amountOutRaw = Number.parseFloat(swap.quote.amountOut)
    const amountOutFormatted = amountOutRaw / 10 ** token1.decimals

    return amountOutFormatted.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })
  }, [swap, token1])

  return (
    <DialogHeader className="!text-left">
      <DialogTitle>
        {!amountOut ? (
          <SkeletonText fontSize="xs" className="w-2/3" />
        ) : (
          `Receive ${amountOut} ${token1?.symbol}`
        )}
      </DialogTitle>
      <DialogDescription>
        Swap {swapAmountString} {token0?.code}{' '}
      </DialogDescription>
    </DialogHeader>
  )
}

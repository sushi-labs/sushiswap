'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'
import { useCrossChainTradeQuote } from '../derivedstate-cross-chain-swap-provider'

export function TradeHeader() {
  const {
    state: { token0, token1, swapAmountString },
  } = useDerivedStateCrossChainSwap()
  const { data: quote } = useCrossChainTradeQuote()

  const amountOut = quote?.quote?.amountOut

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

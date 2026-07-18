'use client'

import type { RefObject } from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker'
import type { Percent } from 'sushi'

export type UseSimpleSwapTradeReviewBaseReturn = {
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  tradeRef: RefObject<UseEvmTradeReturn | UseSvmTradeReturn | null>
  write: ((confirm: () => void) => Promise<void>) | undefined
  isWritePending: boolean
  txHash: string | undefined
  status: 'pending' | 'success' | 'error' | 'unknown'
  retryReceipt?: () => void
  slippagePercent: Percent
  isSwapQueryFetching: boolean
  isSwapQuerySuccess: boolean
  isSwapQueryError: boolean
  swapQueryError: Error | null
  isWrap: boolean
  isUnwrap: boolean
}

export function getSimpleSwapTradeReview(
  tradeReview: UseSimpleSwapTradeReviewBaseReturn,
) {
  const trade = tradeReview.trade

  const isSwap = !tradeReview?.isWrap && !tradeReview?.isUnwrap

  const priceImpactSeverity = warningSeverity(trade?.priceImpact)
  const showPriceImpactWarning = priceImpactSeverity > 3
  const showSlippageWarning = !tradeReview.slippagePercent.lt(
    SLIPPAGE_WARNING_THRESHOLD,
  )

  return {
    ...tradeReview,
    isSwap,
    showPriceImpactWarning,
    priceImpactSeverity,
    showSlippageWarning,
  }
}

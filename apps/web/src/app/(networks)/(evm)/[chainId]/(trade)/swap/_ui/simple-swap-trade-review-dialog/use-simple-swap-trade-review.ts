'use client'

import { type Ref, type RefObject, useMemo } from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker'
import type { Percent } from 'sushi'
import { isSvmChainId } from 'sushi/svm'
import { useDerivedStateSimpleSwap } from '../derivedstate-simple-swap-provider'
import { useEvmSimpleSwapTradeReview } from './use-evm-simple-swap-trade-review'
import { useSvmSimpleSwapTradeReview } from './use-svm-simple-swap-trade-review'

export type UseSimpleSwapTradeReviewBaseReturn = {
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  tradeRef: RefObject<UseEvmTradeReturn | UseSvmTradeReturn | null>
  write: ((confirm: () => void) => Promise<void>) | undefined
  isWritePending: boolean
  txHash: string | undefined
  status: 'pending' | 'success' | 'error'
  slippagePercent: Percent
  isSwapQueryFetching: boolean
  isSwapQuerySuccess: boolean
  isSwapQueryError: boolean
  swapQueryError: Error | null
  isWrap: boolean
  isUnwrap: boolean
}

function useSimpleSwapTradeReviewBase(): UseSimpleSwapTradeReviewBaseReturn {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  const evmTradeReview = useEvmSimpleSwapTradeReview()
  const svmTradeReview = useSvmSimpleSwapTradeReview()

  if (isSvmChainId(chainId)) {
    return svmTradeReview
  }

  return evmTradeReview
}

export function useSimpleSwapTradeReview() {
  const evmTradeReview = useSimpleSwapTradeReviewBase()

  const tradeReview = evmTradeReview
  const trade = tradeReview.trade

  const isSwap = !tradeReview?.isWrap && !tradeReview?.isUnwrap

  const { showPriceImpactWarning, priceImpactSeverity } = useMemo(() => {
    const priceImpactSeverity = warningSeverity(trade?.priceImpact)
    return {
      showPriceImpactWarning: priceImpactSeverity > 3,
      priceImpactSeverity,
    }
  }, [trade?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !tradeReview.slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [tradeReview.slippagePercent])

  return {
    ...tradeReview,
    isSwap,
    showPriceImpactWarning,
    priceImpactSeverity,
    showSlippageWarning,
  }
}

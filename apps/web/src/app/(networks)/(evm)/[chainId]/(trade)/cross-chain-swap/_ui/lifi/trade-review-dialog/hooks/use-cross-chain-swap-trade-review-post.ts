import type { LifiXSwapSupportedChainId } from 'src/config'
import type {
  CrossChainSwapTradeReviewBase,
  CrossChainSwapTradeReviewWithWarnings,
} from '../types'
import { useCrossChainSwapTradeReviewPresentation } from './use-cross-chain-swap-trade-review-presentation'
import { useCrossChainSwapTradeReviewTracking } from './use-cross-chain-swap-trade-review-tracking'

export function useCrossChainSwapTradeReviewPost<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(
  tradeReview: CrossChainSwapTradeReviewBase<TChainId0, TChainId1>,
): CrossChainSwapTradeReviewWithWarnings<TChainId0, TChainId1> {
  const tracking = useCrossChainSwapTradeReviewTracking(tradeReview)
  const presentation = useCrossChainSwapTradeReviewPresentation(tradeReview)

  return { ...tradeReview, ...tracking, ...presentation }
}

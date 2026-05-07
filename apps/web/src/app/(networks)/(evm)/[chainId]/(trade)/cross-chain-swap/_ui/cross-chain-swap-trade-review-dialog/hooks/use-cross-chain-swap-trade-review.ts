'use client'

import type { LifiXSwapSupportedChainId } from 'src/config'
import type { EvmChainId } from 'sushi/evm'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import { useLifiXSwap } from '../../lifi-xswap-provider'
import type {
  CrossChainSwapTradeReviewBase,
  CrossChainSwapTradeReviewWithWarnings,
} from '../types'
import { useCrossChainSwapTradeReviewPost } from './use-cross-chain-swap-trade-review-post'
import { useEvmCrossChainSwapTradeReview } from './use-evm-cross-chain-swap-trade-review'
import { useSvmCrossChainSwapTradeReview } from './use-svm-cross-chain-swap-trade-review'

export function useCrossChainSwapTradeReview<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(): CrossChainSwapTradeReviewWithWarnings<TChainId0, TChainId1> {
  const {
    state: { chainId0 },
  } = useLifiXSwap<TChainId0, TChainId1>()

  const isSvm = isSvmChainId(chainId0)

  const evmTradeReview = useEvmCrossChainSwapTradeReview<
    EvmChainId & TChainId0,
    TChainId1
  >({ enabled: !isSvm })
  const svmTradeReview = useSvmCrossChainSwapTradeReview<
    SvmChainId & TChainId0,
    TChainId1
  >({ enabled: isSvm })

  const tradeReview = (
    isSvm ? svmTradeReview : evmTradeReview
  ) as CrossChainSwapTradeReviewBase<TChainId0, TChainId1>

  return useCrossChainSwapTradeReviewPost(tradeReview)
}

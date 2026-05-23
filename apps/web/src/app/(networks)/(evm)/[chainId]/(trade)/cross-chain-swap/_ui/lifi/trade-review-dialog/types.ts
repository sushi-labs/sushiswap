import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import type { Percent } from 'sushi'
import type { StepState } from '../confirmation-dialog'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../xswap-provider'

export type CrossChainSwapTradeReviewBase<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = {
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
  stepStates: { source: StepState; bridge: StepState; dest: StepState }
  hash: TxHashFor<TChainId0> | undefined
  routeRef: RefObject<UseLifiXSwapSelectedTradeRouteReturn<
    TChainId0,
    TChainId1
  > | null>
  tracking: {
    groupTs: RefObject<number | undefined>
    reset: () => void
    setStepStates: Dispatch<
      SetStateAction<{
        source: StepState
        bridge: StepState
        dest: StepState
      }>
    >
  }
  slippagePercent: Percent
  isWritePending: boolean
  write: ((confirm: () => void) => Promise<void>) | undefined
  isEstGasError: boolean
  estGasError: Error | null
  isStepQueryError: boolean
}

export type CrossChainSwapTradeReviewState<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = CrossChainSwapTradeReviewBase<TChainId0, TChainId1> & {
  lifiData:
    | {
        sending: { txHash: TxHashFor<TChainId0> }
        receiving?: { txHash: TxHashFor<TChainId1> }
        lifiExplorerLink?: string
        status?: string
        substatus?: string
      }
    | undefined
  amountOutUSD: string | undefined
  amountOutMinUSD: string | undefined
  price?: number
  isPriceLoading: boolean
}

export type CrossChainSwapTradeReviewWithWarnings<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = CrossChainSwapTradeReviewState<TChainId0, TChainId1> & {
  showPriceImpactWarning: boolean
  showSlippageWarning: boolean
  executionDuration: string | undefined
  totalFeesUSD: number | undefined
  chainId0Fees: string | undefined
  feesBreakdown: FeesBreakdown | undefined
}

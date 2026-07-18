import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import type { Percent } from 'sushi'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../xswap-provider'
import type {
  CrossChainSwapExecutionState,
  CrossChainSwapSubmission,
  StepState,
} from './cross-chain-swap-execution'

export type CrossChainSwapTradeReviewBase<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = {
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
  execution: CrossChainSwapExecutionState<TChainId0, TChainId1>
  submission: CrossChainSwapSubmission<TChainId0, TChainId1> | undefined
  stepStates: { source: StepState; bridge: StepState; dest: StepState }
  hash: TxHashFor<TChainId0> | undefined
  route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1> | undefined
  tracking: {
    completeLifi(submissionId: string, partial: boolean): void
  }
  slippagePercent: Percent
  isWritePending: boolean
  write: ((confirm: () => void) => Promise<void>) | undefined
  retryReceiptObservation: () => void
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

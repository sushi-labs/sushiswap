import { useEffect, useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { warningSeverity } from 'src/lib/swap/warning-severity'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/checker/slippage'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount } from 'sushi'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import {
  getLifiTrackingId,
  useSharedLifiTracking,
} from '../../tracking-context'
import { useLifiXSwap } from '../../xswap-provider'
import type {
  CrossChainSwapTradeReviewBase,
  CrossChainSwapTradeReviewWithWarnings,
} from '../types'
import { useLifiTracking } from './use-lifi-tracking'

export function useCrossChainSwapTradeReviewPost<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(
  tradeReview: CrossChainSwapTradeReviewBase<TChainId0, TChainId1>,
): CrossChainSwapTradeReviewWithWarnings<TChainId0, TChainId1> {
  const {
    state: { token1, chainId0, chainId1, tradeId },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const address = useAccount(chainId0)

  const { tracking, step } = tradeReview
  const { groupTs, reset } = tracking
  const sharedTracking = useSharedLifiTracking()
  const submittedSource = tradeReview.routeRef.current?.fromChainId ?? chainId0
  const trackingId =
    sharedTracking && tradeReview.hash
      ? getLifiTrackingId(submittedSource, tradeReview.hash)
      : tradeId
  const lifiData = useLifiTracking<TChainId0, TChainId1>({
    tradeId: trackingId,
    hash: tradeReview.hash,
    route: tradeReview.routeRef.current,
    chainId0,
    chainId1,
    account: address,
    groupTimestamp: groupTs.current,
    sourceState: tradeReview.stepStates.source,
    reset,
    setStepStates: tracking.setStepStates,
    enabled: !sharedTracking && Boolean(tradeId && tradeReview.hash),
    effectsEnabled: !sharedTracking,
  })
  useEffect(() => {
    if (!sharedTracking || !tradeReview.hash) return
    return sharedTracking.subscribeToCompletion(trackingId, reset)
  }, [sharedTracking, tradeReview.hash, trackingId, reset])

  const { showPriceImpactWarning } = useMemo(() => {
    const priceImpactSeverity = warningSeverity(tradeReview.step?.priceImpact)
    return {
      showPriceImpactWarning: priceImpactSeverity > 3,
      priceImpactSeverity,
    }
  }, [tradeReview.step?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !tradeReview.slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [tradeReview.slippagePercent])

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap().address,
  })

  const amountOutMinUSD = useMemo(() => {
    const amountOutMin = tradeReview.step?.amountOutMin
    if (!price || !amountOutMin) return undefined

    return `${(
      (price * Number(amountOutMin.amount)) /
        10 ** amountOutMin.currency.decimals
    ).toFixed(2)}`
  }, [price, tradeReview.step?.amountOutMin])

  const { executionDuration, feesBreakdown, totalFeesUSD, chainId0Fees } =
    useMemo(() => {
      if (!step)
        return {
          executionDuration: undefined,
          feesBreakdown: undefined,
          gasFeesUSD: undefined,
          protocolFeesUSD: undefined,
          totalFeesUSD: undefined,
        }

      const executionDurationSeconds = step.estimate.executionDuration
      const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

      const executionDuration =
        executionDurationSeconds < 60
          ? `${executionDurationSeconds} seconds`
          : `${executionDurationMinutes} minutes`

      const { feesBreakdown, totalFeesUSD } = getCrossChainFeesBreakdown(step)

      const chainId0Fees = (
        feesBreakdown.gas.get(chainId0)?.amount ??
        new Amount(nativeFromChainId(chainId0), 0)
      )
        .add(
          feesBreakdown.protocol.get(chainId0)?.amount ??
            new Amount(nativeFromChainId(chainId0), 0),
        )
        .toString()

      return {
        executionDuration,
        feesBreakdown,
        totalFeesUSD,
        chainId0Fees,
      }
    }, [chainId0, step])

  return {
    ...tradeReview,
    executionDuration,
    feesBreakdown,
    totalFeesUSD,
    chainId0Fees,
    lifiData,
    amountOutMinUSD,
    price,
    isPriceLoading,
    showPriceImpactWarning,
    showSlippageWarning,
  }
}

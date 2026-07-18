import { useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/slippage'
import { Amount } from 'sushi'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useLifiXSwap } from '../../xswap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'

export function useCrossChainSwapTradeReviewPresentation<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(tradeReview: CrossChainSwapTradeReviewBase<TChainId0, TChainId1>) {
  const {
    state: { token1, chainId0 },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const { step } = tradeReview

  const showPriceImpactWarning = useMemo(
    () => warningSeverity(step?.priceImpact) > 3,
    [step?.priceImpact],
  )
  const showSlippageWarning = useMemo(
    () => !tradeReview.slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD),
    [tradeReview.slippagePercent],
  )

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap().address,
  })

  const amountOutUSD = useMemo(() => {
    const amountOut = step?.amountOut
    if (!price || !amountOut) return undefined

    return `${(
      (price * Number(amountOut.amount)) / 10 ** amountOut.currency.decimals
    ).toFixed(2)}`
  }, [price, step?.amountOut])

  const amountOutMinUSD = useMemo(() => {
    const amountOutMin = step?.amountOutMin
    if (!price || !amountOutMin) return undefined

    return `${(
      (price * Number(amountOutMin.amount)) /
        10 ** amountOutMin.currency.decimals
    ).toFixed(2)}`
  }, [price, step?.amountOutMin])

  const { executionDuration, feesBreakdown, totalFeesUSD, chainId0Fees } =
    useMemo(() => {
      if (!step)
        return {
          executionDuration: undefined,
          feesBreakdown: undefined,
          totalFeesUSD: undefined,
          chainId0Fees: undefined,
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
    executionDuration,
    feesBreakdown,
    totalFeesUSD,
    chainId0Fees,
    amountOutUSD,
    amountOutMinUSD,
    price,
    isPriceLoading,
    showPriceImpactWarning,
    showSlippageWarning,
  }
}

'use client'

import { Currency, List, SkeletonText } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import { type Percent, ZERO, formatNumber, formatUSD } from 'sushi'
import { ReviewAmountValue } from '../../../../_ui/review-amount-value'
import { ReviewDetailRow } from '../../../../_ui/review-detail-row'
import { TradeAmounts } from '../../../../swap/_ui/simple-swap-trade-review-dialog/trade-amounts'
import { CrossChainSwapRouteView } from '../route-view'
import { useLifiXSwap } from '../xswap-provider'

export function TradeDetails({
  executionDuration,
  step,
  feesBreakdown,
  totalFeesUSD,
  amountOutMinUSD,
  isPriceLoading,
  slippagePercent,
}: {
  executionDuration?: string
  step?: UseCrossChainTradeStepReturn
  feesBreakdown?: FeesBreakdown
  totalFeesUSD?: number
  amountOutMinUSD?: string
  isPriceLoading: boolean
  slippagePercent: Percent
}): ReactElement {
  const {
    state: { chainId0, chainId1, swapAmount },
  } = useLifiXSwap()

  return (
    <div className="flex flex-col gap-2">
      <TradeAmounts
        amountIn={swapAmount}
        amountOut={step?.amountOut}
        amountInUSD={
          step?.amountIn?.currency.id === swapAmount?.currency.id &&
          step?.amountIn?.amount === swapAmount?.amount
            ? step?.estimate.fromAmountUSD
            : undefined
        }
        amountOutUSD={step?.estimate.toAmountUSD}
        isLoading={!step}
      />
      <List className="!pt-0 !gap-0">
        <List.Control className="border-transparent !bg-transparent !px-0">
          <ReviewDetailRow
            title="Price impact"
            explanation="The difference between the input and estimated output values, including fees deducted from the output. Source network fees are separate."
          >
            {!step ? (
              <span className="w-24">
                <SkeletonText align="right" fontSize="sm" />
              </span>
            ) : step.priceImpact ? (
              `${
                step.priceImpact.lt(ZERO)
                  ? '+'
                  : step.priceImpact.gt(ZERO)
                    ? '-'
                    : ''
              }${Math.abs(Number((step.priceImpact.toNumber() * 100).toFixed(2)))}%`
            ) : (
              'Unavailable'
            )}
          </ReviewDetailRow>
          <ReviewDetailRow
            title="Slippage tolerance"
            explanation="The percentage of slippage you are willing to accept. Slippage is the difference between the expected price and the actual price at which the trade is executed."
          >
            {slippagePercent.toPercentString()}
          </ReviewDetailRow>
          <ReviewDetailRow
            title="Minimum received"
            explanation="The minimum amount you are guaranteed to receive after slippage."
          >
            <ReviewAmountValue
              usdValue={amountOutMinUSD}
              isUsdLoading={isPriceLoading && !amountOutMinUSD}
            >
              {!step?.amountOutMin ? (
                <SkeletonText align="right" fontSize="sm" />
              ) : (
                <span className="flex items-center gap-1">
                  {step.amountOutMin.toSignificant(6)}
                  <Currency.Icon
                    currency={step.amountOutMin.currency}
                    width={16}
                    height={16}
                  />
                  {step.amountOutMin.currency.symbol}
                </span>
              )}
            </ReviewAmountValue>
          </ReviewDetailRow>
          {feesBreakdown && feesBreakdown.gas.size > 0 ? (
            <ReviewDetailRow
              title="Network fee"
              explanation="The transaction fee charged by the origin blockchain."
            >
              <FeeAmounts
                fees={feesBreakdown.gas}
                chainIds={[chainId0, chainId1]}
              />
            </ReviewDetailRow>
          ) : null}
          {feesBreakdown && feesBreakdown.protocol.size > 0 ? (
            <ReviewDetailRow
              title="Protocol fee"
              explanation="The fee charged by the bridge provider."
            >
              <FeeAmounts
                fees={feesBreakdown.protocol}
                chainIds={[chainId0, chainId1]}
              />
            </ReviewDetailRow>
          ) : null}
          <ReviewDetailRow title="Total fee">
            {totalFeesUSD === undefined || !feesBreakdown ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : Number.isFinite(totalFeesUSD) && totalFeesUSD >= 0 ? (
              formatUSD(totalFeesUSD)
            ) : (
              '-'
            )}
          </ReviewDetailRow>
          <ReviewDetailRow title="Estimated arrival">
            {!executionDuration ? (
              <SkeletonText align="right" fontSize="sm" />
            ) : (
              executionDuration
            )}
          </ReviewDetailRow>
        </List.Control>
      </List>
      {step ? (
        <div className="border border-accent rounded-2xl p-5">
          <CrossChainSwapRouteView step={step} />
        </div>
      ) : null}
    </div>
  )
}

function FeeAmounts({
  fees,
  chainIds,
}: {
  fees: FeesBreakdown['gas']
  chainIds: LifiXSwapSupportedChainId[]
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      {chainIds.map((chainId) => {
        const fee = fees.get(chainId)
        return fee ? (
          <ReviewAmountValue key={chainId} usdValue={fee.amountUSD}>
            <span>
              {formatNumber(fee.amount.toString())} {fee.amount.currency.symbol}
            </span>
          </ReviewAmountValue>
        ) : null
      })}
    </div>
  )
}

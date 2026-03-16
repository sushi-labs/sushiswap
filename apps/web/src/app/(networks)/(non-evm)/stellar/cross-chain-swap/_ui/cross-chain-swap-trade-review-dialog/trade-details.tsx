'use client'

import { List, SkeletonText, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatNumber, formatUSD } from 'sushi'
import {
  useCrossChainTradeQuote,
  useDerivedStateCrossChainSwap,
} from '../derivedstate-cross-chain-swap-provider'

export function TradeDetails() {
  const {
    state: { slippageTolerance },
  } = useDerivedStateCrossChainSwap()
  const { data: quote, isLoading } = useCrossChainTradeQuote()

  const executionDuration = quote?.quote?.timeEstimate
    ? `${Math.ceil(quote.quote.timeEstimate / 60)} min`
    : undefined

  return (
    <TradeSummaryList
      executionDuration={executionDuration}
      slippagePercent={slippageTolerance}
      isPriceLoading={isLoading}
    />
  )
}

function TradeSummaryList({
  executionDuration,
  slippagePercent,
  isPriceLoading,
}: {
  executionDuration?: string
  slippagePercent: import('sushi').Percent
  isPriceLoading: boolean
}) {
  const {
    state: { token0, token1, swapAmountString },
  } = useDerivedStateCrossChainSwap()
  const { data: quote } = useCrossChainTradeQuote()

  const { amountOut, amountOutUSD, minAmountOut, minAmountOutUSD } =
    useMemo(() => {
      if (!quote?.quote || !token1) {
        return {
          amountOut: null,
          amountOutUSD: null,
          minAmountOut: null,
          minAmountOutUSD: null,
        }
      }

      const amountOutRaw = Number.parseFloat(quote.quote.amountOut)
      const amountOutFormatted = amountOutRaw / 10 ** token1.decimals

      const minAmountOutRaw = Number.parseFloat(quote.quote.minAmountOut)
      const minAmountOutFormatted = minAmountOutRaw / 10 ** token1.decimals

      const amountOutUsdNum = Number.parseFloat(quote.quote.amountOutUsd)
      const minAmountOutUSDValue =
        (minAmountOutRaw / amountOutRaw) * amountOutUsdNum

      return {
        amountOut: amountOutFormatted.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        }),
        amountOutUSD: quote.quote.amountOutUsd,
        minAmountOut: minAmountOutFormatted.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        }),
        minAmountOutUSD: minAmountOutUSDValue.toString(),
      }
    }, [quote, token1])

  return (
    <List>
      <List.Control>
        <List.KeyValue title="Estimated arrival">
          {!executionDuration ? (
            <SkeletonText align="right" fontSize="sm" className="w-1/5" />
          ) : (
            `${executionDuration}`
          )}
        </List.KeyValue>
        <List.KeyValue title="From">
          {!swapAmountString ? (
            <SkeletonText align="right" fontSize="sm" className="w-1/5" />
          ) : (
            <span>
              {formatNumber(swapAmountString)} {token0?.code}
            </span>
          )}
        </List.KeyValue>
        <List.KeyValue
          title="Est. received"
          subtitle="The estimated output amount."
        >
          <div className="flex flex-col gap-0.5">
            {!amountOut ? (
              <SkeletonText align="right" fontSize="sm" className="w-1/2" />
            ) : (
              <span className="text-sm font-medium">{`${amountOut} ${token1?.symbol}`}</span>
            )}
            {!amountOutUSD ? (
              <SkeletonText
                align="right"
                fontSize="xs"
                className={classNames(
                  'w-1/4',
                  !isPriceLoading ? 'invisible' : '',
                )}
              />
            ) : (
              <span className="text-xs text-muted-foreground">
                {formatUSD(amountOutUSD)}
              </span>
            )}
          </div>
        </List.KeyValue>
        <List.KeyValue
          title={`Min. received after slippage (${slippagePercent.toPercentString()})`}
          subtitle="The minimum amount you are guaranteed to receive."
        >
          <div className="flex flex-col gap-0.5">
            {!minAmountOut ? (
              <SkeletonText align="right" fontSize="sm" className="w-1/2" />
            ) : (
              <span className="text-sm font-medium">{`${minAmountOut} ${token1?.symbol}`}</span>
            )}
            {!minAmountOutUSD ? (
              <SkeletonText
                align="right"
                fontSize="xs"
                className={classNames(
                  'w-1/4',
                  !isPriceLoading ? 'invisible' : '',
                )}
              />
            ) : (
              <span className="text-xs text-muted-foreground">
                {formatUSD(minAmountOutUSD)}
              </span>
            )}
          </div>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}

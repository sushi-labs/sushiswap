'use client'

import {
  Button,
  List,
  SelectIcon,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useState } from 'react'
import { formatNumber, formatUSD } from 'sushi'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'
import { useCrossChainTradeQuote } from '../derivedstate-cross-chain-swap-provider'

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
  const [showMore, setShowMore] = useState<boolean>(false)

  const amountOut = quote?.quote?.amountOut
  const amountOutUSD = quote?.quote?.amountOutUsd
  const minAmountOut = quote?.quote?.minAmountOut

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
        {showMore ? (
          <>
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
              </div>
            </List.KeyValue>
          </>
        ) : (
          <>
            <List.KeyValue title="From">
              {!swapAmountString ? (
                <SkeletonText align="right" fontSize="sm" className="w-1/5" />
              ) : (
                <span>
                  {formatNumber(swapAmountString)} {token0?.code}
                </span>
              )}
            </List.KeyValue>
            <List.KeyValue title="Est. received">
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
          </>
        )}

        <div className="p-3">
          <Button
            size="xs"
            fullWidth
            onClick={() => setShowMore(!showMore)}
            variant="ghost"
          >
            {showMore ? <SelectIcon className="rotate-180" /> : <SelectIcon />}
          </Button>
        </div>
      </List.Control>
    </List>
  )
}

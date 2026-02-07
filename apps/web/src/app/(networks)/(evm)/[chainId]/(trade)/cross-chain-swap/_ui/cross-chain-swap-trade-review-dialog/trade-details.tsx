'use client'

import {
  Button,
  List,
  SelectIcon,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useState } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import { type Percent, ZERO, formatNumber, formatUSD } from 'sushi'
import { CrossChainSwapRouteView } from '../cross-chain-swap-route-view'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'

export function TradeDetails({
  executionDuration,
  step,
  feesBreakdown,
  totalFeesUSD,
  chainId0Fees,
  amountOutUSD,
  amountOutMinUSD,
  isPriceLoading,
  slippagePercent,
}: {
  executionDuration?: string
  step?: UseCrossChainTradeStepReturn
  feesBreakdown?: FeesBreakdown
  totalFeesUSD?: number
  chainId0Fees?: string
  amountOutUSD?: string
  amountOutMinUSD?: string
  isPriceLoading: boolean
  slippagePercent: Percent
}) {
  return (
    <>
      <TradeSummaryList
        executionDuration={executionDuration}
        step={step}
        feesBreakdown={feesBreakdown}
        totalFeesUSD={totalFeesUSD}
        chainId0Fees={chainId0Fees}
        amountOutUSD={amountOutUSD}
        amountOutMinUSD={amountOutMinUSD}
        isPriceLoading={isPriceLoading}
        slippagePercent={slippagePercent}
      />
      {step && (
        <List className="!pt-2">
          <List.Control className="!p-5">
            <CrossChainSwapRouteView step={step} />
          </List.Control>
        </List>
      )}
    </>
  )
}

function TradeSummaryList<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>({
  executionDuration,
  step,
  feesBreakdown,
  totalFeesUSD,
  chainId0Fees,
  amountOutUSD,
  amountOutMinUSD,
  isPriceLoading,
  slippagePercent,
}: {
  executionDuration?: string
  step?: UseCrossChainTradeStepReturn
  feesBreakdown?: FeesBreakdown
  totalFeesUSD?: number
  chainId0Fees?: string
  amountOutUSD?: string
  amountOutMinUSD?: string
  isPriceLoading: boolean
  slippagePercent: Percent
}) {
  const {
    state: { chainId0, chainId1 },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()
  const [showMore, setShowMore] = useState<boolean>(false)

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
              title="Price impact"
              subtitle="The impact your trade has on the market price of this pool."
            >
              {!step?.priceImpact ? (
                <span className="w-24">
                  <SkeletonText align="right" fontSize="sm" />
                </span>
              ) : (
                `${
                  step.priceImpact.lt(ZERO)
                    ? '+'
                    : step.priceImpact.gt(ZERO)
                      ? '-'
                      : ''
                }${Math.abs(Number((step.priceImpact.toNumber() * 100).toFixed(2)))}%`
              )}
            </List.KeyValue>

            {feesBreakdown && feesBreakdown.gas.size > 0 ? (
              <List.KeyValue
                title="Network fee"
                subtitle="The transaction fee charged by the origin blockchain."
              >
                <div className="flex flex-col gap-1">
                  {feesBreakdown.gas.get(chainId0) ? (
                    <span>
                      {formatNumber(
                        feesBreakdown.gas.get(chainId0)!.amount.toString(),
                      )}{' '}
                      {feesBreakdown.gas.get(chainId0)!.amount.currency.symbol}{' '}
                      <span className="text-muted-foreground">
                        ({formatUSD(feesBreakdown.gas.get(chainId0)!.amountUSD)}
                        )
                      </span>
                    </span>
                  ) : null}
                  {feesBreakdown.gas.get(chainId1) ? (
                    <span>
                      {formatNumber(
                        feesBreakdown.gas.get(chainId1)!.amount.toString(),
                      )}{' '}
                      {feesBreakdown.gas.get(chainId1)!.amount.currency.symbol}{' '}
                      <span className="text-muted-foreground">
                        ({formatUSD(feesBreakdown.gas.get(chainId1)!.amountUSD)}
                        )
                      </span>
                    </span>
                  ) : null}
                </div>
              </List.KeyValue>
            ) : null}
            {feesBreakdown && feesBreakdown.protocol.size > 0 ? (
              <List.KeyValue
                title="Protocol fee"
                subtitle="The fee charged by the bridge provider."
              >
                <div className="flex flex-col gap-1">
                  {feesBreakdown.protocol.get(chainId0) ? (
                    <span>
                      {formatNumber(
                        feesBreakdown.protocol.get(chainId0)!.amount.toString(),
                      )}{' '}
                      {
                        feesBreakdown.protocol.get(chainId0)!.amount.currency
                          .symbol
                      }{' '}
                      <span className="text-muted-foreground">
                        (
                        {formatUSD(
                          feesBreakdown.protocol.get(chainId0)!.amountUSD,
                        )}
                        )
                      </span>
                    </span>
                  ) : null}
                  {feesBreakdown.protocol.get(chainId1) ? (
                    <span>
                      {formatNumber(
                        feesBreakdown.protocol.get(chainId1)!.amount.toString(),
                      )}{' '}
                      {
                        feesBreakdown.protocol.get(chainId1)!.amount.currency
                          .symbol
                      }{' '}
                      <span className="text-muted-foreground">
                        (
                        {formatUSD(
                          feesBreakdown.protocol.get(chainId1)!.amountUSD,
                        )}
                        )
                      </span>
                    </span>
                  ) : null}
                </div>
              </List.KeyValue>
            ) : null}
            <List.KeyValue
              title="Est. received"
              subtitle="The estimated output amount."
            >
              <div className="flex flex-col gap-0.5">
                {!step?.amountOut ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/2" />
                ) : (
                  <span className="text-sm font-medium">{`${step.amountOut.toSignificant(
                    6,
                  )} ${step.amountOut.currency.symbol}`}</span>
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
                {!step?.amountOutMin ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/2" />
                ) : (
                  <span className="text-sm font-medium">{`${step.amountOutMin.toSignificant(
                    6,
                  )} ${step.amountOutMin.currency.symbol}`}</span>
                )}
                {!amountOutMinUSD ? (
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
                    {formatUSD(amountOutMinUSD)}
                  </span>
                )}
              </div>
            </List.KeyValue>
          </>
        ) : (
          <>
            <List.KeyValue title="Total fee">
              {!totalFeesUSD || !feesBreakdown || chainId0Fees === undefined ? (
                <SkeletonText align="right" fontSize="sm" className="w-1/5" />
              ) : (
                <div className="flex flex-col gap-1">
                  <span>
                    {formatNumber(chainId0Fees)}{' '}
                    {feesBreakdown.gas.get(chainId0)!.amount.currency.symbol}{' '}
                    <span className="text-muted-foreground">
                      ({formatUSD(totalFeesUSD)})
                    </span>
                  </span>
                </div>
              )}
            </List.KeyValue>
            <List.KeyValue
              title="Est. received"
              subtitle="The estimated output amount."
            >
              <div className="flex flex-col gap-0.5">
                {!step?.amountOut ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/2" />
                ) : (
                  <span className="text-sm font-medium">{`${step.amountOut.toSignificant(
                    6,
                  )} ${step.amountOut.currency.symbol}`}</span>
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

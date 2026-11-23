'use client'

import {
  Currency,
  List,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { useMemo } from 'react'
import type { SupportedChainId } from 'src/config'
import { ReviewAmountValue } from 'src/lib/components/review-amount-value'
import { ReviewDetailRow } from 'src/lib/components/review-detail-row'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query/trade/types'
import { useAmountUsd } from 'src/lib/hooks/use-amount-usd'
import {
  type warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warning-severity'
import { ChainId, type Percent, ZERO, getChainById } from 'sushi'
import { EvmNative } from 'sushi/evm'
import { SvmNative, isSvmChainId } from 'sushi/svm'
import { TradeAmounts } from './trade-amounts'

export function TradeDetails<TChainId extends SupportedChainId>({
  chainId,
  trade,
  token1Symbol,
  slippagePercent,
  isSwap,
  priceImpactSeverity,
  isSwapQueryFetching,
}: {
  chainId: TChainId
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  token1Symbol?: string
  slippagePercent: Percent
  isSwap: boolean
  priceImpactSeverity: ReturnType<typeof warningSeverity>
  isSwapQueryFetching: boolean
}) {
  const nativeSymbol = useMemo(() => {
    if (isSvmChainId(chainId)) {
      return SvmNative.fromChainId(chainId).symbol
    }
    return EvmNative.fromChainId(chainId).symbol
  }, [chainId])
  const minimumUsd = useAmountUsd({
    amount: trade?.minAmountOut,
    enabled: isSwap,
  })

  return (
    <div className="flex flex-col gap-2">
      {isSwap ? (
        <TradeAmounts
          amountIn={trade?.amountIn}
          amountOut={trade?.amountOut}
          isLoading={isSwapQueryFetching}
        />
      ) : null}
      <List className="!pt-0 !gap-0">
        <List.Control
          className={classNames('border-transparent !bg-transparent !px-0')}
        >
          <ReviewDetailRow title="Network">
            <div className="flex items-center gap-1 ">
              <NetworkIcon chainId={chainId} className="w-4 h-4" />
              {getChainById(chainId as SupportedChainId).name}
            </div>
          </ReviewDetailRow>
          {isSwap && (
            <ReviewDetailRow
              title="Price impact"
              explanation={
                <div>
                  The impact your trade has on the market price of this pool.
                </div>
              }
            >
              <span
                className={classNames(
                  warningSeverityClassName(priceImpactSeverity),
                  'text-right',
                )}
              >
                {isSwapQueryFetching ? (
                  <SkeletonBox className="h-4 py-0.5 w-[60px] rounded-md" />
                ) : trade?.priceImpact ? (
                  `${
                    trade.priceImpact.lt(ZERO)
                      ? '+'
                      : trade.priceImpact.gt(ZERO)
                        ? '-'
                        : ''
                  }${Math.abs(Number(trade.priceImpact.toString({ fixed: 2 })))}%`
                ) : (
                  '-'
                )}
              </span>
            </ReviewDetailRow>
          )}
          {isSwap && trade?.tokenTax && (
            <ReviewDetailRow
              title="Token tax"
              explanation={
                <div>
                  Certain tokens incur a fee upon purchase or sale. Sushiswap
                  does not collect any of these fees.
                </div>
              }
            >
              <span className="text-right text-yellow">
                {trade.tokenTax.toPercentString()}
              </span>
            </ReviewDetailRow>
          )}
          {isSwap && (
            <>
              <ReviewDetailRow
                title="Slippage tolerance"
                explanation={
                  <div>
                    The percentage of slippage you are willing to accept.
                    Slippage is the difference between the expected price and
                    the actual price at which the trade is executed. The
                    transaction will revert if the price changes more than this
                    amount.
                  </div>
                }
              >
                {slippagePercent.toPercentString()}
              </ReviewDetailRow>
              <ReviewDetailRow
                title="Minimum received"
                explanation={
                  <div>
                    The minimum amount you are guaranteed to receive after
                    slippage:{' '}
                    {isSwapQueryFetching ? (
                      <SkeletonText align="right" fontSize="sm" />
                    ) : trade?.minAmountOut ? (
                      `${trade?.minAmountOut?.toSignificant(6)} ${token1Symbol}`
                    ) : (
                      '-'
                    )}
                  </div>
                }
              >
                <ReviewAmountValue
                  usdValue={minimumUsd.data}
                  isUsdLoading={isSwapQueryFetching || minimumUsd.isLoading}
                >
                  {isSwapQueryFetching ? (
                    <SkeletonText align="right" fontSize="sm" />
                  ) : trade?.minAmountOut ? (
                    <div className="flex items-center gap-1">
                      {trade?.minAmountOut?.toSignificant(6)}
                      <Currency.Icon
                        currency={trade?.minAmountOut?.currency}
                        width={16}
                        height={16}
                      />
                      {token1Symbol}
                    </div>
                  ) : (
                    '-'
                  )}
                </ReviewAmountValue>
              </ReviewDetailRow>
            </>
          )}
          <ReviewDetailRow title="Network fee">
            <ReviewAmountValue
              usdValue={
                chainId === ChainId.SKALE_EUROPA
                  ? undefined
                  : trade?.gasSpentUsd
              }
              isUsdLoading={
                chainId !== ChainId.SKALE_EUROPA &&
                (isSwapQueryFetching ||
                  !trade?.gasSpent ||
                  trade.gasSpent === '0')
              }
            >
              {chainId === ChainId.SKALE_EUROPA ? (
                'FREE'
              ) : isSwapQueryFetching ||
                !trade?.gasSpent ||
                trade.gasSpent === '0' ? (
                <SkeletonText align="right" fontSize="sm" />
              ) : (
                `${trade.gasSpent} ${nativeSymbol}`
              )}
            </ReviewAmountValue>
          </ReviewDetailRow>
        </List.Control>
      </List>
    </div>
  )
}

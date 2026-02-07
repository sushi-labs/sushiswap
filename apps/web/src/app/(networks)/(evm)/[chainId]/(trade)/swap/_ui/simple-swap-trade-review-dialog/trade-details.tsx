'use client'

import { List, SkeletonBox, SkeletonText, classNames } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import type { SupportedChainId } from 'src/config'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import {
  type warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { ChainId, type Percent, ZERO, getChainById } from 'sushi'
import { EvmNative } from 'sushi/evm'
import { SvmNative, isSvmChainId } from 'sushi/svm'

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

  return (
    <List className="!pt-0">
      <List.Control>
        <List.KeyValue title="Network">
          {getChainById(chainId as SupportedChainId).name}
        </List.KeyValue>
        {isSwap && (
          <List.KeyValue
            title="Price impact"
            subtitle="The impact your trade has on the market price of this pool."
          >
            <span
              className={classNames(
                warningSeverityClassName(priceImpactSeverity),
                'text-right',
              )}
            >
              {isSwapQueryFetching ? (
                <SkeletonBox className="h-4 py-0.5 w-[60px] rounded-md" />
              ) : trade ? (
                `${
                  trade.priceImpact?.lt(ZERO)
                    ? '+'
                    : trade.priceImpact?.gt(ZERO)
                      ? '-'
                      : ''
                }${Math.abs(Number(trade.priceImpact?.toString({ fixed: 2 })))}%`
              ) : (
                '-'
              )}
            </span>
          </List.KeyValue>
        )}
        {isSwap && trade?.tokenTax && (
          <List.KeyValue
            title="Token tax"
            subtitle="
                        Certain tokens incur a fee upon purchase or sale. Sushiswap does not collect any of these fees."
          >
            <span className="text-right text-yellow">
              {trade.tokenTax.toPercentString()}
            </span>
          </List.KeyValue>
        )}
        {isSwap && (
          <>
            <List.KeyValue
              title={`Max. received`}
              subtitle="The maximum amount you are guaranteed to receive."
            >
              {isSwapQueryFetching ? (
                <SkeletonText align="right" fontSize="sm" className="w-1/2" />
              ) : trade?.amountOut ? (
                `${trade?.amountOut?.toSignificant(6)} ${token1Symbol}`
              ) : (
                '-'
              )}
            </List.KeyValue>
            <List.KeyValue
              title={`Min. received after slippage (${slippagePercent.toPercentString()})`}
              subtitle="The minimum amount you are guaranteed to receive."
            >
              {isSwapQueryFetching ? (
                <SkeletonText align="right" fontSize="sm" className="w-1/2" />
              ) : trade?.minAmountOut ? (
                `${trade?.minAmountOut?.toSignificant(6)} ${token1Symbol}`
              ) : (
                '-'
              )}
            </List.KeyValue>
          </>
        )}
        <List.KeyValue title="Network fee">
          {chainId === ChainId.SKALE_EUROPA ? (
            'FREE'
          ) : isSwapQueryFetching ||
            !trade?.gasSpent ||
            trade.gasSpent === '0' ? (
            <SkeletonText align="right" fontSize="sm" className="w-1/3" />
          ) : (
            `${trade.gasSpent} ${nativeSymbol}`
          )}
        </List.KeyValue>
      </List.Control>
    </List>
  )
}

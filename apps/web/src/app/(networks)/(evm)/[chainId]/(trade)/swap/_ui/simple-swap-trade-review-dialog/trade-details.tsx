'use client'

import {
  Currency,
  Explainer,
  List,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { useMemo } from 'react'
import type { SupportedChainId } from 'src/config'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query/trade/types'
import {
  type warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warning-severity'
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
    <div className="flex flex-col gap-2">
      {isSwap ? (
        <List className="!pt-0">
          <List.Control
            className={classNames('!bg-transparent !rounded-2xl !py-2 !px-0')}
          >
            <List.KeyValue
              title={
                <div className="text-muted-foreground whitespace-nowrap">
                  You sell
                </div>
              }
              fontWeight="normal"
              className="!py-2"
              flex
            >
              <div className="flex items-center gap-1 text-lg">
                {isSwapQueryFetching ? (
                  <SkeletonText align="right" fontSize="lg" />
                ) : trade?.amountIn ? (
                  <div className="flex items-center gap-1">
                    {trade?.amountIn?.toSignificant(6)}
                    <Currency.Icon
                      currency={trade?.amountIn?.currency}
                      width={16}
                      height={16}
                    />
                    {trade?.amountIn?.currency.symbol}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </List.KeyValue>
            <List.KeyValue
              title={
                <div className="text-muted-foreground whitespace-nowrap">
                  Estimated received
                </div>
              }
              fontWeight="normal"
              className="!py-2"
              flex
            >
              <div className="flex items-center gap-1 text-lg">
                {isSwapQueryFetching ? (
                  <SkeletonText align="right" fontSize="lg" />
                ) : trade?.amountOut ? (
                  <div className="flex items-center gap-1">
                    {trade?.amountOut?.toSignificant(6)}
                    <Currency.Icon
                      currency={trade?.amountOut?.currency}
                      width={16}
                      height={16}
                    />
                    {trade?.amountOut?.currency.symbol}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </List.KeyValue>
          </List.Control>
        </List>
      ) : null}
      <List className="!pt-0 !gap-0">
        <List.Control
          className={classNames('border-transparent !bg-transparent !px-0')}
        >
          <List.KeyValue
            title={<div className="text-muted-foreground">Network</div>}
            fontWeight="normal"
            className="!py-1.5 !px-0"
          >
            <div className="flex items-center gap-1 ">
              <NetworkIcon chainId={chainId} className="w-4 h-4" />
              {getChainById(chainId as SupportedChainId).name}
            </div>
          </List.KeyValue>
          {isSwap && (
            <List.KeyValue
              className="!py-1.5 !px-0"
              fontWeight="normal"
              title={
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Price impact</span>
                  <Explainer>
                    <div>
                      The impact your trade has on the market price of this
                      pool.
                    </div>
                  </Explainer>
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
            </List.KeyValue>
          )}
          {isSwap && trade?.tokenTax && (
            <List.KeyValue
              className="!py-1.5 !px-0"
              title={
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Token tax</span>
                  <Explainer>
                    <div>
                      Certain tokens incur a fee upon purchase or sale.
                      Sushiswap does not collect any of these fees.
                    </div>
                  </Explainer>
                </div>
              }
              fontWeight="normal"
            >
              <span className="text-right text-yellow">
                {trade.tokenTax.toPercentString()}
              </span>
            </List.KeyValue>
          )}
          {isSwap && (
            <>
              <List.KeyValue
                className="!py-1.5 !px-0"
                fontWeight="normal"
                subtitle=""
                title={
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>Slippage tolerance</span>
                    <Explainer>
                      <div>
                        The percentage of slippage you are willing to accept.
                        Slippage is the difference between the expected price
                        and the actual price at which the trade is executed. The
                        transaction will revert if the price changes more than
                        this amount.
                      </div>
                    </Explainer>
                  </div>
                }
              >
                {slippagePercent.toPercentString()}
              </List.KeyValue>
              <List.KeyValue
                className="!py-1.5 !px-0"
                fontWeight="normal"
                title={
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>Minimum received</span>
                    <Explainer>
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
                    </Explainer>
                  </div>
                }
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
              </List.KeyValue>
            </>
          )}
          <List.KeyValue
            className="!py-1.5 !px-0"
            fontWeight="normal"
            title={<div className="text-muted-foreground">Network fee</div>}
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
          </List.KeyValue>
        </List.Control>
      </List>
    </div>
  )
}

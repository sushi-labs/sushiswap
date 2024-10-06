'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Collapsible, Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { FC } from 'react'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/AddressToEnsResolver'
import { Chain, ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../lib/swap/warningSeverity'
// import { TradeRoutePathView } from '../trade-route-path-view'
import { RouteDiagram } from '../route-diagram'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTrade,
} from './derivedstate-simple-swap-provider'

export const SimpleSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const isMounted = useIsMounted()
  const {
    state: { chainId, swapAmountString, recipient },
  } = useDerivedStateSimpleSwap()
  const { isLoading, data: trade } = useSimpleSwapTrade()
  const loading = Boolean(isLoading && !trade)

  return (
    <Collapsible
      open={+swapAmountString > 0 && trade?.route?.status !== 'NoWay'}
    >
      <div className="flex flex-col w-full gap-1 px-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              warningSeverityClassName(warningSeverity(trade?.priceImpact)),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {loading || !trade?.priceImpact ? (
              <SkeletonBox className="h-4 py-0.5 w-[40px]" />
            ) : trade?.priceImpact ? (
              `${
                trade?.priceImpact?.lessThan(ZERO)
                  ? '+'
                  : trade?.priceImpact?.greaterThan(ZERO)
                    ? '-'
                    : ''
              }${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%`
            ) : null}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {loading || !trade?.amountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${
                trade?.amountOut?.currency?.symbol ?? ''
              }`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {loading || !trade?.minAmountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${trade?.minAmountOut?.toSignificant(6) ?? '0.00'} ${
                trade?.amountOut?.currency?.symbol ?? ''
              }`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Fee (0.25%)
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {loading || !trade?.fee ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${trade?.fee}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {chainId === ChainId.SKALE_EUROPA ? (
              'FREE'
            ) : loading || !trade?.gasSpent || trade.gasSpent === '0' ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : trade?.gasSpent ? (
              `${trade.gasSpent} ${Native.onChain(chainId).symbol} ${
                trade?.gasSpentUsd ? `($${trade.gasSpentUsd})` : ''
              }`
            ) : null}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Routing source
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {loading || !trade ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              'SushiSwap API'
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Route
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {loading || !trade ? (
              <SkeletonBox className="h-4 py-0.5 w-[40px]" />
            ) : (
              // <TradeRoutePathView trade={trade}>
              //   <button
              //     type="button"
              //     className="text-sm font-semibold text-blue"
              //   >
              //     View
              //   </button>
              // </TradeRoutePathView>
              <RouteDiagram trade={trade}/>
            )}
          </span>
        </div>

        {recipient && isAddress(recipient) && isMounted && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200 dark:border-slate-200/5">
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Recipient
            </span>
            <span className="font-semibold text-right text-gray-700 dark:text-slate-400">
              <a
                target="_blank"
                href={Chain.from(chainId)?.getAccountUrl(recipient)}
                className={classNames(
                  address !== recipient
                    ? 'text-yellow-600'
                    : 'text-gray-700 dark:text-slate-300',
                  'transition-all flex gap-1 items-center',
                )}
                rel="noreferrer"
              >
                <AddressToEnsResolver address={recipient as Address}>
                  {({ isLoading, data }) => {
                    return (
                      <>
                        {isLoading || !data ? shortenAddress(recipient) : data}
                      </>
                    )
                  }}
                </AddressToEnsResolver>
                {address !== recipient && (
                  <Explainer>
                    Recipient is different from the connected wallet address. If
                    this is expected, ignore this warning.
                  </Explainer>
                )}
              </a>
            </span>
          </div>
        )}
      </div>
    </Collapsible>
  )
}

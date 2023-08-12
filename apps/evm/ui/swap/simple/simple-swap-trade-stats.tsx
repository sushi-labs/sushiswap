'use client'

import { Chain } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { UseTradeReturn } from '@sushiswap/react-query'
import { classNames } from '@sushiswap/ui'
import { Collapsible } from '@sushiswap/ui/components/animation/Collapsible'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { SkeletonBox, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { useAccount } from '@sushiswap/wagmi'
import { AddressToEnsResolver } from '@sushiswap/wagmi/future/components/Account/AddressToEnsResolver'
import { isAddress } from 'ethers/lib/utils'
import React, { FC } from 'react'

import { warningSeverity, warningSeverityClassName } from '../../../lib/swap/warningSeverity'
import { TradeRoutePathView } from '../trade-route-path-view'
import { useDerivedStateSimpleSwap, useSimpleSwapTrade } from './derivedstate-simple-swap-provider'

export const SimpleSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const {
    state: { chainId, swapAmountString, recipient },
  } = useDerivedStateSimpleSwap()
  const { isInitialLoading: isLoading, data: trade } = useSimpleSwapTrade()
  const loading = Boolean(isLoading && +swapAmountString > 0)

  return (
    <Collapsible open={+swapAmountString > 0 && trade?.route?.status !== 'NoWay'}>
      <div className="w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Price impact</span>
          <span
            className={classNames(
              warningSeverityClassName(warningSeverity(trade?.priceImpact)),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400'
            )}
          >
            {loading || !trade?.priceImpact ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : trade?.priceImpact ? (
              `${trade?.priceImpact?.lessThan(ZERO) ? '+' : trade?.priceImpact?.greaterThan(ZERO) ? '-' : ''}${Math.abs(
                Number(trade?.priceImpact?.toFixed(2))
              )}%`
            ) : null}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Est. received</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !trade?.amountOut ? (
              <SkeletonText fontSize="sm" className="w-[120px]" />
            ) : (
              `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${trade?.amountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Min. received</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !trade?.minAmountOut ? (
              <SkeletonText fontSize="sm" className="w-[120px]" />
            ) : (
              `${trade?.minAmountOut?.toSignificant(6) ?? '0.00'} ${trade?.amountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Network fee</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !trade?.gasSpent || trade.gasSpent === '0' ? (
              <SkeletonText fontSize="sm" className="w-[120px]" />
            ) : trade?.gasSpent ? (
              `${trade.gasSpent} ${Native.onChain(chainId).symbol}`
            ) : null}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Route</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? (
              <SkeletonText fontSize="sm" className="w-[120px]" />
            ) : (
              <TradeRoutePathView trade={trade as UseTradeReturn | undefined}>
                <button className="text-sm text-blue font-semibold">View</button>
              </TradeRoutePathView>
            )}
          </span>
        </div>
        {recipient && isAddress(recipient) && (
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
            <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Recipient</span>
            <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
              <a
                target="_blank"
                href={Chain.from(chainId).getAccountUrl(recipient)}
                className={classNames(
                  address !== recipient ? 'text-yellow-600' : 'text-gray-700 dark:text-slate-300',
                  'transition-all flex gap-1 items-center'
                )}
                rel="noreferrer"
              >
                <AddressToEnsResolver address={recipient}>
                  {({ isLoading, data }) => {
                    return <>{isLoading || !data ? shortenAddress(recipient) : data}</>
                  }}
                </AddressToEnsResolver>
                {address !== recipient && (
                  <Explainer>
                    Recipient is different from the connected wallet address. If this is expected, ignore this warning.
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

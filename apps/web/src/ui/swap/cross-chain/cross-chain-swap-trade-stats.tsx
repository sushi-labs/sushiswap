'use client'

import { Collapsible, Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { EvmChain } from 'sushi/chain'
import { formatUSD, shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import { isAddress } from 'viem'

import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/AddressToEnsResolver'
import { useAccount } from 'wagmi'
import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../lib/swap/warningSeverity'
import { CrossChainSwapFeesHoverCard } from './cross-chain-swap-fees-hover-card'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-context'

export const CrossChainSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const {
    state: { chainId0, chainId1, swapAmountString, recipient },
  } = useDerivedStateCrossChainSwap()
  const { isLoading, data: trade, isError } = useSelectedCrossChainTradeRoute()

  const feeData = useMemo(
    () => (trade?.step ? getCrossChainFeesBreakdown(trade.step) : undefined),
    [trade?.step],
  )

  return (
    <Collapsible open={+swapAmountString > 0 && !isError}>
      <div className="w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              warningSeverityClassName(warningSeverity(trade?.priceImpact)),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {isLoading || !trade?.priceImpact ? (
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

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !trade?.amountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${
                trade?.amountOut?.currency?.symbol ?? ''
              }`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !trade?.amountOutMin ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${trade?.amountOutMin?.toSignificant(6) ?? '0.00'} ${
                trade?.amountOut?.currency?.symbol ?? ''
              }`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Fee (0.25%)
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !feeData ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${formatUSD(feeData.uiFeesUSD)}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !feeData ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              <CrossChainSwapFeesHoverCard
                feesBreakdown={feeData.feesBreakdown}
                gasFeesUSD={feeData.gasFeesUSD}
                protocolFeesUSD={feeData.protocolFeesUSD}
                chainId0={chainId0}
                chainId1={chainId1}
              >
                <span className="underline decoration-dotted underline-offset-4 flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
                  {formatUSD(feeData.totalFeesUSD)}
                </span>
              </CrossChainSwapFeesHoverCard>
            )}
          </span>
        </div>

        {recipient && isAddress(recipient) && (
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
            <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
              Recipient
            </span>
            <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
              <a
                target="_blank"
                href={EvmChain.from(chainId1)?.getAccountUrl(recipient)}
                className={classNames(
                  address !== recipient
                    ? 'text-yellow-600'
                    : 'text-gray-700 dark:text-slate-300',
                  'transition-all flex gap-1 items-center',
                )}
                rel="noreferrer"
              >
                <AddressToEnsResolver address={recipient}>
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

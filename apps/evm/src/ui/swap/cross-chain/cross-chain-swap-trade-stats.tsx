'use client'

import {
  Tooltip,
  TooltipPrimitive,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { Collapsible } from '@sushiswap/ui/components/animation/Collapsible'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { SkeletonBox } from '@sushiswap/ui/components/skeleton'
import { useAccount } from '@sushiswap/wagmi'
import { AddressToEnsResolver } from '@sushiswap/wagmi/components/account/AddressToEnsResolver'
import React, { FC } from 'react'
import { Chain } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import { isAddress } from 'viem'

import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../lib/swap/warningSeverity'
import {
  useCrossChainSwapTrade,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const {
    state: { chainId0, chainId1, swapAmountString, recipient },
  } = useDerivedStateCrossChainSwap()
  const { isInitialLoading: isLoading, data: trade } = useCrossChainSwapTrade()
  const loading = Boolean(isLoading && !trade?.writeArgs)

  return (
    <Collapsible
      open={+swapAmountString > 0 && trade?.route?.status !== 'NoWay'}
    >
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

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !trade?.amountOut ? (
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
            {loading || !trade?.minAmountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${trade?.minAmountOut?.toSignificant(6) ?? '0.00'} ${
                trade?.amountOut?.currency?.symbol ?? ''
              }`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !trade?.gasSpent || trade.gasSpent === '0' ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : trade?.gasSpent ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
                      {trade.gasSpent} {Native.onChain(chainId0).symbol}
                    </span>
                  </TooltipTrigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      sideOffset={4}
                      className="border border-accent max-h-[var(--radix-popper-available-height)] z-50 w-80 bg-white/50 dark:bg-slate-800/50 paper rounded-xl p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 text-sm gap-3"
                    >
                      <div className="flex justify-between space-x-3 font-bold">
                        <div>Network Fee</div>
                        <div>
                          {trade.gasSpent} {Native.onChain(chainId0).symbol}
                        </div>
                      </div>
                      <div className="flex justify-between space-x-3 pl-6">
                        <div className="font-semibold">on Origin Chain</div>
                        <div className="font-bold">
                          {trade.srcGasFee} {Native.onChain(chainId0).symbol}
                        </div>
                      </div>
                      <div className="flex justify-between space-x-3 pl-6">
                        <div className="font-semibold">on Dest. Chain</div>
                        <div className="font-bold">
                          {trade.bridgeFee} {Native.onChain(chainId0).symbol}
                        </div>
                      </div>
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </Tooltip>
              </TooltipProvider>
            ) : null}
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
                href={Chain.from(chainId1)?.getAccountUrl(recipient)}
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

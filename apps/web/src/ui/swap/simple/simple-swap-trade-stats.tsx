'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Collapsible, Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/AddressToEnsResolver'
import { ZERO } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  getEvmChainById,
  shortenEvmAddress,
} from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../lib/swap/warningSeverity'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'

export const SimpleSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const isMounted = useIsMounted()
  const {
    state: { chainId0: chainId, swapAmountString, recipient },
  } = useDerivedStateSimpleSwap()
  const { isLoading, data: quote } = useSimpleSwapTradeQuote()
  const loading = Boolean(isLoading && !quote)

  return (
    <Collapsible
      open={+swapAmountString > 0 && quote?.route?.status !== 'NoWay'}
    >
      <div className="pt-4 w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              warningSeverityClassName(warningSeverity(quote?.priceImpact)),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {loading || !quote?.priceImpact ? (
              <SkeletonBox className="h-4 py-0.5 w-[40px]" />
            ) : quote?.priceImpact ? (
              `${
                quote?.priceImpact?.lt(ZERO)
                  ? '+'
                  : quote?.priceImpact?.gt(ZERO)
                    ? '-'
                    : ''
              }${Math.abs(Number(quote?.priceImpact?.toString({ fixed: 2 })))}%`
            ) : null}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Max. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !quote?.amountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              `${quote?.amountOut?.toSignificant(6) ?? '0.00'} ${quote?.amountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !quote?.minAmountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${quote?.minAmountOut?.toSignificant(6) ?? '0.00'} ${quote?.amountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Fee (0.25%)
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !quote?.fee ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${quote?.fee}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {chainId === EvmChainId.SKALE_EUROPA ? (
              'FREE'
            ) : loading || !quote?.gasSpent || quote.gasSpent === '0' ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : quote?.gasSpent ? (
              `${quote.gasSpent} ${EvmNative.fromChainId(chainId).symbol} ${
                quote?.gasSpentUsd ? `($${quote.gasSpentUsd})` : ''
              }`
            ) : null}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Routing source
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !quote ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              'SushiSwap API'
            )}
          </span>
        </div>

        {recipient && isAddress(recipient) && isMounted && (
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
            <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
              Recipient
            </span>
            <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
              <a
                target="_blank"
                href={getEvmChainById(chainId).getAccountUrl(recipient)}
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
                        {isLoading || !data
                          ? shortenEvmAddress(recipient)
                          : data}
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

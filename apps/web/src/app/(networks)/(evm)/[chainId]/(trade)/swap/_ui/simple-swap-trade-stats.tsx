'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Collapsible,
  Explainer,
  IconButton,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { useCallback, useState, type FC } from 'react'
import { logger } from 'src/lib/logger'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { Amount, ZERO, formatUSD } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  getEvmChainById,
  shortenEvmAddress,
} from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTokenRate } from './simple-swap-token-rate'

export const SimpleSwapTradeStats: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const {
    state: { chainId, swapAmountString, recipient, token0, token1 },
  } = useDerivedStateSimpleSwap()
  const { isLoading, data: quote } = useSimpleSwapTradeQuote()
  const { data: prices } = usePrices({ chainId })

  const loading = Boolean(isLoading && !quote)
  const hasValidQuote = Boolean(
    +swapAmountString > 0 && quote?.route?.status !== 'NoWay',
  )

  const handleToggleSimpleSwapTradeStatsCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
    if (!token0 || !token1 || !hasValidQuote || !isCollapsed) return
    const token0Usd = prices?.get(token0.wrap().address) ?? 0
    const swapAmountUsd = Amount.tryFromHuman(
      token0,
      swapAmountString,
    )?.mulHuman(token0Usd)

    logger.info('Expanded Simple Swap Details', {
      location: 'SimpleSwapTradeStats',
      action: 'handleToggleSimpleSwapTradeStatsCollapse',
      chainId: chainId,
      token0: token0.type === 'native' ? 'native' : token0.address,
      token0Symbol: token0.symbol,
      token1: token1.type === 'native' ? 'native' : token1.address,
      token1Symbol: token1.symbol,
      swapAmount: swapAmountString,
      swapAmountUsd:
        swapAmountUsd && token0Usd ? swapAmountUsd?.toString() : 'N/A',
      feeUsd: quote?.fee ? quote.fee : 'N/A',
      recipient: recipient ? recipient : 'N/A',
      timestamp: new Date().toISOString(),
    })
  }, [
    isCollapsed,
    chainId,
    token0,
    token1,
    recipient,
    quote,
    swapAmountString,
    hasValidQuote,
    prices,
  ])

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : !isMounted ? (
          <SkeletonText fontSize="sm" className="!w-[100px]" />
        ) : token0 && token1 && +swapAmountString > 0 ? (
          <SimpleSwapTokenRate />
        ) : null}
        {!hasValidQuote ? null : loading || !quote?.gasSpentUsd ? (
          <div className="flex items-center gap-1">
            <SkeletonBox className="h-5 py-0.5 w-[60px]" />
            <SkeletonBox className="h-6 py-0.5 w-[26px] !rounded-full" />
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'text-xs font-medium flex items-center, transition-opacity',
                isCollapsed ? 'opacity-100' : 'opacity-0',
              )}
            >
              <GasIcon className="inline-block w-3 h-4 mr-0.5" />
              {chainId === EvmChainId.SKALE_EUROPA
                ? 'FREE'
                : quote?.gasSpentUsd
                  ? `${formatUSD(quote.gasSpentUsd)}`
                  : null}
            </div>
            <IconButton
              icon={ChevronDownIcon}
              size="xs"
              name="Toggle Swap Details"
              onClick={handleToggleSimpleSwapTradeStatsCollapse}
              className={classNames(
                isCollapsed ? '' : 'rotate-180',
                'transition-transform',
              )}
              variant="ghost"
            />
          </div>
        )}
      </div>
      <Collapsible open={hasValidQuote && !isCollapsed}>
        <div className="pt-2 w-full flex flex-col gap-1">
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
                `${quote?.amountOut?.toSignificant(6) ?? '0.00'} ${
                  quote?.amountOut?.currency?.symbol ?? ''
                }`
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
                `${quote?.minAmountOut?.toSignificant(6) ?? '0.00'} ${
                  quote?.amountOut?.currency?.symbol ?? ''
                }`
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

          {recipient && isAddress(recipient) && (
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
                      Recipient is different from the connected wallet address.
                      If this is expected, ignore this warning.
                    </Explainer>
                  )}
                </a>
              </span>
            </div>
          )}
        </div>
      </Collapsible>
    </>
  )
}

'use client'

import {
  Collapsible,
  Explainer,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import React, { type FC, useEffect, useMemo } from 'react'
import { ZERO, formatUSD, shortenAddress } from 'sushi'
import { getEvmChainById } from 'sushi/evm'
import { isAddress } from 'viem'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import { UI_FEE_PERCENT } from 'src/config'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'wagmi'
import { useDetailsInteractionTracker } from '../../_ui/details-interaction-tracker-provider'
import { CrossChainSwapFeesHoverCard } from './cross-chain-swap-fees-hover-card'
import { CrossChainSwapTokenRate } from './cross-chain-swap-token-rate'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const {
    state: { chainId0, chainId1, swapAmountString, recipient },
  } = useDerivedStateCrossChainSwap()
  const { isLoading, data: trade, isError } = useSelectedCrossChainTradeRoute()
  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()
  const hasValidQuote = Boolean(+swapAmountString > 0 && !isError)
  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) {
      // Auto-collapse details when quote becomes invalid and reset state
      resetDetailsTrackedState()
    }
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  const feeData = useMemo(
    () => (trade?.step ? getCrossChainFeesBreakdown(trade.step) : undefined),
    [trade?.step],
  )

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : <CrossChainSwapTokenRate />}

        {!hasValidQuote ? null : isLoading || !feeData ? (
          <div className="flex items-center gap-0.5">
            <SkeletonText fontSize="sm" className="!w-[60px]" />
            <SkeletonCircle radius={26} />
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'text-xs font-medium flex items-center, transition-opacity',
                isDetailsCollapsed ? 'opacity-100' : 'opacity-0',
              )}
            >
              <GasIcon className="inline-block w-3 h-4 mr-0.5" />
              {formatUSD(feeData?.gasFeesUSD ?? 0)}
            </div>
            <TraceEvent
              events={[BrowserEvent.onClick]}
              name={InterfaceEventName.XSWAP_DETAILS_TOGGLE_CLICKED}
              element={InterfaceElementName.XSWAP_DETAILS_TOGGLE}
              properties={{
                detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
                feeUsd: feeData?.uiFeesUSD ? feeData?.uiFeesUSD : 'N/A',
                chainId0,
                chainId1,
              }}
            >
              <IconButton
                icon={ChevronDownIcon}
                size="xs"
                name="Toggle Swap Details"
                onClick={() => {
                  setIsDetailsCollapsed(!isDetailsCollapsed)
                  setWasDetailsTouched(true)
                }}
                className={classNames(
                  isDetailsCollapsed ? '' : 'rotate-180',
                  'transition-transform',
                )}
                variant="ghost"
              />
            </TraceEvent>
          </div>
        )}
      </div>
      <Collapsible open={hasValidQuote && !isDetailsCollapsed}>
        <div className="pt-2 w-full flex flex-col gap-1">
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
                  trade?.priceImpact?.lt(ZERO)
                    ? '+'
                    : trade?.priceImpact?.gt(ZERO)
                      ? '-'
                      : ''
                }${Math.abs(Number((trade?.priceImpact?.toNumber() * 100).toFixed(2)))}%`
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
              Fee ({UI_FEE_PERCENT}%)
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
                  href={getEvmChainById(chainId1).getAccountUrl(recipient)}
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
                          {isLoading || !data
                            ? shortenAddress(recipient)
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

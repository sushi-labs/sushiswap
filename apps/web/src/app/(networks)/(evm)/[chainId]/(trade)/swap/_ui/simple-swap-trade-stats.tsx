'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { useIsMounted } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Collapsible,
  Explainer,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { useEffect, type FC } from 'react'
import { UI_FEE_PERCENT } from 'src/config'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { ZERO, formatUSD } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  getEvmChainById,
  shortenEvmAddress,
} from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useDetailsInteractionTracker } from '../../_ui/details-interaction-tracker-provider'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTokenRate } from './simple-swap-token-rate'

export const SimpleSwapTradeStats: FC = () => {
  const { address } = useAccount()
  const {
    state: { chainId, swapAmountString, recipient },
  } = useDerivedStateSimpleSwap()
  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()
  const { isLoading, data: quote } = useSimpleSwapTradeQuote()

  const loading = Boolean(isLoading && !quote)
  const hasValidQuote = Boolean(
    +swapAmountString > 0 && quote?.route?.status !== 'NoWay',
  )

  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) {
      // Auto-collapse details when quote becomes invalid and reset state
      resetDetailsTrackedState()
    }
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : <SimpleSwapTokenRate />}
        {!hasValidQuote ? null : loading || !quote?.gasSpentUsd ? (
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
              {chainId === EvmChainId.SKALE_EUROPA
                ? 'FREE'
                : quote?.gasSpentUsd
                  ? `${formatUSD(quote.gasSpentUsd)}`
                  : null}
            </div>
            <TraceEvent
              events={[BrowserEvent.onClick]}
              name={InterfaceEventName.SWAP_DETAILS_TOGGLE_CLICKED}
              element={InterfaceElementName.SWAP_DETAILS_TOGGLE}
              properties={{
                detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
                feeUsd: quote?.fee ? quote.fee : 'N/A',
                chainId,
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
              Fee ({UI_FEE_PERCENT}%)
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

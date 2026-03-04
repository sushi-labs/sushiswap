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
import React, { useEffect } from 'react'
import { formatUSD, getChainById, shortenAddress } from 'sushi'
import { isAddress } from 'viem'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet'
import { useDetailsInteractionTracker } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import {
  useCrossChainTradeQuote,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapTradeStats() {
  const {
    state: { swapAmountString, recipient, slippageTolerance, token1, chainId1 },
  } = useDerivedStateCrossChainSwap()
  const { isLoading, data: quote, isError } = useCrossChainTradeQuote()
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

  const address = useAccount(chainId1)

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : (
          <div className="flex items-center gap-0.5">
            <SkeletonText fontSize="sm" className="!w-[60px]" />
          </div>
        )}

        {!hasValidQuote ? null : isLoading ? (
          <div className="flex items-center gap-0.5">
            <SkeletonText fontSize="sm" className="!w-[60px]" />
            <SkeletonCircle radius={26} />
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'text-xs font-medium flex items-center transition-opacity',
                isDetailsCollapsed ? 'opacity-100' : 'opacity-0',
              )}
            >
              <GasIcon className="inline-block w-3 h-4 mr-0.5" />
              {formatUSD(0)}
            </div>
            <TraceEvent
              events={[BrowserEvent.onClick]}
              name={InterfaceEventName.XSWAP_DETAILS_TOGGLE_CLICKED}
              element={InterfaceElementName.XSWAP_DETAILS_TOGGLE}
              properties={{
                detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
                feeUsd: 'N/A',
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
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading ? (
                <SkeletonBox className="h-4 py-0.5 w-[40px]" />
              ) : (
                '-'
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Est. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !quote?.quote?.amountOut ? (
                <SkeletonBox className="h-4 py-0.5 w-[120px]" />
              ) : (
                `${quote.quote.amountOut} ${token1?.symbol ?? ''}`
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Min. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !quote?.quote?.minAmountOut ? (
                <SkeletonBox className="h-4 py-0.5 w-[100px]" />
              ) : (
                `${quote.quote.minAmountOut} ${token1?.symbol ?? ''}`
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Slippage Tolerance
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {slippageTolerance.toSignificant(2)}%
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
                  href={getChainById(chainId1).getAccountUrl(recipient)}
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

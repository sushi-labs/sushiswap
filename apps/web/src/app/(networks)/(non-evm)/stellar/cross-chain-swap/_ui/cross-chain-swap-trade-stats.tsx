'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { Collapsible, IconButton, classNames } from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import { useState } from 'react'
import { formatUSD } from 'sushi'
import { useStellarCrossChainSwap } from './cross-chain-swap-provider'

export function CrossChainSwapTradeStats() {
  const {
    state: { swapAmountString, slippageTolerance },
  } = useStellarCrossChainSwap()

  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)
  const hasValidQuote = Boolean(+swapAmountString > 0)

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : (
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'text-xs font-medium flex items-center, transition-opacity',
                isDetailsCollapsed ? 'opacity-100' : 'opacity-0',
              )}
            >
              <GasIcon className="inline-block w-3 h-4 mr-0.5" />
              {formatUSD(0)}
            </div>
            <IconButton
              icon={ChevronDownIcon}
              size="xs"
              name="Toggle Swap Details"
              onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
              className={classNames(
                isDetailsCollapsed ? '' : 'rotate-180',
                'transition-transform',
              )}
              variant="ghost"
            />
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
              0%
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Est. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              0
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Min. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              0
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
        </div>
      </Collapsible>
    </>
  )
}

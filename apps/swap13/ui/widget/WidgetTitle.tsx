'use client'

import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { AppType } from '@sushiswap/ui13/types'
import React, { useState } from 'react'

import { NetworkSelectorDialog } from '../NetworkSelectorDialog'
import { useSwapActions, useSwapState } from '../TradeProvider'

export const WidgetTitle = () => {
  const [invert, setInvert] = useState(false)
  const { appType, network0, network1, token1, token0 } = useSwapState()
  const { setNetwork1, setNetwork0 } = useSwapActions()

  return (
    <div className="flex flex-col gap-2 mb-4">
      {appType === AppType.Swap ? (
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-slate-200">Sell {token0.symbol}</h1>
      ) : (
        <>
          <h1 className="flex items-center gap-3 text-4xl font-semibold text-gray-900 dark:text-slate-200">
            Sell {token0.symbol} on <NetworkSelectorDialog selected={network0} onSelect={setNetwork0} />
          </h1>
          <h1 className="flex items-center gap-3 text-4xl font-semibold text-gray-900 dark:text-slate-200">
            Receive {token1.symbol} on <NetworkSelectorDialog selected={network1} onSelect={setNetwork1} />
          </h1>
        </>
      )}
      <button
        onClick={() => setInvert((invert) => !invert)}
        className="text-sm flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        <ArrowTrendingUpIcon width={16} height={16} />1 {invert ? token1.symbol : token0.symbol} = 0.05{' '}
        {invert ? token0.symbol : token1.symbol}
      </button>
    </div>
  )
}

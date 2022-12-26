'use client'

import { ArrowTrendingUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button } from '@sushiswap/ui13/components/button'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { NetworkSelector } from '@sushiswap/ui13/components/networkselector'
import { AppType } from '@sushiswap/ui13/types'
import React, { useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
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
            Sell {token0.symbol} on{' '}
            <NetworkSelector networks={SUPPORTED_CHAIN_IDS} variant="dialog" selected={network0} onSelect={setNetwork0}>
              {({ selected, setOpen }) => (
                <Button onClick={() => setOpen(true)} variant="outlined" color="default" size="xl" className="!px-3">
                  <NetworkIcon chainId={selected} width={32} height={32} />
                  <ChevronDownIcon width={36} height={36} />
                </Button>
              )}
            </NetworkSelector>
          </h1>
          <h1 className="flex items-center gap-3 text-4xl font-semibold text-gray-900 dark:text-slate-200">
            Receive {token1.symbol} on{' '}
            <NetworkSelector variant="dialog" networks={SUPPORTED_CHAIN_IDS} selected={network1} onSelect={setNetwork1}>
              {({ selected, setOpen }) => (
                <Button onClick={() => setOpen(true)} variant="outlined" color="default" size="xl" className="!px-3">
                  <NetworkIcon chainId={selected} width={32} height={32} />
                  <ChevronDownIcon width={36} height={36} />
                </Button>
              )}
            </NetworkSelector>
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

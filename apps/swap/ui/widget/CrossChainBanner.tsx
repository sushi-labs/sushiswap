import React, { FC, useCallback } from 'react'
import Switch from '@sushiswap/ui13/components/Switch'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui13/types'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui13'

export const CrossChainBanner: FC = () => {
  const { appType } = useSwapState()
  const { setAppType } = useSwapActions()

  const handleChange = useCallback(
    (checked: boolean) => {
      if (checked) setAppType(AppType.xSwap)
      else setAppType(AppType.Swap)
    },
    [setAppType]
  )

  return (
    <div className={classNames('bg-white dark:bg-white/[0.04] px-4 py-3 rounded-xl')}>
      <div className="flex flex-col gap-2">
        <h1 className="flex gap-1.5 items-center text-sm font-semibold text-gray-600 dark:text-slate-400">
          <ArrowsRightLeftIcon strokeWidth={3} width={14} height={14} />
          Cross Chain
        </h1>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800 dark:text-slate-200">
            Sell tokens on network A and receive tokens on network B.
          </span>
          <Switch checked={appType === AppType.xSwap} onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}

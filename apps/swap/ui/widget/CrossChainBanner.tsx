import React, { FC, useCallback, useState } from 'react'
import Switch from '@sushiswap/ui/future/components/Switch'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui/types'
import { classNames } from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/future/components/icons'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ChainSelectors } from './ChainSelectors'
import { Explainer } from '@sushiswap/ui/future/components/Explainer'

export const CrossChainBanner: FC = () => {
  const { appType } = useSwapState()
  const [open, setOpen] = useState(appType !== AppType.Swap)
  const { setAppType } = useSwapActions()

  const handleChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setOpen(true)
        setAppType(AppType.xSwap)
      } else {
        setOpen(false)
        setAppType(AppType.Swap)
      }
    },
    [setAppType]
  )

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl mb-4">
      <div
        className={classNames(
          'flex flex-col bg-gradient-to-r from-blue/[0.15] to-pink/[0.15] hover:from-blue/20 hover:to-pink/20 saturate-[2] dark:saturate-[1] px-4 py-3 rounded-xl'
        )}
      >
        <div className="flex gap-3 items-center">
          <ShuffleIcon strokeWidth={1} width={24} height={24} className="text-blue" />
          <div className="flex flex-col">
            <h1 className="flex gap-1.5 items-center font-semibold text-gray-900 dark:text-slate-50">
              <span className="flex gap-1.5 items-center bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text">
                Cross Chain
              </span>
              <Explainer iconSize={16} placement="bottom">
                <span className="text-gray-900 dark:text-slate-50 font-semibold">Cross-chain Swap</span>
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  Swap your funds on one network and swap them into a token on a different network
                </span>
                <a
                  target="_blank"
                  className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center font-medium"
                  href="https://www.sushi.com/academy/articles/sushi-xswap-a-crosschain-dex"
                  rel="noreferrer"
                >
                  Learn more <ChevronRightIcon width={12} height={12} />
                </a>
              </Explainer>
            </h1>
            <span className="font-medium text-sm text-gray-700 dark:text-slate-400">
              Swap tokens from one network to another.
            </span>
          </div>
          <div className="flex justify-end flex-grow">
            <Switch checked={open} onChange={handleChange} />
          </div>
        </div>
        <ChainSelectors open={open} />
      </div>
    </div>
  )
}

import React, { FC, Fragment, useCallback } from 'react'
import Switch from '@sushiswap/ui13/components/Switch'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui13/types'
import { classNames } from '@sushiswap/ui13'
import { ShuffleIcon } from '@sushiswap/ui13/components/icons'
import { Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

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
        <h1 className="flex gap-1.5 items-center text-sm font-semibold text-gray-900 dark:text-slate-50">
          <span className="flex gap-1.5 items-center bg-gradient-to-r from-pink to-blue bg-clip-text text-transparent">
            <ShuffleIcon strokeWidth={3} width={14} height={14} className="text-pink" />
            Cross Chain{' '}
          </span>
          <Popover className="relative flex items-center">
            <Popover.Button>
              <InformationCircleIcon width={14} height={14} className="text-gray-400" />
            </Popover.Button>
            <Popover.Panel>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="border border-gray-300 dark:border-slate-700 dark:text-slate-200 absolute flex flex-col gap-3 top-5 left-[calc(-100px+50%)] w-[200px] bg-white dark:bg-slate-800 rounded-lg shadow-md px-4 py-3 text-xs mt-0.5">
                  <span className="text-gray-500 dark:text-slate-400">Cross-chain Swap</span>
                  Swap your funds on one network and swap them into a token on a different network{' '}
                  <a
                    target="_blank"
                    className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center"
                    href="https://www.sushi.com/academy/articles/sushi-xswap-a-crosschain-dex"
                    rel="noreferrer"
                  >
                    Learn more <ChevronRightIcon width={12} height={12} />
                  </a>
                </Popover.Panel>
              </Transition>
            </Popover.Panel>
          </Popover>
        </h1>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700 dark:text-slate-400">
            Swap tokens from one network to another.
          </span>
          <Switch checked={appType === AppType.xSwap} onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}

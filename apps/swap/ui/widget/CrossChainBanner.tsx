import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import Switch from '@sushiswap/ui13/components/Switch'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui13/types'
import { classNames } from '@sushiswap/ui13'
import { ShuffleIcon } from '@sushiswap/ui13/components/icons'
import { Menu, Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ChainSelectors } from './ChainSelectors'

export const CrossChainBanner: FC = () => {
  const [open, setOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleChange = useCallback((checked: boolean) => {
    if (checked) setOpen(true)
    else setOpen(false)
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl mb-4">
      <div
        className={classNames(
          'relative flex flex-col bg-gradient-to-r from-blue/[0.15] to-pink/[0.15] hover:from-blue/20 hover:to-pink/20 saturate-[2] dark:saturate-[1] px-4 py-3 rounded-xl'
        )}
      >
        <div className="flex gap-3 items-center">
          <ShuffleIcon strokeWidth={1} width={24} height={24} className="text-blue" />
          <div className="flex flex-col">
            <h1 className="flex gap-1.5 items-center font-semibold text-gray-900 dark:text-slate-50">
              <span className="flex gap-1.5 items-center bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text">
                Cross Chain
              </span>
              <Menu
                as="div"
                className="relative flex justify-center"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Menu.Button>
                  <InformationCircleIcon width={16} height={16} className="text-gray-400 dark:text-slate-500" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  show={showTooltip}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <div className="absolute pt-5 w-[max-content]">
                    <Menu.Items className="text-left w-[240px] text-gray-700  border-gray-300 dark:border-slate-700 dark:text-slate-200 flex flex-col gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-md shadow-black/30 dark:shadow-black/80 px-4 py-3 text-xs mt-0.5">
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
                    </Menu.Items>
                  </div>
                </Transition>
              </Menu>
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

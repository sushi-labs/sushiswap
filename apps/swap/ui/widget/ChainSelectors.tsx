import React, { FC, useCallback } from 'react'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui13/components/networkselector'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { Chain } from '@sushiswap/chain'
import { Popover } from '@headlessui/react'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Collapsible } from '@sushiswap/ui13/components/animation/Collapsible'
import { AppType } from '@sushiswap/ui13/types'

export const ChainSelectors: FC = () => {
  const { network0, network1, appType } = useSwapState()
  const { setNetwork0, setNetwork1, switchTokens } = useSwapActions()

  const handleSelect0 = useCallback<NetworkSelectorOnSelectCallback>(
    (el, close) => {
      setNetwork0(el)
      close()
    },
    [setNetwork0]
  )

  const handleSelect1 = useCallback<NetworkSelectorOnSelectCallback>(
    (el, close) => {
      setNetwork1(el)
      close()
    },
    [setNetwork1]
  )

  return (
    <Collapsible open={appType === AppType.xSwap}>
      <div className="flex gap-2 mb-4 border-gray-200 dark:border-slate-800 pb-4">
        <div className="w-[calc(50%-20px)]">
          <NetworkSelector networks={SUPPORTED_CHAIN_IDS} variant="dialog" selected={network0} onSelect={handleSelect0}>
            <Popover.Button
              as="button"
              className="transition-[background] hover:bg-gray-200 hover:dark:bg-slate-700 pl-2 pr-3 font-medium flex flex-col bg-white dark:bg-slate-800 rounded-xl py-1.5 w-full"
            >
              <span className="flex gap-1 items-center font-medium px-1 text-xs text-gray-500 dark:text-slate-400 pt-0.5">
                From
              </span>
              <div className="flex items-center w-full justify-between">
                <div className="flex gap-1 items-center">
                  <NetworkIcon type="naked" chainId={network0} width={32} height={32} />
                  {Chain.from(network0).name}
                </div>
                <ChevronDownIcon width={16} height={16} strokeWidth={3} />
              </div>
            </Popover.Button>
          </NetworkSelector>
        </div>

        <div className="flex justify-center items-center w-[40px]">
          <button
            onClick={switchTokens}
            type="button"
            className="z-10 group bg-gray-100 hover:bg-gray-200 hover:dark:bg-slate-700 dark:bg-slate-900 p-2 border-white transition-all rounded-full cursor-pointer"
          >
            <div className="transition-transform rotate-0 group-hover:rotate-180">
              <ArrowRightIcon strokeWidth={3} className="w-4 h-4 text-blue" />
            </div>
          </button>
        </div>

        <div className="w-[calc(50%-20px)]">
          <NetworkSelector networks={SUPPORTED_CHAIN_IDS} variant="dialog" selected={network1} onSelect={handleSelect1}>
            <Popover.Button
              as="button"
              className="transition-[background] hover:bg-gray-200 hover:dark:bg-slate-700 pl-2 pr-3 font-medium flex flex-col bg-white dark:bg-slate-800 rounded-xl py-1.5 w-full"
            >
              <span className="flex gap-1 items-center font-medium px-1 text-xs text-gray-500 dark:text-slate-400 pt-0.5">
                To
              </span>
              <div className="flex items-center w-full justify-between">
                <div className="flex gap-1 items-center">
                  <NetworkIcon type="naked" chainId={network1} width={32} height={32} />
                  {Chain.from(network1).name}
                </div>
                <ChevronDownIcon width={16} height={16} strokeWidth={3} />
              </div>
            </Popover.Button>
          </NetworkSelector>
        </div>
      </div>
    </Collapsible>
  )
}

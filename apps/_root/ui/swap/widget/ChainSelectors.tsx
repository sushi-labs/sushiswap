import React, { FC, useCallback } from 'react'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui/future/components/networkselector'
import { Chain } from '@sushiswap/chain'
import { Popover } from '@headlessui/react'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { STARGATE_SUPPORTED_CHAIN_IDS, StargateChainId } from '@sushiswap/stargate'
import { classNames } from '@sushiswap/ui'

export const ChainSelectors: FC<{ open: boolean }> = ({ open }) => {
  const { network0, network1 } = useSwapState()

  const { setNetwork0, setNetwork1, switchTokens } = useSwapActions()

  const handleSelect0 = useCallback<NetworkSelectorOnSelectCallback<StargateChainId>>(
    (el, close) => {
      setNetwork0(el)
      close()
    },
    [setNetwork0]
  )

  const handleSelect1 = useCallback<NetworkSelectorOnSelectCallback<StargateChainId>>(
    (el, close) => {
      setNetwork1(el)
      close()
    },
    [setNetwork1]
  )

  return (
    <div className={classNames(open ? '' : 'hidden', 'pt-6')}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={switchTokens}
            type="button"
            className="z-10 group hover:bg-white/30 hover:dark:bg-white/[0.16] p-2 border-white transition-all rounded-full cursor-pointer"
          >
            <div className="transition-transform rotate-0 group-hover:rotate-180">
              <ArrowRightIcon strokeWidth={3} className="w-4 h-4 text-blue" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-[60px] border-gray-200 dark:border-slate-800">
          <div className="z-10">
            <NetworkSelector<StargateChainId>
              networks={STARGATE_SUPPORTED_CHAIN_IDS}
              variant="dialog"
              selected={network0 as StargateChainId}
              onSelect={handleSelect0}
            >
              <Popover.Button
                as="button"
                className="transition-[background] bg-white/30 dark:bg-white/[0.08] hover:bg-white/50 hover:dark:bg-white/[0.16] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <span className="flex gap-1 items-center font-medium px-1 text-xs text-gray-500 dark:text-slate-400 pt-0.5">
                  From
                </span>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <NetworkIcon type="naked" chainId={network0} width={32} height={32} />
                    <span className="w-full text-left truncate">{Chain.from(network0).name}</span>
                  </div>
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon width={16} height={16} strokeWidth={3} />
                  </div>
                </div>
              </Popover.Button>
            </NetworkSelector>
          </div>
          <div className="z-10">
            <NetworkSelector
              networks={STARGATE_SUPPORTED_CHAIN_IDS}
              variant="dialog"
              selected={network1 as StargateChainId}
              onSelect={handleSelect1}
            >
              <Popover.Button
                as="button"
                className="transition-[background] bg-white/30 dark:bg-white/[0.08] hover:bg-white/50 hover:dark:bg-white/[0.16] pl-2 pr-3 font-medium flex flex-col rounded-xl py-1.5 w-full"
              >
                <span className="flex gap-1 items-center font-medium px-1 text-xs text-gray-500 dark:text-slate-400 pt-0.5">
                  To
                </span>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-start gap-1 overflow-hidden">
                    <NetworkIcon type="naked" chainId={network1} width={32} height={32} />
                    <span className="w-full text-left truncate">{Chain.from(network1).name}</span>
                  </div>
                  <div className="min-w-4 min-h-4">
                    <ChevronDownIcon width={16} height={16} strokeWidth={3} />
                  </div>
                </div>
              </Popover.Button>
            </NetworkSelector>
          </div>
        </div>
      </div>
    </div>
  )
}

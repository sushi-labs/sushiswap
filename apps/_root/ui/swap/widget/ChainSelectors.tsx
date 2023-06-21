import React, { FC, useCallback } from 'react'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui/future/components/networkselector'
import { Chain } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { STARGATE_SUPPORTED_CHAIN_IDS, StargateChainId } from '@sushiswap/stargate'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { SelectIcon } from '@sushiswap/ui/future/components/select'

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
          <div className="flex flex-col gap-2 z-10">
            <span className="text-sm">From network</span>
            <NetworkSelector
              networks={STARGATE_SUPPORTED_CHAIN_IDS}
              variant="menu"
              selected={network0 as StargateChainId}
              onSelect={handleSelect0}
            >
              <Button variant="secondary">
                <NetworkIcon chainId={network0} width={16} height={16} />
                {Chain.from(network0).name}
                <SelectIcon />
              </Button>
            </NetworkSelector>
          </div>
          <div className="flex flex-col gap-2 z-10">
            <span className="text-sm">To network</span>
            <NetworkSelector
              networks={STARGATE_SUPPORTED_CHAIN_IDS}
              variant="menu"
              selected={network1 as StargateChainId}
              onSelect={handleSelect1}
            >
              <Button variant="secondary">
                <NetworkIcon chainId={network1} width={16} height={16} />
                {Chain.from(network1).name}
                <SelectIcon />
              </Button>
            </NetworkSelector>
          </div>
        </div>
      </div>
    </div>
  )
}

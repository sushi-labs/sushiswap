'use client'

import { Popover } from '@headlessui/react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui13'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import React, { FC, useState } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkSelectorNewProps {
  supportedNetworks?: ChainId[]
}

export const NetworkSelector: FC<NetworkSelectorNewProps> = ({ supportedNetworks = [] }) => {
  const [query, setQuery] = useState('')
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const chainId = chain ? chain.id : ChainId.ETHEREUM

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-slate-200">
              <NetworkIcon chainId={chainId} width={20} height={20} />
              <div className="hidden xl:block">{chains[chainId].name.split(' ')[0]}</div>
              <ChevronDownIcon
                width={20}
                height={20}
                className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
              />
            </Popover.Button>
            <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 rounded-xl rounded-b-none sm:rounded-b-xl shadow-md shadow-black/[0.3] bg-slate-900 border border-slate-200/20">
              <div className="flex gap-2 items-center p-4 pb-3">
                <SearchIcon width={20} height={20} className="text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={classNames('w-full bg-transparent placeholder:font-medium text-base')}
                  placeholder="Search networks"
                />
              </div>
              <div className="mx-4 border-b border-slate-200/10" />
              <div className="p-2 max-h-[300px] scroll">
                {supportedNetworks
                  .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                  .map((el) => (
                    <div
                      onClick={() => {
                        switchNetwork && switchNetwork(el)
                      }}
                      key={el}
                      className={classNames(
                        'hover:bg-white/[0.08] px-1 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <NetworkIcon type="naked" chainId={el} width={22} height={22} />
                        <p className="text-sm font-medium text-slate-50">{chains[el].name}</p>
                      </div>
                      {chain?.id === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                    </div>
                  ))}
              </div>
            </Popover.Panel>
          </>
        )
      }}
    </Popover>
  )
}

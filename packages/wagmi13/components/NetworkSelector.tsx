'use client'

import { Menu, Transition } from '@headlessui/react'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui13'
import { Button } from '@sushiswap/ui13/components/button'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { Search } from '@sushiswap/ui13/components/input/Search'
import React, { FC, useState } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkSelectorNewProps {
  supportedNetworks?: ChainId[]
}

export const NetworkSelector: FC<NetworkSelectorNewProps> = ({ supportedNetworks = [] }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const chainId = chain ? chain.id : ChainId.ETHEREUM

  return (
    <Menu as="div" className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Menu.Button as={Button} variant="outlined" color="default" size="md">
        <NetworkIcon chainId={chainId} width={20} height={20} />
        <div className="hidden xl:block">{chains[chainId].name.split(' ')[0]}</div>
      </Menu.Button>
      <Transition
        show={open}
        enter="transition duration-300 ease-out"
        enterFrom="transform translate-y-[-16px] opacity-0"
        enterTo="transform translate-y-0 opacity-100"
        leave="transition duration-300 ease-out"
        leaveFrom="transform translate-y-0 opacity-100"
        leaveTo="transform translate-y-[-16px] opacity-0"
      >
        <div className="absolute pt-2 -top-[-1] right-0 sm:w-[320px]">
          <Menu.Items className="p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
            <Search className="bg-gray-100 dark:bg-slate-700" id="" value={query} loading={false} onChange={setQuery} />
            <div className="py-2 max-h-[300px] scroll">
              {supportedNetworks
                .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                .map((el) => (
                  <div
                    onClick={() => {
                      switchNetwork && switchNetwork(el)
                    }}
                    key={el}
                    className={classNames(
                      'group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <NetworkIcon
                        type="naked"
                        chainId={el}
                        width={24}
                        height={24}
                        className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                      />
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 dark:text-slate-300 group-hover:dark:text-slate-50">
                        {chains[el].name}
                      </p>
                    </div>
                    {chain?.id === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                  </div>
                ))}
            </div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  )
}

'use client'

import { Menu, Transition } from '@headlessui/react'
import chains from '@sushiswap/chain'
import classNames from 'classnames'
import React, { FC, useState } from 'react'

import { NetworkIcon } from '../icons'
import { Search } from '../input/Search'
import { NetworkSelectorProps } from './index'

export const NetworkSelectorMenu: FC<Omit<NetworkSelectorProps, 'variant'>> = ({
  selected,
  onSelect,
  networks = [],
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <Menu as="div" className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children({ setOpen, selected })}
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
              {networks
                .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                .map((el) => (
                  <div
                    onClick={() => onSelect(el)}
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
                    {selected === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                  </div>
                ))}
            </div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  )
}

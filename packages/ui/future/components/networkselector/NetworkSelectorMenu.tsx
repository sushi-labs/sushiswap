import { Popover, Transition } from '@headlessui/react'
import chains from '@sushiswap/chain'
import classNames from 'classnames'
import React, { useState } from 'react'

import { NetworkIcon } from '../icons'
import { Search } from '../input/Search'
import { NetworkSelectorProps } from './index'

export const NetworkSelectorMenu = <T extends number>({
  selected,
  onSelect,
  networks = [],
  children,
  align = 'right',
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [query, setQuery] = useState('')

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ open, close }) : children}
          <Transition
            show={open}
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-[0.95]"
            enterTo="transform scale-[1]"
            leave="transition duration-200 ease-out"
            leaveFrom="transform scale-[1] opacity-1"
            leaveTo="transform scale-[0.95] opacity-0"
          >
            <div
              className={classNames(align === 'right' ? 'right-0' : 'left-0', 'absolute pt-2 -top-[-4px] sm:w-[260px]')}
            >
              <div className="p-1 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
                <Popover.Panel>
                  <Search
                    className="!bg-black/[0.03] dark:!bg-white/[0.04]"
                    id=""
                    value={query}
                    loading={false}
                    onChange={setQuery}
                  />
                  <div className="h-px mt-1 -ml-1 -mr-1 bg-gray-100 dark:bg-slate-200/5" />
                  <div className="pt-1 max-h-[300px] scroll">
                    {networks
                      .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                      .map((el) => (
                        <button
                          onClick={() => onSelect(el, close)}
                          key={el}
                          testdata-id={`network-selector-${el}`}
                          className={classNames(
                            'w-full group hover:bg-black/[0.04] hover:dark:bg-white/[0.06] px-2 flex rounded-lg justify-between gap-2 items-center cursor-pointer h-[36px]'
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <NetworkIcon chainId={el} width={20} height={20} />
                            <p
                              className={classNames(
                                selected === el
                                  ? 'text-gray-900 dark:text-white font-medium'
                                  : 'text-gray-600 dark:text-slate-400'
                              )}
                            >
                              {chains[el].name}
                            </p>
                          </div>
                          {selected === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                        </button>
                      ))}
                  </div>
                </Popover.Panel>
              </div>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}

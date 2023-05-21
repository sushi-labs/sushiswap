import React, { FC, Fragment } from 'react'

import { Listbox, Transition } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Chain, ChainId } from '@sushiswap/chain'
import { CheckIcon } from '@heroicons/react/solid'
import { useFilters } from './FilterProvider'

interface ChainFilterProps {
  availableChainIds: ChainId[]
}

export const ChainFilter: FC<ChainFilterProps> = ({ availableChainIds }) => {
  const { setFilters, chainIds } = useFilters()

  const values = availableChainIds.length === chainIds.length ? [] : chainIds

  return (
    <Listbox
      as={Fragment}
      value={values}
      onChange={(chainIds) => setFilters({ chainIds: chainIds.length === 0 ? availableChainIds : chainIds })}
      multiple
    >
      {({ open }) => (
        <div className="relative z-[100]">
          <Listbox.Button as={Button} variant="outlined" size="lg" color="default">
            Networks{' '}
            <ChevronDownIcon
              width={24}
              height={24}
              className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
            />
          </Listbox.Button>
          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
          >
            <div className="absolute pt-2 -top-[-1] right-0 sm:w-[320px]">
              <div className="relative z-[100] p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <div className="max-h-[300px] scroll">
                  <Listbox.Options className="space-y-1">
                    {availableChainIds.map((chainId) => (
                      <Listbox.Option
                        key={chainId}
                        value={chainId}
                        className={({ selected }) =>
                          classNames(
                            'w-full group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex items-center gap-2.5">
                              <NetworkIcon
                                chainId={chainId}
                                width={20}
                                height={20}
                                className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                              />
                              <p
                                className={classNames(
                                  selected ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                                  'text-sm group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-slate-50'
                                )}
                              >
                                {Chain.from(chainId).name}
                              </p>
                            </div>
                            {selected && <CheckIcon width={16} height={16} className="text-blue" />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

import { CheckIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import React, { FC, Fragment } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../../config'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { Listbox, Transition } from '@headlessui/react'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Chain } from '@sushiswap/chain'
import { ChevronDownIcon } from '@heroicons/react/outline'

export const TableFiltersNetwork: FC = () => {
  const { chainIds, setFilters } = usePoolFilters()
  const values = SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds

  return (
    <Listbox
      as={Fragment}
      value={values}
      onChange={(chainIds) => setFilters({ chainIds: chainIds.length === 0 ? SUPPORTED_CHAIN_IDS : chainIds })}
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
            enterFrom="transform translate-y-[-16px] scale-[0.95]"
            enterTo="transform translate-y-0 scale-[1]"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100 scale-[1]"
            leaveTo="transform translate-y-[-16px] opacity-0 scale-[0.95]"
          >
            <div className="absolute pt-2 -top-[-1] right-0 sm:w-[260px]">
              <div className="relative z-[100] p-2 flex flex-col w-full bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
                <div className="max-h-[300px] scroll">
                  <Listbox.Options className="space-y-1">
                    {SUPPORTED_CHAIN_IDS.map((chainId) => (
                      <Listbox.Option
                        key={chainId}
                        value={chainId}
                        className={() =>
                          classNames(
                            'w-full group hover:bg-black/[0.04] hover:dark:bg-white/[0.04] px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
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

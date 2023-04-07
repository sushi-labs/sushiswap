import { CheckIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import React, { Fragment } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { PoolVersion } from '@sushiswap/client'
import { POOL_VERSION_MAP } from '../../../../lib/constants'

const PoolVersionValues = Object.keys(PoolVersion) as PoolVersion[]

export const TableFiltersPoolVersion = () => {
  const { setFilters, poolVersions } = usePoolFilters()
  const values = PoolVersionValues.length === poolVersions.length ? [] : poolVersions

  return (
    <Listbox
      as={Fragment}
      value={values}
      onChange={(poolVersions) =>
        setFilters({ poolVersions: poolVersions.length === 0 ? PoolVersionValues : poolVersions })
      }
      multiple
    >
      {({ open }) => (
        <div className="relative z-[100]">
          <Listbox.Button as={Button} variant="outlined" size="md" color="default">
            Types{' '}
            <ChevronDownIcon
              width={16}
              height={16}
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
            <div className="absolute pt-2 -top-[-1] left-0 sm:w-[200px]">
              <div className="relative z-[100] p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <div className="max-h-[300px] scroll">
                  <Listbox.Options className="space-y-1">
                    {PoolVersionValues.map((poolVersion) => (
                      <Listbox.Option
                        key={poolVersion}
                        value={poolVersion}
                        className={({ selected }) =>
                          classNames(
                            'w-full group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex items-center gap-2.5">
                              <span>🍣</span>{' '}
                              <p
                                className={classNames(
                                  selected ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                                  'text-sm group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-slate-50'
                                )}
                              >
                                {POOL_VERSION_MAP[poolVersion]}
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

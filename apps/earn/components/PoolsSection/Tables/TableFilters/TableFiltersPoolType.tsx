import { CheckIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import React, { FC, Fragment, useMemo } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { PoolType, PoolVersion } from '@sushiswap/client'
import { POOL_TYPE_MAP } from '../../../../lib/constants'

const VERSION_TYPE_MAP: Record<PoolVersion, PoolType[]> = {
  [PoolVersion.LEGACY]: [PoolType.CONSTANT_PRODUCT_POOL],
  [PoolVersion.TRIDENT]: [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL],
  [PoolVersion.V3]: [PoolType.CONCENTRATED_LIQUIDITY_POOL],
}

export const TableFiltersPoolType = () => {
  const { setFilters, poolTypes, poolVersions } = usePoolFilters()

  const availableValues = useMemo(() => {
    const available = new Set<PoolType>()
    poolVersions.forEach((version) => VERSION_TYPE_MAP[version].forEach((type) => available.add(type)))
    const availableArray = [...available]

    setFilters({ poolTypes: availableArray })

    return availableArray
  }, [poolVersions, setFilters])
  const selectedValues = poolTypes.length === availableValues.length ? [] : poolTypes

  return (
    <Listbox
      as={Fragment}
      value={selectedValues}
      onChange={(poolTypes) => setFilters({ poolTypes: poolTypes.length === 0 ? availableValues : poolTypes })}
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
            <div className="absolute pt-2 -top-[-1] left-0 sm:w-[290px]">
              <div className="relative z-[100] p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <div className="max-h-[300px] scroll">
                  <Listbox.Options className="space-y-1">
                    {availableValues.map((poolType) => (
                      <Listbox.Option
                        key={poolType}
                        value={poolType}
                        className={({ selected }) =>
                          classNames(
                            'w-full group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex items-center gap-2.5">
                              <span className="mt-1">🍱</span>{' '}
                              <p
                                className={classNames(
                                  selected ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                                  'text-sm group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-slate-50'
                                )}
                              >
                                {POOL_TYPE_MAP[poolType]}
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

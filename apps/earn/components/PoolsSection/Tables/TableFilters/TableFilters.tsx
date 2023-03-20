import { CheckIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../../config'
import { AVAILABLE_POOL_TYPE_MAP, AVAILABLE_VERSION_MAP } from '../../../../lib/constants'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'
import { Button } from '@sushiswap/ui/future/components/button'
import { Listbox, Transition } from '@headlessui/react'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Chain } from '@sushiswap/chain'
import { ChevronDownIcon } from '@heroicons/react/outline'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const router = useRouter()
  const { chainIds, poolTypes, poolVersions, incentivizedOnly, setFilters } = usePoolFilters()
  const poolTypesValue = Object.keys(AVAILABLE_POOL_TYPE_MAP).length === poolTypes.length ? [] : poolTypes
  const poolVersionsValue = Object.keys(AVAILABLE_VERSION_MAP).length === poolVersions.length ? [] : poolVersions
  const values = SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="h-px bg-gray-200 dark:bg-slate-200/5 w-full" />
      <div className="flex gap-4">
        <TableFiltersSearchToken />
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
                        {SUPPORTED_CHAIN_IDS.map((chainId) => (
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
      </div>
      <div className="h-px bg-gray-200 dark:bg-slate-200/5 w-full" />
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap items-center'
          )}
        >
          <Button
            onClick={() =>
              setFilters({
                poolVersions: poolVersions.includes('LEGACY')
                  ? poolVersions.filter((el) => el !== 'LEGACY')
                  : [...poolVersions, 'LEGACY'],
              })
            }
            size="sm"
            variant={poolVersions.includes('LEGACY') ? 'outlined' : 'empty'}
            color={poolVersions.includes('LEGACY') ? 'blue' : 'default'}
          >
            V1
          </Button>
          <Button
            onClick={() =>
              setFilters({
                poolVersions: poolVersions.includes('TRIDENT')
                  ? poolVersions.filter((el) => el !== 'TRIDENT')
                  : [...poolVersions, 'TRIDENT'],
              })
            }
            size="sm"
            variant={poolVersions.includes('TRIDENT') ? 'outlined' : 'empty'}
            color={poolVersions.includes('TRIDENT') ? 'blue' : 'default'}
          >
            V2
          </Button>
          <Button
            onClick={() =>
              setFilters({
                poolTypes: poolTypes.includes('STABLE_POOL')
                  ? poolTypes.filter((el) => el !== 'STABLE_POOL')
                  : [...poolTypes, 'STABLE_POOL'],
              })
            }
            size="sm"
            variant={poolTypes.includes('STABLE_POOL') ? 'outlined' : 'empty'}
            color={poolTypes.includes('STABLE_POOL') ? 'blue' : 'default'}
          >
            Stable
          </Button>
          <Button
            onClick={() =>
              setFilters({
                poolTypes: poolTypes.includes('CONSTANT_PRODUCT_POOL')
                  ? poolTypes.filter((el) => el !== 'CONSTANT_PRODUCT_POOL')
                  : [...poolTypes, 'CONSTANT_PRODUCT_POOL'],
              })
            }
            size="sm"
            variant={poolTypes.includes('CONSTANT_PRODUCT_POOL') ? 'outlined' : 'empty'}
            color={poolTypes.includes('CONSTANT_PRODUCT_POOL') ? 'blue' : 'default'}
          >
            Classic
          </Button>
          <Button
            onClick={() => setFilters({ incentivizedOnly: !incentivizedOnly })}
            size="sm"
            variant={incentivizedOnly ? 'outlined' : 'empty'}
            color={incentivizedOnly ? 'blue' : 'default'}
          >
            Farms Only
          </Button>
        </div>
      </div>
    </div>
  )
}

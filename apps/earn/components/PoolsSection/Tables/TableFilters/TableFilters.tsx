import { XIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import type { PoolType, PoolVersion } from '@sushiswap/client'
import { classNames, Network, Select, Switch, Typography } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../../config'
import { AVAILABLE_POOL_TYPE_MAP, AVAILABLE_VERSION_MAP } from '../../../../lib/constants'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const router = useRouter()
  const { chainIds, poolTypes, poolVersions, incentivizedOnly, setFilters } = usePoolFilters()
  const poolTypesValue = Object.keys(AVAILABLE_POOL_TYPE_MAP).length === poolTypes.length ? [] : poolTypes
  const poolVersionsValue = Object.keys(AVAILABLE_VERSION_MAP).length === poolVersions.length ? [] : poolVersions
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <Network.SelectorMenu
          networks={SUPPORTED_CHAIN_IDS}
          selectedNetworks={chainIds}
          onChange={(chainIds) => setFilters({ chainIds })}
        />
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap'
          )}
        >
          <Select
            value={poolTypesValue}
            onChange={(values: (keyof typeof AVAILABLE_POOL_TYPE_MAP)[]) =>
              setFilters({
                poolTypes:
                  values.length === 0
                    ? (Object.keys(AVAILABLE_POOL_TYPE_MAP) as (keyof typeof AVAILABLE_POOL_TYPE_MAP)[])
                    : values,
              })
            }
            button={
              <Select.Button className="ring-offset-slate-900 !bg-slate-700">
                <Typography variant="sm" weight={600} className="text-slate-200">
                  Pool Types
                </Typography>
              </Select.Button>
            }
            multiple
          >
            <Select.Options className="w-fit">
              {Object.entries(AVAILABLE_POOL_TYPE_MAP).map(([k, v]) => (
                <Select.Option key={k} value={k} showArrow={false} className="cursor-pointer">
                  <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
                    <div className="flex items-center gap-2.5">
                      <Typography
                        variant="sm"
                        weight={600}
                        className={classNames(
                          poolTypes.includes(k as PoolType) &&
                            poolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                            ? 'text-slate-50'
                            : 'text-slate-400'
                        )}
                      >
                        {v}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      {poolTypes.includes(k as PoolType) &&
                      poolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length ? (
                        <CheckIcon width={20} height={20} className="text-blue" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select>

          <Select
            value={poolVersionsValue}
            onChange={(values: (keyof typeof AVAILABLE_VERSION_MAP)[]) =>
              setFilters({
                poolVersions:
                  values.length === 0
                    ? (Object.keys(AVAILABLE_VERSION_MAP) as (keyof typeof AVAILABLE_VERSION_MAP)[])
                    : values,
              })
            }
            button={
              <Select.Button className="ring-offset-slate-900 !bg-slate-700">
                <Typography variant="sm" weight={600} className="text-slate-200">
                  Pool Versions
                </Typography>
              </Select.Button>
            }
            multiple
          >
            <Select.Options className="w-fit">
              {Object.entries(AVAILABLE_VERSION_MAP).map(([k, v]) => (
                <Select.Option key={k} value={k} showArrow={false} className="cursor-pointer">
                  <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
                    <div className="flex items-center gap-2.5">
                      <Typography
                        variant="sm"
                        weight={600}
                        className={classNames(
                          poolVersions.includes(k as PoolVersion) &&
                            poolVersions.length !== Object.keys(AVAILABLE_VERSION_MAP).length
                            ? 'text-slate-50'
                            : 'text-slate-400'
                        )}
                      >
                        {v}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      {poolVersions.includes(k as PoolVersion) &&
                      poolVersions.length !== Object.keys(AVAILABLE_VERSION_MAP).length ? (
                        <CheckIcon width={20} height={20} className="text-blue" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select>

          <div className="flex items-center bg-slate-700 rounded-xl gap-3 px-3 h-[44px]">
            <Typography variant="sm" weight={600} className="text-slate-200">
              Farms
            </Typography>
            <Switch
              checked={incentivizedOnly}
              onChange={(checked) => {
                setFilters({ incentivizedOnly: checked })
                router.replace(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      incentivizedOnly: checked,
                    },
                  },
                  undefined,
                  { shallow: true }
                )
              }}
              size="sm"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          </div>

          <TableFiltersSearchToken />
        </div>
      </div>
    </>
  )
}

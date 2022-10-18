import { XIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { classNames, Network, Select, Switch, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../../config'
import { AVAILABLE_POOL_TYPE_MAP } from '../../../../lib/constants'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { selectedNetworks, selectedPoolTypes, farmsOnly, setFilters } = usePoolFilters()
  const poolTypesValue =
    Object.keys(AVAILABLE_POOL_TYPE_MAP).length === selectedPoolTypes.length ? [] : selectedPoolTypes

  return (
    <>
      <div className="flex gap-3 flex-wrap mb-4">
        <Network.SelectorMenu
          networks={SUPPORTED_CHAIN_IDS}
          selectedNetworks={selectedNetworks}
          onChange={(selectedNetworks) => setFilters({ selectedNetworks })}
        />
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap'
          )}
        >
          <Select
            value={poolTypesValue}
            onChange={(values: string[]) =>
              setFilters({ selectedPoolTypes: values.length === 0 ? Object.keys(AVAILABLE_POOL_TYPE_MAP) : values })
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
                          selectedPoolTypes.includes(k) &&
                            selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length
                            ? 'text-slate-50'
                            : 'text-slate-400'
                        )}
                      >
                        {v}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      {selectedPoolTypes.includes(k) &&
                      selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length ? (
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
              checked={farmsOnly}
              onChange={(checked) => setFilters({ farmsOnly: checked })}
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

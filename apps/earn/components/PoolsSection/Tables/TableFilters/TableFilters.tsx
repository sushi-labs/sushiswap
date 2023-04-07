import { classNames } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'
import { Button } from '@sushiswap/ui/future/components/button'
import { TableFiltersNetwork } from './TableFiltersNetwork'
import { TableFiltersPoolVersion } from './TableFiltersPoolVersion'
import { TableFiltersPoolType } from './TableFiltersPoolType'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { incentivizedOnly, setFilters } = usePoolFilters()

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="w-full h-px bg-gray-200 dark:bg-slate-200/5" />
      <div className="flex gap-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork />
      </div>
      <div className="w-full h-px bg-gray-200 dark:bg-slate-200/5" />
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap items-center'
          )}
        >
          <TableFiltersPoolVersion />
          <TableFiltersPoolType />

          <Button
            onClick={() => setFilters({ incentivizedOnly: !incentivizedOnly })}
            size="sm"
            variant={incentivizedOnly ? 'outlined' : 'empty'}
            color={incentivizedOnly ? 'blue' : 'default'}
            className="flex gap-2.5"
          >
            <span>🧑‍🌾</span> <span>Farms</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

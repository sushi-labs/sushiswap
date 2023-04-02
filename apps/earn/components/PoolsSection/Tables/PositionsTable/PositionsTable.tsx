import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'
import { useUserPositions } from '../../../../lib/hooks'
import { PositionWithPool } from '../../../../types'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'
import { PositionQuickHoverTooltip } from './PositionQuickHoverTooltip'
import { ClassicPoolIcon } from '@sushiswap/ui/future/components/icons'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames, Collapsible } from '@sushiswap/ui'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { chainIds } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: userPositions, isValidating } = useUserPositions({ id: address, chainIds })

  const table = useReactTable<PositionWithPool>({
    data: userPositions || [],
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        volume: false,
        apr: false,
        liquidityUSD: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: PositionWithPool) => {
    return `/${row.pool.id}`
  }, [])

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button as="div" role="button" className={classNames(open ? '' : '', 'w-full group')}>
            <h1 className="flex gap-2 items-center justify-between font-semibold text-sm text-gray-700 group-hover:text-gray-900 dark:text-slate-200 dark:group-hover:text-slate-50 group-hover:text-slate-50 py-4 px-4">
              <span className="flex items-center gap-3">
                <ClassicPoolIcon width={20} height={20} className="saturate-200" /> Legacy Positions{' '}
                {userPositions ? `(${userPositions.length})` : ''}
              </span>
              <div className="flex items-center gap-1">
                <button className="text-blue group-hover:text-blue-600 text-sm">{open ? 'Collapse' : 'Expand'}</button>
                <ChevronDownIcon
                  width={24}
                  height={24}
                  className={classNames(
                    'transition-all',
                    open ? 'rotate-180' : 'rotate-0',
                    'text-blue group-hover:text-blue-600'
                  )}
                />
              </div>
            </h1>
          </Disclosure.Button>
          <Collapsible open={open}>
            <GenericTable<PositionWithPool>
              table={table}
              HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
              loading={isValidating}
              placeholder="No positions found"
              pageSize={Math.max(userPositions?.length || 0, 5)}
              linkFormatter={rowLink}
            />
          </Collapsible>
        </>
      )}
    </Disclosure>
  )
}

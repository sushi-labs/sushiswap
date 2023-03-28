import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useUserPositions } from '../../../../lib/hooks'
import { PositionWithPool } from '../../../../types'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'
import { PositionQuickHoverTooltip } from './PositionQuickHoverTooltip'
import { ClassicPoolIcon } from '@sushiswap/ui/future/components/icons'

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
    <>
      <h1 className="flex gap-2 items-center justify-end font-medium text-xl text-slate-200 py-4 px-3">
        <ClassicPoolIcon width={22} height={22} />
        Classic
      </h1>
      <GenericTable<PositionWithPool>
        table={table}
        HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
        loading={isValidating}
        placeholder="No positions found"
        pageSize={Math.max(userPositions?.length || 0, 5)}
        linkFormatter={rowLink}
      />
    </>
  )
}

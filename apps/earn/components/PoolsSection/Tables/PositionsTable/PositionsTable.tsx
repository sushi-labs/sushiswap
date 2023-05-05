import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'
import { useUserPositions } from '../../../../lib/hooks'
import { PositionWithPool } from '../../../../types'

import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'
import { PositionQuickHoverTooltip } from './PositionQuickHoverTooltip'
import { ClassicPoolIcon } from '@sushiswap/ui/future/components/icons'
import { classNames } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../../../../config'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: userPositions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })
  const _positions = useMemo(() => userPositions || [], [userPositions])

  const table = useReactTable<PositionWithPool>({
    data: _positions,
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
      <div className={classNames('w-full group')}>
        <h1 className="flex gap-2 items-center justify-between font-semibold text-sm text-gray-700 group-hover:text-gray-900 dark:text-slate-200 dark:group-hover:text-slate-50 group-hover:dark:text-slate-50 py-4 px-4">
          <span className="flex items-center gap-3">
            <ClassicPoolIcon width={20} height={20} className="saturate-200" /> Legacy Positions{' '}
            {userPositions ? `(${userPositions.length})` : ''}
          </span>
        </h1>
      </div>
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

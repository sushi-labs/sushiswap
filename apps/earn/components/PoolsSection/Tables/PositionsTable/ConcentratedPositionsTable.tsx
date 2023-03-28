import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './Cells/columns'
import { ClassicPoolIcon } from '@sushiswap/ui/future/components/icons'
import { ConcentratedLiquidityPosition, useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NAME_COLUMN_V3, PRICE_RANGE_COLUMN, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL]

export const ConcentratedPositionsTable: FC = () => {
  const { chainIds } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: positions, isLoading } = useConcentratedLiquidityPositions({ account: address, chainIds })

  console.log(positions)
  const table = useReactTable<ConcentratedLiquidityPosition>({
    data: positions || [],
    // state: {
    //   sorting,
    // columnVisibility,
    // },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // useEffect(() => {
  //   if (isSm && !isMd) {
  //     setColumnVisibility({ volume: false, network: false })
  //   } else if (isSm) {
  //     setColumnVisibility({})
  //   } else {
  //     setColumnVisibility({
  //       volume: false,
  //       network: false,
  //       apr: false,
  //       liquidityUSD: false,
  //     })
  //   }
  // }, [isMd, isSm])

  const rowLink = useCallback((row: ConcentratedLiquidityPosition) => {
    return `/${row.id}`
  }, [])

  return (
    <>
      <h1 className="flex gap-2 items-center justify-end font-medium text-xl text-slate-200 py-4 px-3">
        <ClassicPoolIcon width={22} height={22} />
        Classic
      </h1>
      <GenericTable<ConcentratedLiquidityPosition>
        table={table}
        loading={isLoading}
        placeholder="No positions found"
        pageSize={Math.max(positions?.length || 0, 5)}
        linkFormatter={rowLink}
      />
    </>
  )

  return <span />
}

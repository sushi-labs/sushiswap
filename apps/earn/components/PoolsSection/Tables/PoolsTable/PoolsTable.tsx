import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable, Table } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWRInfinite from 'swr/infinite'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { PAGE_SIZE } from '../contants'
import { APR_COLUMN, FEES_COLUMN, NAME_COLUMN, NETWORK_COLUMN, TVL_COLUMN, VOLUME_COLUMN } from './Cells/columns'
import { PoolQuickHoverTooltip } from './PoolQuickHoverTooltip'
import { getPools, Pool, GetPoolsArgs } from '@sushiswap/client'
import { usePoolCount } from '../../../../lib/hooks/api/usePoolCount'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, VOLUME_COLUMN, FEES_COLUMN, APR_COLUMN]

const getArgs = (pageIndex: number, previousData: { id: string }[], args: GetPoolsArgs) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return args

  // add the cursor to the API endpoint
  return { ...args, cursor: previousData?.[previousData.length - 1].id }
}

export const PoolsTable: FC = () => {
  const { chainIds, poolTypes, incentivizedOnly } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })

  const args = useMemo<GetPoolsArgs>(
    () => ({
      chainIds: chainIds,
      isIncentivized: incentivizedOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      poolTypes: poolTypes as Pool['type'][],
    }),
    [sorting, chainIds, poolTypes, incentivizedOnly]
  )

  const {
    data: pools,
    isValidating,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previous) => getArgs(index, previous, args),
    (args) => getPools(args)
  )

  const { data: poolCount } = usePoolCount(args)

  const table = useReactTable<Pool>({
    data: pools?.flat() || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((poolCount || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({
        volume: false,
        network: false,
        rewards: false,
        fees: false,
      })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        volume: false,
        network: false,
        rewards: false,
        liquidityUSD: false,
        fees: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: Pool) => {
    return `/${row.id}`
  }, [])

  return (
    <>
      <button onClick={() => setSize(size + 1)}>Load More</button>
      <GenericTable<Pool>
        table={table}
        loading={!pools && isValidating}
        HoverElement={isMd ? PoolQuickHoverTooltip : undefined}
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
        linkFormatter={rowLink}
      />
      <Table.Paginator
        hasPrev={pagination.pageIndex > 0}
        hasNext={pagination.pageIndex < table.getPageCount()}
        nextDisabled={!pools && isValidating}
        onPrev={table.previousPage}
        onNext={table.nextPage}
        page={pagination.pageIndex}
        onPage={table.setPageIndex}
        pages={table.getPageCount()}
        pageSize={PAGE_SIZE}
      />
    </>
  )
}

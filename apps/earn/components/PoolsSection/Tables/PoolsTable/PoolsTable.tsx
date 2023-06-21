import { useBreakpoint } from '@sushiswap/hooks'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { PAGE_SIZE } from '../constants'
import {
  APR_COLUMN,
  FEES_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
} from './Cells/columns'
import { PoolQuickHoverTooltip } from './PoolQuickHoverTooltip'
import { GetPoolsArgs, Pool, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import { useSWRConfig } from 'swr'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { Loader } from '@sushiswap/ui/future/components/Loader'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_COLUMN,
  APR_COLUMN,
] as any

export const PoolsTable: FC = () => {
  const { chainIds, tokenSymbols, protocols, farmsOnly } = usePoolFilters()
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })

  const args = useMemo<GetPoolsArgs>(() => {
    return {
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: farmsOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      isWhitelisted: true, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
    }
  }, [chainIds, tokenSymbols, protocols, farmsOnly, sorting])

  const {
    data: pools,
    isValidating,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const { data: poolCount } = usePoolCount({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const data = useMemo(() => pools?.flat() || [], [pools])

  const table = useReactTable<Pool>({
    data,
    columns: COLUMNS,
    state: {
      sorting,
    },
    pageCount: Math.ceil((poolCount?.count || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    sortDescFirst: true,
  })
  const rowLink = useCallback((row: Pool) => {
    return `/${row.id}`
  }, [])

  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={() => setSize((prev) => prev + 1)}
        hasMore={data.length < (poolCount?.count || 0)}
        loader={
          <div className="flex justify-center w-full py-4">
            <Loader size={24} />
          </div>
        }
      >
        <GenericTable<Pool>
          table={table}
          loading={!pools && isValidating}
          HoverElement={isMd ? PoolQuickHoverTooltip : undefined}
          placeholder="No pools found"
          pageSize={PAGE_SIZE}
          linkFormatter={rowLink}
        />
      </InfiniteScroll>
    </>
  )
}

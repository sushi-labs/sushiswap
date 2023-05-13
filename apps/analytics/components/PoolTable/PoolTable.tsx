import { GetPoolsArgs, Pool, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import { useBreakpoint } from '@sushiswap/hooks'
import { Loader } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { usePoolFilters } from '../PoolsFiltersProvider'
import {
  APR_COLUMN,
  FEES_7D_COLUMN,
  FEES_1D_COLUMN,
  NAME_COLUMN,
  NETWORK_COLUMN,
  PAGE_SIZE,
  TVL_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1D_COLUMN,
} from '../Table'
import { PoolQuickHoverTooltip } from './PoolTableQuickHoverTooltip'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [
  NETWORK_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  FEES_1D_COLUMN,
  FEES_7D_COLUMN,
  APR_COLUMN,
]

export const PoolTable: FC = () => {
  const { chainIds, tokenSymbols } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo<GetPoolsArgs>(
    () => ({
      chainIds: chainIds,
      tokenSymbols,
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      isWhitelisted: true,
    }),
    [chainIds, sorting, tokenSymbols]
  )

  const { data: pools, isValidating, size, setSize } = usePoolsInfinite({ args, swrConfig: useSWRConfig() })
  const { data: poolCount } = usePoolCount({ args, swrConfig: useSWRConfig() })

  const data = useMemo(() => pools?.flat() || [], [pools])

  const table = useReactTable<Pool>({
    data,
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((poolCount?.count || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  // TODO: Fix
  useEffect(() => {
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({
        fees1d: false,
        volume24h: false,
        fees7d: false,
        network: false,
      })
    } else if (isSm && isMd && !isLg) {
      setColumnVisibility({ fees24h: false, volume24h: false, network: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        fees1d: false,
        volume1d: false,
        network: false,
        fees1w: false,
        tvl: false,
        totalApr: false,
      })
    }
  }, [isLg, isMd, isSm])

  const rowLink = useCallback((row: Pool) => {
    return `https://www.sushi.com/pools/${row.id}`
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

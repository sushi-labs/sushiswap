import { useBreakpoint } from '@sushiswap/hooks'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { PAGE_SIZE } from '../contants'
import { APR_COLUMN, FEES_COLUMN, NAME_COLUMN, NETWORK_COLUMN, TVL_COLUMN, VOLUME_COLUMN } from './Cells/columns'
import { PoolQuickHoverTooltip } from './PoolQuickHoverTooltip'
import { Pool, GetPoolsArgs, usePoolsInfinite, usePoolCount, PoolType, PoolVersion } from '@sushiswap/client'
import { useSWRConfig } from 'swr'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { Loader } from '@sushiswap/ui/future/components/Loader'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, VOLUME_COLUMN, FEES_COLUMN, APR_COLUMN]

export const PoolsTable: FC<{ isReady?: boolean }> = ({ isReady }) => {
  const { chainIds, tokenSymbols, poolTypes, poolVersions, incentivizedOnly } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const shouldLoad = isReady === undefined || !!isReady

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })

  const args = useMemo<GetPoolsArgs>(
    () => ({
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: incentivizedOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      isWhitelisted: true, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      poolTypes: poolTypes as PoolType[],
      poolVersions: poolVersions as PoolVersion[],
    }),
    [chainIds, tokenSymbols, incentivizedOnly, sorting, poolTypes, poolVersions]
  )

  const {
    data: pools,
    isValidating,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: shouldLoad, swrConfig: useSWRConfig() })
  const { data: poolCount } = usePoolCount({ args, shouldFetch: shouldLoad, swrConfig: useSWRConfig() })
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
    sortDescFirst: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({
        volume1d: false,
        network: false,
        rewards: false,
        fees1d: false,
      })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        network: false,
        rewards: false,
        liquidityUSD: false,
        fees1d: false,
      })
    }
  }, [isMd, isSm])

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
          loading={(!pools && isValidating) || !shouldLoad}
          HoverElement={isMd ? PoolQuickHoverTooltip : undefined}
          placeholder="No pools found"
          pageSize={PAGE_SIZE}
          linkFormatter={rowLink}
        />
      </InfiniteScroll>
    </>
  )
}

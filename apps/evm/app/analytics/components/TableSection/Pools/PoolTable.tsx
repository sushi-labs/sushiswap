import { GetPoolsArgs, Pool } from '@sushiswap/client'
import { usePoolCount, usePoolsInfinite } from '@sushiswap/client/hooks'
import { useBreakpoint } from '@sushiswap/hooks'
import { Loader } from '@sushiswap/ui/components/loader'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'

import { useFilters } from '../../Filters'
import {
  APR_COLUMN,
  FEES_1D_COLUMN,
  FEES_1M_COLUMN,
  FEES_7D_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_7D_COLUMN,
} from './columns'
import { PAGE_SIZE } from './constants'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_1D_COLUMN,
  FEES_7D_COLUMN,
  FEES_1M_COLUMN,
  APR_COLUMN,
  // rome-ignore lint:
] as any // eslint-disable-line @typescript-eslint/no-explicit-any

export const PoolTable: FC = () => {
  const { chainIds, search: tokenSymbols, isWhitelisted, poolProtocols: protocols } = useFilters()

  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo<GetPoolsArgs>(
    () => ({
      chainIds: chainIds,
      tokenSymbols,
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
      isWhitelisted: isWhitelisted,
    }),
    [chainIds, tokenSymbols, sorting, protocols, isWhitelisted]
  )

  const { data: pools, isValidating, setSize } = usePoolsInfinite({ args, swrConfig: useSWRConfig() })
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
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
        linkFormatter={rowLink}
      />
    </InfiniteScroll>
  )
}

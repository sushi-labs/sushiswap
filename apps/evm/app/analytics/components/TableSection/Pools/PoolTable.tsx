import { GetPoolsArgs, Pool, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { Loader } from '@sushiswap/ui/components/loader'
import { ColumnDef, PaginationState, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'
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
] as ColumnDef<Pool, unknown>[]

export const PoolTable: FC = () => {
  const { chainIds, search: tokenSymbols, isWhitelisted, poolProtocols: protocols } = useFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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

  const {
    data: pools,
    isValidating,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: true, swrConfig: useSWRConfig() })

  const { data: poolCount } = usePoolCount({ args, shouldFetch: true, swrConfig: useSWRConfig() })

  const data = useMemo(() => pools?.flat() || [], [pools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [pagination, sorting])

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => setSize((prev) => prev + 1)}
      hasMore={data.length < (poolCount?.count || 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Pools{' '}
            {poolCount?.count ? <span className="text-gray-400 dark:text-slate-500">({poolCount.count})</span> : null}
          </CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          loading={!pools && isValidating}
          linkFormatter={(row) => `/pool/${row.chainId}%3A${row.address}`}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}

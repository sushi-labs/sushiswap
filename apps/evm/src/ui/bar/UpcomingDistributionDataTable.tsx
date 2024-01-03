'use client'

import { DataTable, Loader } from '@sushiswap/ui'
import { SortingState, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useBarTableDataInfinite } from 'src/lib/bar'
import {
  FEES_COLUMN,
  LAST_DISTRUBUTED_COLUMN,
  NAME_COLUMN_POOL,
} from './columns'

const COLUMNS = [NAME_COLUMN_POOL, FEES_COLUMN, LAST_DISTRUBUTED_COLUMN]

export const UpcomingDistributionDataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'fees', desc: true },
  ])

  const {
    data: positions,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useBarTableDataInfinite()

  const data = useMemo(() => positions?.pages?.flat() || [], [positions])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage}
      hasMore={Boolean(hasNextPage)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={isLoading}
        linkFormatter={(row) => `/pool/${row.chainId}%3A${row.id}`}
        columns={COLUMNS}
        data={data}
      />
    </InfiniteScroll>
  )
}

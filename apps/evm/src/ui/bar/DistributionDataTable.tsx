'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import { SortingState, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useBarPositionsInfinite } from 'src/lib/bar/useBarPositionsInfinite'
import { FEES_COLUMN, NAME_COLUMN_POOL } from './columns'

const COLUMNS = [NAME_COLUMN_POOL, FEES_COLUMN]

export const DistributionDataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'fees', desc: true },
  ])

  const {
    data: positions,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useBarPositionsInfinite()

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

  // const rowRenderer = useCallback(
  //   (row: Row<Pool>, rowNode: ReactNode) => {
  //     if (onRowClick)
  //       return (
  //         <Slot
  //           className="cursor-pointer"
  //           onClick={() => onRowClick?.(row.original)}
  //         >
  //           {rowNode}
  //         </Slot>
  //       )
  //     return rowNode
  //   },
  //   [onRowClick],
  // )

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
      <Card>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          linkFormatter={(row) => `/pool/${row.chainId}%3A${row.id}`}
          // rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}

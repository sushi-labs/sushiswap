'use client'

import { DataTable, Loader, SkeletonText } from '@sushiswap/ui'
import { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import { formatDistance, fromUnixTime } from 'date-fns'
import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  HistoricBarDistribution,
  useHistoricBarDistributions,
} from 'src/lib/bar'
import { formatNumber, shortenAddress } from 'sushi'
import { Chain } from 'sushi/chain'

const MAKER_COLUMN: ColumnDef<HistoricBarDistribution, unknown> = {
  id: 'user',
  header: 'Served by',
  cell: (props) => shortenAddress(props.row.original.maker.id),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
  size: 300,
}

const AMOUNT_COLUMN: ColumnDef<HistoricBarDistribution, unknown> = {
  id: 'amountSushi',
  header: 'Amount',
  accessorFn: (row) => row.amountSushi,
  cell: (props) => (
    <span>{formatNumber(props.row.original.amountSushi / 1e18)} SUSHI</span>
  ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

const TIME_COLUMN: ColumnDef<HistoricBarDistribution, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  cell: (props) =>
    formatDistance(fromUnixTime(props.row.original.timestamp), new Date(), {
      addSuffix: true,
    }),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

const COLUMNS = [MAKER_COLUMN, AMOUNT_COLUMN, TIME_COLUMN]

export const HistoricDistributionDataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true },
  ])

  const {
    data: positions,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useHistoricBarDistributions()

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
        columns={COLUMNS}
        data={data}
        linkFormatter={(row) => Chain.from(1)?.getTxUrl(row.tx) ?? ''}
      />
    </InfiniteScroll>
  )
}

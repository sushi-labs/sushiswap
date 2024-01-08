'use client'

import { Pool } from '@sushiswap/client'
import { DataTable, Loader, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import { formatDistance, fromUnixTime } from 'date-fns'
import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  UpcomingBarDistribution,
  useUpcomingBarDistributions,
} from 'src/lib/bar'
import { Chain } from 'sushi/chain'
import { formatUSD } from 'sushi/format'
import { PoolNameCellPool } from '../pool/PoolNameCell'

const NAME_COLUMN_POOL: ColumnDef<UpcomingBarDistribution, unknown> = {
  id: 'name',
  header: 'Pool Name',
  cell: (props) => (
    <PoolNameCellPool pool={props.row.original as any as Pool} />
  ),
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={26} />
          <SkeletonCircle radius={26} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
  size: 300,
}

const FEES_COLUMN: ColumnDef<UpcomingBarDistribution, unknown> = {
  id: 'fees',
  header: 'Fees Accrued',
  accessorFn: (row) => row.balanceUSD,
  cell: (props) =>
    formatUSD(props.row.original.balanceUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.balanceUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

const LAST_DISTRUBUTED_COLUMN: ColumnDef<UpcomingBarDistribution, unknown> = {
  id: 'lastDistributed',
  header: 'Last Distributed',
  accessorFn: (row) => row.lastDistributedTimestamp ?? '0',
  cell: (props) =>
    props.row.original.lastDistributedTimestamp &&
    props.row.original.lastDistributedTx ? (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div onClick={(e) => e.stopPropagation()}>
        <a
          href={Chain.from(props.row.original.chainId)?.getTxUrl(
            props.row.original.lastDistributedTx,
          )}
          rel="noreferrer noopener"
          target="_blank"
          className="underline decoration-dotted underline-offset-2"
        >
          {formatDistance(
            fromUnixTime(props.row.original.lastDistributedTimestamp),
            new Date(),
            { addSuffix: true },
          )}
        </a>
      </div>
    ) : (
      'n/a'
    ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

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
  } = useUpcomingBarDistributions()

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

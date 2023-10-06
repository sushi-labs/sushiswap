'use client'

import { GetPoolsArgs, Pool } from '@sushiswap/client'
import { usePoolCount, usePoolsInfinite } from '@sushiswap/client/hooks'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { Card, CardHeader, CardTitle, DataTable, Loader, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'

import { APRHoverCard } from './APRHoverCard'
import { PoolNameCellPool } from './PoolNameCell'
import { usePoolFilters } from './PoolsFiltersProvider'

const COLUMNS = [
  {
    id: 'name',
    header: 'Strategy',
    cell: (props) => <span />,
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'poolName',
    header: 'Pool name',
    cell: (props) => <PoolNameCellPool pool={props.row.original} />,
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
  },
  {
    id: 'liquidityUSD',
    header: 'TVL',
    accessorFn: (row) => row.liquidityUSD,
    sortingFn: ({ original: rowA }, { original: rowB }) => Number(rowA.liquidityUSD) - Number(rowB.liquidityUSD),
    cell: (props) =>
      formatUSD(props.row.original.liquidityUSD).includes('NaN') ? '$0.00' : formatUSD(props.row.original.liquidityUSD),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'fees1d',
    header: 'Fees (24h)',
    accessorFn: (row) => row.fees1d,
    cell: (props) =>
      formatUSD(props.row.original.fees1d).includes('NaN') ? '$0.00' : formatUSD(props.row.original.fees1d),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'totalApr1d',
    header: 'APR',
    accessorFn: (row) => row.totalApr1d,
    cell: (props) => (
      <APRHoverCard pool={props.row.original}>
        <span className="underline decoration-dotted">{formatPercent(props.row.original.totalApr1d)}</span>
      </APRHoverCard>
    ),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
] satisfies ColumnDef<Pool, unknown>[]

export const SmartPoolsTable = () => {
  const { chainIds, tokenSymbols, protocols, farmsOnly } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])

  const args = useMemo<GetPoolsArgs>(() => {
    return {
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: farmsOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      hasEnabledSteerVault: true, // will filter smart pools out if set to false, undefined will be filtered out by the parser
      isWhitelisted: true, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
    }
  }, [chainIds, tokenSymbols, farmsOnly, sorting, protocols])

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
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

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
            Smart Pools{' '}
            {poolCount?.count ? <span className="text-gray-400 dark:text-slate-500">({poolCount.count})</span> : null}
          </CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={!pools && isValidating}
          linkFormatter={(row) => `/pool/${row.chainId}%3A${row.address}`}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}

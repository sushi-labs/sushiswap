'use client'

import {
  ChartPieIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  MinusIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Slot } from '@radix-ui/react-slot'
import { GetPoolsArgs, Pool, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import { Native } from '@sushiswap/currency'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Loader,
} from '@sushiswap/ui'
import { ColumnDef, Row, SortingState, TableState } from '@tanstack/react-table'
import Link from 'next/link'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'

import {
  APR_COLUMN_POOL,
  FEES_COLUMN,
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_7D_COLUMN,
} from './columns'
import { usePoolFilters } from './PoolsFiltersProvider'

const COLUMNS = [
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_COLUMN,
  APR_COLUMN_POOL,
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuItem asChild>
            <Link
              onClick={(e) => e.stopPropagation()}
              shallow={true}
              className="flex items-center"
              href={`/pool/${row.original.chainId}%3A${row.original.address}`}
            >
              <ChartPieIcon width={16} height={16} className="mr-2" />
              Pool
            </Link>
          </DropdownMenuItem>
          {row.original.protocol !== 'SUSHISWAP_V3' ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/pool/${row.original.chainId}%3A${row.original.address}/add`}
                >
                  <PlusIcon width={16} height={16} className="mr-2" />
                  Add Liquidity
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/pool/${row.original.chainId}%3A${row.original.address}/remove`}
                >
                  <MinusIcon width={16} height={16} className="mr-2" />
                  Remove Liquidity
                </Link>
              </DropdownMenuItem>
            </>
          ) : null}
          {row.original.protocol === 'SUSHISWAP_V3' ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/pool/${row.original.chainId}%3A${row.original.address}/positions`}
                >
                  <UserIcon width={16} height={16} className="mr-2" />
                  My Positions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/pool/incentivize?chainId=${row.original.chainId}&fromCurrency=${
                    row.original.token0.address === Native.onChain(row.original.chainId).wrapped.address
                      ? 'NATIVE'
                      : row.original.token0.address
                  }&toCurrency=${
                    row.original.token1.address === Native.onChain(row.original.chainId).wrapped.address
                      ? 'NATIVE'
                      : row.original.token1.address
                  }&feeAmount=${row.original.swapFee * 10_000 * 100}`}
                >
                  <GiftIcon width={16} height={16} className="mr-2" />
                  Add incentive
                </Link>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
] satisfies ColumnDef<Pool, unknown>[]

interface PositionsTableProps {
  onRowClick?(row: Pool): void
}

export const PoolsTable: FC<PositionsTableProps> = ({ onRowClick }) => {
  const { chainIds, tokenSymbols, protocols, farmsOnly } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])

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

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  const rowRenderer = useCallback(
    (row: Row<Pool>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot className="cursor-pointer" onClick={() => onRowClick?.(row.original)}>
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick]
  )

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
          loading={!pools && isValidating}
          linkFormatter={(row) => `/pool/${row.chainId}%3A${row.address}`}
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}

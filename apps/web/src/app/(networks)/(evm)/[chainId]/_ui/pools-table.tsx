'use client'

import { Slot } from '@radix-ui/react-slot'
import type {
  GetPools,
  PoolChainId,
  Pools,
} from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTableSortMenu,
  DataTableVirtual,
  Loader,
  MobileTable,
  SkeletonText,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import { usePoolsInfinite } from 'src/lib/hooks/api/use-pools-infinite'
import { type EvmAddress, SushiSwapProtocol, getEvmChainById } from 'sushi/evm'
import {
  ACTION_COLUMN,
  APR_WITH_REWARDS_COLUMN,
  BLANK_COLUMN,
  EXPLORE_NAME_COLUMN_POOL,
  TRANSACTIONS_1D_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
} from './columns'

const COLUMNS: ColumnDef<Pools[number], unknown>[] = [
  EXPLORE_NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_WITH_REWARDS_COLUMN,
  ACTION_COLUMN,
]

const MOBILE_COLUMNS: ColumnDef<Pools[number], unknown>[] = [
  EXPLORE_NAME_COLUMN_POOL,
  BLANK_COLUMN,
  ACTION_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_WITH_REWARDS_COLUMN,
]

const SORT_OPTIONS = [
  { id: 'liquidityUSD', label: 'TVL' },
  { id: 'volumeUSD1d', label: 'Volume (24h)' },
  { id: 'volumeUSD1w', label: 'Volume (1w)' },
  { id: 'txCount1d', label: 'Transactions (24h)' },
  { id: 'totalApr1d', label: 'APR' },
] satisfies { id: NonNullable<GetPools['orderBy']>; label: string }[]

function linkFormatter(row: Pools[number]): string {
  return `/${getEvmChainById(row.chainId).key}/pool/${
    row.protocol === SushiSwapProtocol.SUSHISWAP_V2 ? 'v2' : 'v3'
  }/${row.address}`
}

interface PoolsTableProps {
  chainId: PoolChainId
  onRowClick?(row: Pools[number]): void
  forcedTokenAddresses?: EvmAddress[]
}

export const PoolsTable: FC<PoolsTableProps> = ({
  chainId,
  onRowClick,
  forcedTokenAddresses,
}) => {
  const { tokenSymbols, protocols, farmsOnly, smartPoolsOnly } =
    usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const args = useMemo<Omit<GetPools, 'page'>>(() => {
    const tokenSymbolsSet = new Set([
      ...tokenSymbols.map((symbol) => symbol.toLowerCase()),
      ...(forcedTokenAddresses ?? []).map((address) => address.toLowerCase()),
    ])
    return {
      chainId,
      search: Array.from(tokenSymbolsSet),
      onlyIncentivized: farmsOnly,
      onlySmartPools: smartPoolsOnly,
      protocols,
      orderBy: sorting[0]?.id as GetPools['orderBy'],
      orderDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
    }
  }, [
    chainId,
    tokenSymbols,
    forcedTokenAddresses,
    farmsOnly,
    smartPoolsOnly,
    sorting,
    protocols,
  ])

  const { data: pools, isLoading, fetchNextPage } = usePoolsInfinite(args)

  const [data, count] = useMemo(
    () => [
      pools?.pages?.flatMap(({ data }) => data) ?? [],
      pools?.pages?.[0]?.count,
    ],
    [pools],
  )

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
    (row: Row<Pools[number]>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage}
      hasMore={data.length < (count ?? 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card className="!bg-transparent md:!bg-secondary !border-transparent md:!border-accent">
        <CardHeader className="!px-0 md:!px-6">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="shrink-0">
              {isLoading ? (
                <div className="!w-28 !h-[18px]">
                  <SkeletonText />
                </div>
              ) : (
                <span>
                  Pools{' '}
                  <span className="text-muted-foreground text-sm font-normal">
                    ({count ?? 0})
                  </span>
                </span>
              )}
            </CardTitle>
            <DataTableSortMenu
              label="pools"
              options={SORT_OPTIONS}
              sorting={sorting}
              onSortingChange={setSorting}
              className="md:hidden"
            />
          </div>
        </CardHeader>
        <div className="hidden md:block">
          <DataTableVirtual
            state={state}
            onSortingChange={setSorting}
            loading={isLoading}
            linkFormatter={linkFormatter}
            rowRenderer={rowRenderer}
            columns={COLUMNS}
            data={data}
          />
        </div>
        <div className="md:hidden">
          <MobileTable
            sorting={sorting}
            isLoading={isLoading}
            isExpandedOverride={true}
            hideExpand={true}
            linkFormatter={linkFormatter}
            onRowClick={onRowClick}
            getRowLabel={(pool) => `View ${pool.name} pool`}
            columns={MOBILE_COLUMNS}
            data={data}
          />
        </div>
      </Card>
    </InfiniteScroll>
  )
}

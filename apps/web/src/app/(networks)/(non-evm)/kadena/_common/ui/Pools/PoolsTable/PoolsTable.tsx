'use client'

import type { KadenaPool } from '@sushiswap/graph-client/kadena'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  Loader,
  SkeletonText,
} from '@sushiswap/ui'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAllPools } from '~kadena/_common/lib/hooks/use-all-pools'

import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import {
  APR_COLUMN,
  FEES_1D_COLUMN,
  NAME_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
} from './PoolColumns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  FEES_1D_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_COLUMN,
] satisfies ColumnDef<KadenaPool, unknown>[]

export const PoolsTable = () => {
  const { tokenSymbols } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const { data, fetchNextPage, hasNextPage, isLoading } = useAllPools({
    first: 50,
    orderBy: 'TVL_USD_DESC',
  })

  const rowLink = useCallback((row: KadenaPool | undefined) => {
    if (!row) return ''
    return `/kadena/pool/${encodeURIComponent(row.id)}`
  }, [])

  const filtered = useMemo(() => {
    if (!data?.pools) return [] as KadenaPool[]
    if (!tokenSymbols.length) return data.pools

    const normalizedSymbols = tokenSymbols.map((s) => s.toLowerCase())

    const normalizeSymbol = (symbol: string) =>
      'kda'.includes(symbol) ? 'coin' : symbol

    const matchesSymbol = (pool: KadenaPool, symbol: string) => {
      const token0Name = pool.token0.name.toLowerCase()
      const token1Name = pool.token1.name.toLowerCase()
      const token0Addr = pool.token0.address.toLowerCase()
      const token1Addr = pool.token1.address.toLowerCase()
      const poolName = `${token0Name}-${token1Name}`

      const normalized = normalizeSymbol(symbol)

      return (
        token0Addr.includes(normalized) ||
        token1Addr.includes(normalized) ||
        token0Name.includes(normalized) ||
        token1Name.includes(normalized) ||
        poolName.includes(normalized)
      )
    }

    return data.pools.filter((pool) =>
      normalizedSymbols.every((symbol) => matchesSymbol(pool, symbol)),
    )
  }, [tokenSymbols, data?.pools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filtered?.length,
      },
    }
  }, [sorting, filtered])

  return (
    <InfiniteScroll
      dataLength={filtered.length ?? 0}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={
        <div className="flex justify-center py-4 w-full">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              <div className="!w-28 !h-[18px]">
                <SkeletonText />
              </div>
            ) : (
              <span>
                Pools{' '}
                <span className="text-gray-400 dark:text-slate-500">
                  ({filtered.length})
                </span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          linkFormatter={rowLink}
          columns={COLUMNS}
          data={filtered}
        />
      </Card>
    </InfiniteScroll>
  )
}

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

import { usePoolFilters } from '~kadena/pool/[id]/pool-filters-provider'
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

    return data.pools.filter((pool) => {
      if (tokenSymbols.length) {
        if (
          !tokenSymbols.every((symbol) => {
            symbol = symbol.toLowerCase()

            const poolName = `${pool.token0.name}-${pool.token1.name}`

            if (poolName.toLowerCase().includes(symbol)) return true

            return false
          })
        ) {
          return false
        }
      }

      return true
    })
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

'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import type { SortingState, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import {
  type TopPool,
  useTopPools,
} from '~stellar/_common/lib/hooks/pool/use-top-pools'
import {
  APR_COLUMN,
  FEES_1D_COLUMN,
  NAME_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
} from './columns'

export const PoolsTable = () => {
  // Dynamic page links
  const rowLink = useCallback((row: TopPool) => {
    return `/stellar/pool/${row.address}`
  }, [])

  // Sort state
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  // Get the pool data
  const {
    data: topPools,
    isPending,
    isFetching,
    error,
    refetch,
  } = useTopPools()

  const { tokenSymbols } = usePoolFilters()

  const filteredMergedPools: TopPool[] = useMemo(() => {
    const pools = topPools ?? []
    if (tokenSymbols.length === 0) {
      return pools
    }
    return pools.filter((pool) => {
      const poolSearchTermsCaseInsensitive = [
        pool.token0.code.toLowerCase(),
        pool.token1.code.toLowerCase(),
      ]
      const poolSearchTermsCaseSensitive = [
        pool.address,
        pool.token0.contract,
        pool.token1.contract,
      ]
      return tokenSymbols.every((symbol) => {
        return (
          poolSearchTermsCaseInsensitive.some((term) =>
            term.startsWith(symbol.toLowerCase()),
          ) ||
          poolSearchTermsCaseSensitive.some((term) => term.startsWith(symbol))
        )
      })
    })
  }, [tokenSymbols, topPools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filteredMergedPools?.length,
      },
    }
  }, [sorting, filteredMergedPools])

  // Show error state with retry button
  if (error && !isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Failed to load pools. This may be due to a temporary network
              issue.
            </p>
            <p className="text-sm text-red-500 text-center">{error.message}</p>
            <Button onClick={() => refetch()} disabled={isFetching} size="sm">
              {isFetching ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isPending ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>
              Pools{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filteredMergedPools.length})
              </span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={isPending}
        linkFormatter={rowLink}
        columns={[
          NAME_COLUMN,
          TVL_COLUMN,
          VOLUME_1D_COLUMN,
          FEES_1D_COLUMN,
          TRANSACTIONS_1D_COLUMN,
          APR_COLUMN,
        ]}
        data={filteredMergedPools ?? []}
      />
    </Card>
  )
}

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
import { useAllPools } from '~stellar/_common/lib/hooks/pool/use-pool-info'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { SIMPLE_COLUMNS } from './columns-simple'

export const PoolsTable = () => {
  // Dynamic page links
  const rowLink = useCallback((row: PoolInfo) => {
    return `/stellar/pool/${row.address}`
  }, [])

  // Sort state
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidity', desc: true },
  ])

  // Get the pool data
  const { data: pools, isLoading, isFetching, error, refetch } = useAllPools()

  const { tokenSymbols } = usePoolFilters()

  const filteredPools = useMemo(() => {
    if (!pools) {
      return [] as PoolInfo[]
    }
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
  }, [pools, tokenSymbols])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filteredPools?.length,
      },
    }
  }, [sorting, filteredPools])

  // Show error state with retry button
  if (error && !isLoading) {
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
          {isLoading ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>
              Pools{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filteredPools.length})
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
        columns={SIMPLE_COLUMNS}
        data={filteredPools ?? []}
      />
    </Card>
  )
}

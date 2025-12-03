'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import type { SortingState, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
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
    { id: 'liquidity', desc: true },
  ])

  // Get the pool data
  const { data: topPools, isLoading: isLoadingTopPools } = useTopPools()

  const isLoading = isLoadingTopPools

  const { tokenSymbols } = usePoolFilters()

  const filteredPools = useMemo(() => {
    if (!topPools) {
      return []
    }
    if (tokenSymbols.length === 0) {
      return topPools ?? []
    }
    return topPools.filter((pool) => {
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
  }, [topPools, tokenSymbols])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filteredPools?.length,
      },
    }
  }, [sorting, filteredPools])

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
        columns={[
          NAME_COLUMN,
          TVL_COLUMN,
          VOLUME_1D_COLUMN,
          FEES_1D_COLUMN,
          TRANSACTIONS_1D_COLUMN,
          APR_COLUMN,
        ]}
        data={filteredPools ?? []}
      />
    </Card>
  )
}

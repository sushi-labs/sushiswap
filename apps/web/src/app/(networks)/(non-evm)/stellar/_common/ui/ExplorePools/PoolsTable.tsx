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
  const { data: pools, isLoading } = useAllPools()
  console.log('PoolsTable.tsx', { pools })

  const filteredPools = useMemo(() => {
    if (!pools) return [] as PoolInfo[]
    return pools
  }, [pools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filteredPools?.length,
      },
    }
  }, [sorting, filteredPools])

  if (!pools || pools.length === 0) return null

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
        data={pools}
      />
    </Card>
  )
}

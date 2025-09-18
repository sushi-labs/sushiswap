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
import { type IPool, usePools } from '~stellar/_common/lib/hooks/use-pools'
import { COLUMNS } from './columns'

export const PoolsTable = () => {
  // Dynamic page links
  const rowLink = useCallback((row: IPool) => {
    return `/stellar/pool/${row.address}`
  }, [])

  // Sort state
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  // Get the pool data
  const { data: pools, isLoading } = usePools()
  const filteredPools = useMemo(() => {
    if (!pools) return [] as IPool[]

    return pools
    // TODO: apply filtering
    // return pools?.filter((pool) => {
    //   return pool.name.toLowerCase().includes(search.toLowerCase())
    // })
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
        columns={COLUMNS}
        data={filteredPools}
      />
    </Card>
  )
}

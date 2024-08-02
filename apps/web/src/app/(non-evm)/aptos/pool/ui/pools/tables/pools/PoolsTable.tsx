'use client'

import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import {
  ColumnDef,
  PaginationState,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
// import { useNetwork } from 'lib/common/use-network'
// import { useFarms } from 'lib/pool/farm/use-farms'
import {
  type PoolExtended,
  usePoolsExtended,
} from '~aptos/pool/lib/use-pools-extended'
import { usePoolFilters } from '~aptos/pool/ui/pools/filters/pool-filters-provider'
import { NAME_COLUMN, RESERVE_COLUMN, TVL_COLUMN } from './columns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  // APR_COLUMN,
  RESERVE_COLUMN,
] satisfies ColumnDef<PoolExtended, unknown>[]

export const PoolsTable = () => {
  const { tokenSymbols /*, farmsOnly*/ } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'reserveUSD', desc: true },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: pools, isLoading } = usePoolsExtended()

  // const { data: farms } = useFarms()

  // const {
  //   contracts: { swap: swapContract },
  // } = useNetwork()

  const rowLink = useCallback((row: PoolExtended) => {
    return `/pool/${row.id}`
  }, [])

  const filtered = useMemo(() => {
    if (!pools) return []

    return pools?.filter((pool) => {
      // if (farmsOnly) {
      //   const isFarm = farms?.data?.lps.indexOf(
      //     `${swapContract}::swap::LPToken<${pool.id}>`,
      //   )
      //   if (isFarm === -1) return false
      // }

      if (tokenSymbols.length) {
        if (
          !tokenSymbols.every((symbol) => {
            symbol = symbol.toLowerCase()

            if (pool.token0.symbol.toLowerCase().includes(symbol)) {
              return true
            }

            if (pool.token1.symbol.toLowerCase().includes(symbol)) {
              return true
            }

            return false
          })
        ) {
          return false
        }
      }

      return true
    })
  }, [/*farms, swapContract, farmsOnly, */ tokenSymbols, pools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [sorting, pagination])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pools{' '}
          {filtered.length ? (
            <span className="text-gray-400 dark:text-slate-500">
              ({filtered.length})
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        loading={!pools && isLoading}
        linkFormatter={rowLink}
        columns={COLUMNS}
        data={filtered}
        pagination={true}
      />
    </Card>
  )
}

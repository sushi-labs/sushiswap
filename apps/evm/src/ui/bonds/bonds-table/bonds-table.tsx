'use client'

import { Bond, getBonds, getBondsUrl } from '@sushiswap/client'
import { BondsApiSchema } from '@sushiswap/client/api'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import React, { FC, useMemo, useState } from 'react'
import {
  BOND_ASSET_COLUMN,
  DISCOUNT_COLUMN,
  // ISSUER_COLUMN,
  PAYOUT_ASSET_COLUMN,
  PRICE_COLUMN,
  VESTING_COLUMN,
} from './bonds-table-columns'

const COLUMNS = [
  PAYOUT_ASSET_COLUMN,
  PRICE_COLUMN,
  DISCOUNT_COLUMN,
  BOND_ASSET_COLUMN,
  VESTING_COLUMN,
  // ISSUER_COLUMN,
] satisfies ColumnDef<Bond, unknown>[]

const emptyArray: any[] = []

export const BondsTable: FC = () => {
  const searchParams = useSearchParams()

  const args = useMemo(() => {
    return BondsApiSchema.parse(Object.fromEntries(searchParams))
  }, [searchParams])

  const { data, isLoading } = useQuery({
    queryKey: [getBondsUrl(args)],
    queryFn: () => getBonds(args),
    cacheTime: 0,
  })

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: 'discount', desc: true },
  ])

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bonds{' '}
          {data && (
            <span className="text-gray-400 dark:text-slate-500">
              ({data.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        columns={COLUMNS}
        data={data || emptyArray}
        linkFormatter={(row) => `/bonds/${row.id}`}
        pagination={true}
        onPaginationChange={setPaginationState}
        onSortingChange={setSortingState}
        state={{
          sorting: sortingState,
          pagination: paginationState,
        }}
      />
    </Card>
  )
}

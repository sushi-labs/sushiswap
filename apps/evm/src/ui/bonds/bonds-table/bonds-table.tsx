'use client'

import { Bond } from '@sushiswap/client'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import React, { FC, useState } from 'react'
import {
  BOND_ASSET_COLUMN,
  VESTING_COLUMN,
  DISCOUNT_COLUMN,
  ISSUER_COLUMN,
  PAYOUT_ASSET_COLUMN,
  PRICE_COLUMN,
} from './bonds-table-columns'

const COLUMNS = [
  PAYOUT_ASSET_COLUMN,
  PRICE_COLUMN,
  DISCOUNT_COLUMN,
  BOND_ASSET_COLUMN,
  VESTING_COLUMN,
  ISSUER_COLUMN,
] satisfies ColumnDef<Bond, unknown>[]

interface PositionsTableProps {
  data: Bond[]
  isLoading?: boolean
  onRowClick?(row: Bond): void
}

export const BondsTable: FC<PositionsTableProps> = ({
  data,
  isLoading = false,
}) => {
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
          <span className="text-gray-400 dark:text-slate-500">
            ({data?.length})
          </span>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        columns={COLUMNS}
        data={data}
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

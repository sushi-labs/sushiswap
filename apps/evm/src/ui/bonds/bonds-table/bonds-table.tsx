'use client'

import { Bond, getBonds, getBondsUrl } from '@sushiswap/client'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { FC, useState } from 'react'
import {
  BOND_ASSET_COLUMN,
  CLIFF_COLUMN,
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
  CLIFF_COLUMN,
  ISSUER_COLUMN,
] satisfies ColumnDef<Bond, unknown>[]

interface PositionsTableProps {
  initialData?: Bond[]
  onRowClick?(row: Bond): void
}

const tableState = { sorting: [{ id: 'discount', desc: true }] }

export const BondsTable: FC<PositionsTableProps> = ({ initialData = [] }) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isInitialLoading } = useQuery({
    queryKey: [getBondsUrl()],
    queryFn: () => getBonds({ isOpen: true }),
    initialData,
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
        loading={isInitialLoading}
        columns={COLUMNS}
        data={data}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          ...tableState,
          pagination: paginationState,
        }}
      />
    </Card>
  )
}

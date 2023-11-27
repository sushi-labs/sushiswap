'use client'

import { Pool } from '@sushiswap/client'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { FC, useState } from 'react'

const COLUMNS = [
  // PAYOUT_ASSET_COLUMN,
  // PRICE_COLUMN,
  // DISCOUNT_COLUMN,
  // BOND_ASSET_COLUMN,
  // CLIFF_COLUMN,
  // ISSUER_COLUMN,
] satisfies ColumnDef<Pool, unknown>[]

interface PositionsTableProps {
  onRowClick?(row: Pool): void
}

const tableState = { sorting: [{ id: 'value', desc: true }] }

export const BondsTable: FC<PositionsTableProps> = () => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const data = []

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bonds{' '}
          <span className="text-gray-400 dark:text-slate-500">
            ({data.length})
          </span>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={false}
        columns={COLUMNS}
        data={[]}
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

'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ResponsiveDataTable,
  Toggle,
  ToggleGroup,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactElement } from 'react'

const FILTERS = [
  { type: 'Swap', label: 'Swaps' },
  { type: 'Mint', label: 'Add' },
  { type: 'Burn', label: 'Remove' },
] as const

export type PoolTransactionFilter = (typeof FILTERS)[number]['type']

const EMPTY_TRANSACTIONS: never[] = []

interface PoolTransactionsCardProps<TTransaction> {
  columns: ColumnDef<TTransaction>[]
  transactions?: TTransaction[]
  isLoading: boolean
  filter: PoolTransactionFilter
  onFilterChange: (filter: PoolTransactionFilter) => void
  getTransactionUrl: (transaction: TTransaction) => string
}

export function PoolTransactionsCard<TTransaction>({
  columns,
  transactions = EMPTY_TRANSACTIONS,
  isLoading,
  filter,
  onFilterChange,
  getTransactionUrl,
}: PoolTransactionsCardProps<TTransaction>): ReactElement {
  return (
    <Card className="!bg-transparent lg:!bg-secondary !border-transparent lg:!border-accent">
      <CardHeader className="!px-0 !pt-3 lg:!px-6 lg:!pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Transactions</CardTitle>
          <ToggleGroup>
            {FILTERS.map(({ type, label }) => (
              <Toggle
                key={type}
                size="xs"
                pressed={filter === type}
                onClick={() => onFilterChange(type)}
              >
                {label}
              </Toggle>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="!px-0">
        <ResponsiveDataTable
          columns={columns}
          data={transactions}
          loading={isLoading}
          scrollMode="window"
          desktop={{
            linkFormatter: getTransactionUrl,
            externalLink: true,
            estimateSize: 52,
            skeletonRowCount: 10,
          }}
          mobile={{
            isExpandedOverride: true,
            hideExpand: true,
            rowRenderer: (row, card) => (
              <a
                href={getTransactionUrl(row.original)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink"
              >
                {card}
              </a>
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}

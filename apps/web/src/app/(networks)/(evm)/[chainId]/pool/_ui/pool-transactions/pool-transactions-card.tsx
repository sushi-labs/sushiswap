'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Toggle,
} from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import type { Hex } from 'viem'
import { getPoolTransactionColumns } from './columns'
import { type PoolTransaction, PoolTransactionType } from './types'

const TRANSACTION_TYPE_TOGGLES = [
  { type: PoolTransactionType.Swap, label: 'Swaps' },
  { type: PoolTransactionType.Mint, label: 'Add' },
  { type: PoolTransactionType.Burn, label: 'Remove' },
] as const

interface PoolTransactionsCardProps<T extends PoolTransaction> {
  type: PoolTransactionType
  onTypeChange(type: PoolTransactionType): void
  data: T[] | undefined
  isLoading: boolean
}

export function PoolTransactionsCard<T extends PoolTransaction>({
  type,
  onTypeChange,
  data,
  isLoading,
}: PoolTransactionsCardProps<T>) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useMemo(() => getPoolTransactionColumns<T>(type), [type])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col md:flex-row justify-between gap-y-4">
            Transactions
            <div className="flex items-center gap-1">
              {TRANSACTION_TYPE_TOGGLES.map((toggle) => (
                <Toggle
                  key={toggle.type}
                  variant="outline"
                  size="xs"
                  pressed={type === toggle.type}
                  onClick={() => onTypeChange(toggle.type)}
                >
                  {toggle.label}
                </Toggle>
              ))}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <DataTable
          linkFormatter={(row) =>
            getEvmChainById(row.pool.chainId).getTransactionUrl(
              row.transaction.id as Hex,
            ) ?? ''
          }
          loading={isLoading}
          columns={columns}
          data={data ?? []}
          pagination={true}
          externalLink={true}
          onPaginationChange={setPaginationState}
          state={{
            pagination: paginationState,
          }}
        />
      </CardContent>
    </Card>
  )
}

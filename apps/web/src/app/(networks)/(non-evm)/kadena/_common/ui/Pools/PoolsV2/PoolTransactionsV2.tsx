'use client'

import type {
  GetPoolResponse,
  PoolTransactionType,
} from '@sushiswap/graph-client/kadena'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Toggle,
} from '@sushiswap/ui'
import type {
  PaginationState,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { type FC, useCallback, useMemo, useState } from 'react'
import { getKvmChainByKey } from 'sushi/kvm'
import {
  type PoolTransaction,
  usePoolTransactions,
} from '~kadena/_common/lib/hooks/use-pool-transactions'
import { usePoolState } from '../../../../pool/pool-provider'
import {
  AMOUNT_USD_COLUMN,
  MAKER_COLUMN,
  TIMESTAMP_COLUMN,
  createAmountColumn,
} from './PoolTransactionsColumns'

interface PoolTransactionsV2Props {
  pool: GetPoolResponse | undefined
}

const initialPaginationState: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

export const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool }) => {
  const [type, setType] = useState<PoolTransactionType>('SWAP')

  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialPaginationState,
  )

  const { token0, token1 } = usePoolState()

  const { data, isLoading } = usePoolTransactions({
    pairId: pool?.id,
    type: type,
    pageSize: 1000,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true },
  ])

  const poolTransactions = useMemo(() => data?.transactions ?? [], [data])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: paginationState,
    }
  }, [sorting, paginationState])

  const rowLink = useCallback((row: PoolTransaction) => {
    return getKvmChainByKey('kadena').getTransactionUrl(row.requestkey)
  }, [])

  const token0Symbol = token0?.symbol ?? pool?.token0?.name ?? 'Token0'
  const token1Symbol = token1?.symbol ?? pool?.token1?.name ?? 'Token1'

  const COLUMNS = useMemo(() => {
    if (type === 'SWAP') {
      return [
        MAKER_COLUMN,
        createAmountColumn({
          accessorKey: 'amount0In',
          header: 'Amount In',
          token0Symbol: token0Symbol,
          token1Symbol: token1Symbol,
        }),
        createAmountColumn({
          accessorKey: 'amount1Out',
          header: 'Amount Out',
          token0Symbol: token0Symbol,
          token1Symbol: token1Symbol,
        }),
        AMOUNT_USD_COLUMN,
        TIMESTAMP_COLUMN,
      ]
    }

    const accessor1 = type === 'ADD_LIQUIDITY' ? 'amount1In' : 'amount0Out'

    return [
      MAKER_COLUMN,
      createAmountColumn({
        accessorKey: 'amount0In',
        header: 'Token 0',
        token0Symbol: token0Symbol,
        token1Symbol: token1Symbol,
      }),
      createAmountColumn({
        accessorKey: accessor1,
        header: 'Token 1',
        token0Symbol: token0Symbol,
        token1Symbol: token1Symbol,
      }),
      AMOUNT_USD_COLUMN,
      TIMESTAMP_COLUMN,
    ]
  }, [type, token0Symbol, token1Symbol])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col justify-between md:flex-row gap-y-4">
            Transactions
            <div className="flex items-center gap-1">
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === 'SWAP'}
                onClick={() => {
                  setType('SWAP')
                  setPaginationState(initialPaginationState)
                }}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === 'ADD_LIQUIDITY'}
                onClick={() => {
                  setType('ADD_LIQUIDITY')
                  setPaginationState(initialPaginationState)
                }}
              >
                Add
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === 'REMOVE_LIQUIDITY'}
                onClick={() => {
                  setType('REMOVE_LIQUIDITY')
                  setPaginationState(initialPaginationState)
                }}
              >
                Remove
              </Toggle>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <DataTable
          loading={isLoading}
          columns={COLUMNS}
          data={poolTransactions}
          onSortingChange={setSorting}
          linkFormatter={rowLink}
          pagination={true}
          externalLink={true}
          onPaginationChange={setPaginationState}
          state={state}
        />
      </CardContent>
    </Card>
  )
}

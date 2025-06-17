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
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  TransactionType,
  usePoolTransactions,
} from '~kadena/_common/lib/hooks/use-pool-transactions'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import type {
  PoolByIdResponse,
  PoolTransaction,
} from '~kadena/_common/types/get-pool-by-id'
import {
  AMOUNT_USD_COLUMN,
  MAKER_COLUMN,
  TIMESTAMP_COLUMN,
  createAmountColumn,
} from './PoolTransactionsColumns'

interface PoolTransactionsV2Props {
  pool: PoolByIdResponse | undefined
}

export const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.SWAP)

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePoolTransactions({
      pairId: pool?.id,
      type: type,
      pageSize: paginationState.pageSize,
    })

  const start = paginationState.pageIndex * paginationState.pageSize
  const end = start + paginationState.pageSize
  const pageRows = data?.transactions.slice(start, end)

  useEffect(() => {
    if (
      data?.transactions &&
      end > data?.transactions?.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [data?.transactions, fetchNextPage, end, hasNextPage, isFetchingNextPage])

  const rowLink = useCallback((row: PoolTransaction) => {
    return getChainwebTxnLink(row.maker)
  }, [])

  const token0Symbol = pool?.token0?.name ?? 'Token0'
  const token1Symbol = pool?.token1?.name ?? 'Token1'

  const COLUMNS = useMemo(() => {
    if (type === TransactionType.SWAP) {
      return [
        MAKER_COLUMN,
        createAmountColumn({
          accessorKey: 'amount0In',
          header: 'Amount In',
          tokenSymbol: token0Symbol,
        }),
        createAmountColumn({
          accessorKey: 'amount1Out',
          header: 'Amount Out',
          tokenSymbol: token1Symbol,
        }),
        AMOUNT_USD_COLUMN,
        TIMESTAMP_COLUMN,
      ]
    }

    const accessor0 =
      type === TransactionType.ADD_LIQUIDITY ? 'amount0In' : 'amount0Out'
    const accessor1 =
      type === TransactionType.ADD_LIQUIDITY ? 'amount1In' : 'amount1Out'

    return [
      MAKER_COLUMN,
      createAmountColumn({
        accessorKey: accessor0,
        header: 'Token 0',
        tokenSymbol: token0Symbol,
      }),
      createAmountColumn({
        accessorKey: accessor1,
        header: 'Token 1',
        tokenSymbol: token1Symbol,
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
                pressed={type === TransactionType.SWAP}
                onClick={() => setType(TransactionType.SWAP)}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionType.ADD_LIQUIDITY}
                onClick={() => setType(TransactionType.ADD_LIQUIDITY)}
              >
                Add
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionType.REMOVE_LIQUIDITY}
                onClick={() => setType(TransactionType.REMOVE_LIQUIDITY)}
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
          data={pageRows ?? ([] as unknown as PoolTransaction[])}
          linkFormatter={rowLink}
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

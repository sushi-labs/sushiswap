'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Toggle,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { type FC, useCallback, useState } from 'react'

import type { useTransactionsV2 } from 'src/ui/pool/PoolTransactionsV2'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import type {
  PoolByIdResponse,
  PoolTransaction,
} from '~kadena/_common/types/get-pool-by-id'
import {
  AMOUNT_IN_COLUMN,
  AMOUNT_OUT_COLUMN,
  AMOUNT_USD_COLUMN,
  TIMESTAMP_COLUMN,
} from './PoolTransactionsColumns'
import { MAKER_COLUMN } from './PoolTransactionsColumns'

export enum TransactionType {
  Mint = 'Mint',
  Burn = 'Burn',
  Swap = 'Swap',
}

interface PoolTransactionsV2Props {
  pool: PoolByIdResponse | undefined
}

const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool }) => {
  const [type, setType] = useState<
    Parameters<typeof useTransactionsV2>['2']['type']
  >(TransactionType.Swap)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const COLUMNS = [
    MAKER_COLUMN,
    AMOUNT_IN_COLUMN,
    AMOUNT_OUT_COLUMN,
    AMOUNT_USD_COLUMN,
    TIMESTAMP_COLUMN,
  ] satisfies ColumnDef<PoolTransaction, unknown>[]

  // const opts = useMemo(
  //   () =>
  //     ({
  //       refetchInterval: 60_000,
  //       first:
  //         paginationState.pageSize === 0 ? paginationState.pageIndex + 1 : 100,
  //       type,
  //     }) as const,
  //   [paginationState.pageIndex, paginationState.pageSize, type],
  // )

  const rowLink = useCallback((row: PoolTransaction) => {
    return getChainwebTxnLink(row.maker)
  }, [])

  const isLoading = pool === undefined
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
                pressed={type === TransactionType.Swap}
                onClick={() => setType(TransactionType.Swap)}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionType.Mint}
                onClick={() => setType(TransactionType.Mint)}
              >
                Add
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionType.Burn}
                onClick={() => setType(TransactionType.Burn)}
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
          data={pool?.transactions}
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

export { PoolTransactionsV2 }

import { RadioGroup } from '@headlessui/react'
import { Chain } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { DataTable } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { PaginationState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { AMOUNT_IN_COLUMN, AMOUNT_OUT_COLUMN, AMOUNT_USD_COLUMN, SENDER_COLUMN, TIME_COLUMN } from './columns'
import { TransactionType, useTransactionsV2 } from './useTransactionsV2'

interface PoolTransactionsV2Props {
  pool: Pool | undefined | null
  poolId: string
}

export const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool, poolId }) => {
  const [type, setType] = useState<Parameters<typeof useTransactionsV2>['2']['type']>(TransactionType.Swap)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const COLUMNS = useMemo(() => {
    return [SENDER_COLUMN, AMOUNT_IN_COLUMN(type), AMOUNT_OUT_COLUMN(type), AMOUNT_USD_COLUMN, TIME_COLUMN]
  }, [type])

  const opts = useMemo(
    () =>
      ({
        refetchInterval: 60_000,
        first: paginationState.pageSize === 0 ? paginationState.pageIndex + 1 : 100,
        type,
      } as const),
    [paginationState.pageIndex, paginationState.pageSize, type]
  )

  const { data, isLoading } = useTransactionsV2(pool, poolId, opts)

  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return (
    <div>
      <RadioGroup value={type} onChange={setType} className="flex gap-1 mb-3">
        <RadioGroup.Option value={TransactionType.Swap}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Swaps
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Mint}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Add liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Burn}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Remove liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <DataTable
        linkFormatter={(row) => Chain.from(row.pool.chainId).getTxUrl(row.txHash)}
        loading={isLoading}
        columns={COLUMNS}
        data={_data}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          pagination: paginationState,
        }}
      />
    </div>
  )
}

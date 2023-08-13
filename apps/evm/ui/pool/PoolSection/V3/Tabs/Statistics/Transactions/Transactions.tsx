import { RadioGroup } from '@headlessui/react'
import { Chain } from '@sushiswap/chain'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import { Paginator } from '@sushiswap/ui/components/table/Paginator'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SushiSwapV3Pool } from '@sushiswap/v3-sdk'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { AMOUNT_IN_COLUMN, AMOUNT_OUT_COLUMN, AMOUNT_USD_COLUMN, SENDER_COLUMN, TIME_COLUMN } from './columns'
import { Transaction, TransactionType, useTransactions } from './useTransactions'

interface TransactionsProps {
  pool: SushiSwapV3Pool | undefined | null
  poolId: string
}

const TOTAL_ROWS = 200
const PAGE_SIZE = 10
const PAGE_COUNT = TOTAL_ROWS / PAGE_SIZE

export const Transactions: FC<TransactionsProps> = ({ pool, poolId }) => {
  const [type, setType] = useState<Parameters<typeof useTransactions>['2']['type']>(TransactionType.Swap)
  const [pageIndex, setPageIndex] = useState<number>(0)

  const COLUMNS = useMemo(() => {
    return [SENDER_COLUMN, AMOUNT_IN_COLUMN(type), AMOUNT_OUT_COLUMN(type), AMOUNT_USD_COLUMN, TIME_COLUMN]
  }, [type])

  const opts = useMemo(
    () =>
      ({
        refetchInterval: 60_000,
        // Fetch first 10 (+1 for paging) on initial load, then TOTAL_ROWS after
        first: pageIndex === 0 ? PAGE_SIZE + 1 : TOTAL_ROWS,
        type,
      } as const),
    [pageIndex, type]
  )

  const { data, isLoading } = useTransactions(pool, poolId, opts)

  const dataPaginated = useMemo(
    () => (data ? data.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE) : []),
    [data, pageIndex]
  )

  const table = useReactTable<Transaction>({
    data: dataPaginated as Transaction[],
    columns: COLUMNS,
    pageCount: pageIndex + 1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return (
    <div>
      <RadioGroup value={type} onChange={setType} className="flex justify-end gap-1 px-2 mb-6">
        <RadioGroup.Option value={TransactionType.Swap}>
          {({ checked }) => (
            <Toggle size="sm" pressed={checked}>
              Swaps
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Mint}>
          {({ checked }) => (
            <Toggle size="sm" pressed={checked}>
              Add liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Burn}>
          {({ checked }) => (
            <Toggle size="sm" pressed={checked}>
              Remove liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <GenericTable<Transaction>
        table={table}
        loading={isLoading}
        pageSize={PAGE_SIZE}
        rowHeight={24}
        placeholder="No Transactions Found."
        linkFormatter={(row) => Chain.from(row.pool.chainId).getTxUrl(row.id)}
      />
      <Paginator
        page={pageIndex}
        hasPrev={pageIndex > 0}
        onNext={() => setPageIndex(pageIndex + 1)}
        hasNext={pageIndex < PAGE_COUNT - 1 && !!data && data?.length > (pageIndex + 1) * PAGE_SIZE}
        onPrev={() => setPageIndex(pageIndex - 1)}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}

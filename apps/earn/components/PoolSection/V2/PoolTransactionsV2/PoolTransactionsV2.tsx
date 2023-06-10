import React, { FC, useMemo, useState } from 'react'
import { Transaction, TransactionType, useTransactionsV2 } from './useTransactionsV2'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { AMOUNT_IN_COLUMN, AMOUNT_OUT_COLUMN, AMOUNT_USD_COLUMN, SENDER_COLUMN, TIME_COLUMN } from './columns'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { Chain } from '@sushiswap/chain'
import { Paginator } from '@sushiswap/ui/table/Paginator'
import { RadioGroup } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { Pool } from '@sushiswap/client'

interface PoolTransactionsV2Props {
  pool: Pool | undefined | null
  poolId: string
}

const TOTAL_ROWS = 200
const PAGE_SIZE = 10
const PAGE_COUNT = TOTAL_ROWS / PAGE_SIZE

export const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool, poolId }) => {
  const [type, setType] = useState<Parameters<typeof useTransactionsV2>['2']['type']>(TransactionType.Swap)
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

  const { data, isLoading } = useTransactionsV2(pool, poolId, opts)

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
      <RadioGroup value={type} onChange={setType} className="flex gap-1 mb-6 justify-end px-2">
        <RadioGroup.Option value={TransactionType.Swap}>
          {({ checked }) => (
            <Button
              size="xs"
              variant={checked ? 'outlined' : 'empty'}
              color={checked ? 'blue' : 'default'}
              className="!h-[24px] font-bold"
            >
              Swaps
            </Button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Mint}>
          {({ checked }) => (
            <Button
              size="xs"
              variant={checked ? 'outlined' : 'empty'}
              color={checked ? 'blue' : 'default'}
              className="!h-[24px] font-bold"
            >
              Add liquidity
            </Button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Burn}>
          {({ checked }) => (
            <Button
              size="xs"
              variant={checked ? 'outlined' : 'empty'}
              color={checked ? 'blue' : 'default'}
              className="!h-[24px] font-bold"
            >
              Remove liquidity
            </Button>
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <GenericTable<Transaction>
        table={table}
        loading={isLoading}
        pageSize={PAGE_SIZE}
        rowHeight={24}
        placeholder="No Transactions Found."
        linkFormatter={(row) => Chain.from(row.pool.chainId).getTxUrl(row.txHash)}
      />
      <Paginator
        page={pageIndex}
        hasPrev={pageIndex > 0}
        onNext={() => setPageIndex(pageIndex + 1)}
        onPage={() => {}}
        hasNext={pageIndex < PAGE_COUNT - 1 && !!data && data?.length > (pageIndex + 1) * PAGE_SIZE}
        onPrev={() => setPageIndex(pageIndex - 1)}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}

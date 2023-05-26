import { Pool } from '@sushiswap/v3-sdk'
import { FC, useMemo, useState } from 'react'
import { Transaction, TransactionType, useTransactionsV3 } from './useTransactionsV3'
import {
  PaginationState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AMOUNT_COLUMN, AMOUNT_USD_COLUMN, SENDER_COLUMN, TIME_COLUMN, TYPE_COLUMN } from './columns'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { Chain } from '@sushiswap/chain'
import { Paginator } from '@sushiswap/ui/table/Paginator'
import { classNames } from '@sushiswap/ui'

interface PoolTransactionsV3Props {
  pool: Pool | undefined | null
  poolId: string
}

const COLUMNS = [TYPE_COLUMN, SENDER_COLUMN, AMOUNT_COLUMN, AMOUNT_USD_COLUMN, TIME_COLUMN]

const TOTAL_ROWS = 200

const PAGE_SIZE = 10
const PAGE_COUNT = TOTAL_ROWS / PAGE_SIZE

export const PoolTransactionsV3: FC<PoolTransactionsV3Props> = ({ pool, poolId }) => {
  const [type, setType] = useState<Parameters<typeof useTransactionsV3>['2']['type']>('All')
  const [pageIndex, setPageIndex] = useState<number>(0)

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

  const { data, isLoading } = useTransactionsV3(pool, poolId, opts)

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
    <div className="w-full pt-3 space-y-2">
      <div className="flex items-center justify-between text-gray-300">
        <div>Transactions</div>
        <div className="flex flex-row space-x-2 text-sm select-none">
          <div
            onClick={() => setType('All')}
            className={classNames('cursor-pointer text-gray-400', type === 'All' && 'text-gray-300 font-bold')}
          >
            All
          </div>
          <div
            onClick={() => setType(TransactionType.Swap)}
            className={classNames(
              'cursor-pointer text-gray-400',
              type === TransactionType.Swap && 'text-gray-300 font-bold'
            )}
          >
            Swaps
          </div>
          <div
            onClick={() => setType(TransactionType.Burn)}
            className={classNames(
              'cursor-pointer text-gray-400',
              type === TransactionType.Burn && 'text-gray-300 font-bold'
            )}
          >
            Burns
          </div>
          <div
            onClick={() => setType(TransactionType.Mint)}
            className={classNames(
              'cursor-pointer text-gray-400',
              type === TransactionType.Mint && 'text-gray-300 font-bold'
            )}
          >
            Mints
          </div>
          <div
            onClick={() => setType(TransactionType.Collect)}
            className={classNames(
              'cursor-pointer text-gray-400',
              type === TransactionType.Collect && 'text-gray-300 font-bold'
            )}
          >
            Collects
          </div>
        </div>
      </div>

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
        onPage={() => {}}
        hasNext={pageIndex < PAGE_COUNT - 1 && !!data && data?.length > (pageIndex + 1) * PAGE_SIZE}
        onPrev={() => setPageIndex(pageIndex - 1)}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}

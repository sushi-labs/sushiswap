import { ColumnDef } from '@tanstack/react-table'
import { Transaction, TransactionType } from './useTransactionsV3'
import { formatUSD } from '@sushiswap/format'
import formatDistance from 'date-fns/formatDistance/index.js'
import { Skeleton } from '@sushiswap/ui'
import { useMemo } from 'react'
import { ChevronRightIcon } from '@heroicons/react/solid'

export const TYPE_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => <div className="text-sm">{TransactionType[props.row.original.type]}</div>,
  meta: {
    skeleton: (
      <div className="flex">
        <Skeleton.Box className="w-[34px] h-[20px]" />
      </div>
    ),
  },
}

export const SENDER_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'sender',
  header: 'Sender',
  cell: (props) => (
    <div className="text-sm">{`${props.row.original.origin.slice(0, 6)}..${props.row.original.origin.slice(-4)}`}</div>
  ),
  meta: {
    skeleton: (
      <div className="flex">
        <Skeleton.Box className="w-[80px] h-[20px]" />
      </div>
    ),
  },
}

export const AMOUNT_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amounts',
  header: 'Amounts',
  cell: (props) => {
    const row = props.row.original

    return useMemo(() => {
      switch (row.type) {
        case TransactionType.Swap: {
          const amounts = row.amount0 < 0 ? [row.amount0, row.amount1] : [row.amount1, row.amount0]
          const tokens = row.amount0 < 0 ? [row.pool.token0, row.pool.token1] : [row.pool.token1, row.pool.token0]

          return (
            <div className="grid grid-flow-col grid-cols-7 items-center text-[10px] w-4/5">
              <div className="flex items-center justify-start col-span-3">
                <div className="flex flex-col">
                  <div className="flex justify-center">{Math.abs(amounts[0]).toFixed(2)}</div>
                  <div className="flex justify-center">{tokens[0].symbol}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ChevronRightIcon width={16} height={16} className="min-h-[12px] min-w-[12px]" />
              </div>
              <div className="flex items-center justify-end col-span-3">
                <div className="flex flex-col">
                  <div className="flex justify-center">{amounts[1].toFixed(2)}</div>
                  <div className="flex justify-center">{tokens[1].symbol}</div>
                </div>
              </div>
            </div>
          )
        }
        case TransactionType.Mint:
        case TransactionType.Burn:
        case TransactionType.Collect:
          return (
            <div className="grid grid-flow-col grid-cols-7 items-center text-[10px] w-4/5">
              <div className="flex flex-col items-center col-span-3">
                <div className="flex">{row.amount0.toFixed(2)}</div>
                <div className="flex">{row.pool.token0.symbol}</div>
              </div>
              <div className="flex justify-end text-sm">{`+`}</div>
              <div className="flex items-center justify-end col-span-3">
                <div className="flex flex-col">
                  <div className="flex justify-center">{row.amount1.toFixed(2)}</div>
                  <div className="flex justify-center">{row.pool.token1.symbol}</div>
                </div>
              </div>
            </div>
          )
      }
    }, [])
  },
  meta: {
    className: 'justify-center',
    skeleton: (
      <div className="flex justify-end">
        <Skeleton.Box className="w-[113px] h-[40px]" />
      </div>
    ),
  },
}

export const AMOUNT_USD_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => <div className="text-sm">{formatUSD(props.row.original.amountUSD)}</div>,
  meta: {
    className: 'justify-end',
    skeleton: (
      <div className="flex justify-end">
        <Skeleton.Box className="w-[60px] h-[20px]" />
      </div>
    ),
  },
}

export const TIME_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) => (
    <div className="flex justify-end w-full text-sm">
      {formatDistance(props.row.original.timestamp * 1000, new Date(), { addSuffix: true })}
    </div>
  ),
  meta: {
    className: 'justify-end',
    skeleton: (
      <div className="flex justify-end">
        <Skeleton.Box className="w-[110px] h-[20px]" />
      </div>
    ),
  },
}

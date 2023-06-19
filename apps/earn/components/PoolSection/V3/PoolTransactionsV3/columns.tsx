import { ColumnDef } from '@tanstack/react-table'
import { Transaction, TransactionType, useTransactionsV3 } from './useTransactionsV3'
import { formatUSD } from '@sushiswap/format'
import formatDistance from 'date-fns/formatDistance/index.js'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import React from 'react'

export const TYPE_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      {TransactionType[props.row.original.type]}
    </span>
  ),
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const SENDER_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">{`${props.row.original.origin.slice(
      0,
      6
    )}..${props.row.original.origin.slice(-4)}`}</span>
  ),
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const AMOUNT_IN_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type']
): ColumnDef<Transaction, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionType.Swap ? 'Amount in' : 'Token 0',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionType.Swap: {
        const amounts = row.amount0 < 0 ? [row.amount0, row.amount1] : [row.amount1, row.amount0]
        const tokens = row.amount0 < 0 ? [row.pool.token0, row.pool.token1] : [row.pool.token1, row.pool.token0]

        return (
          <span className="font-normal">
            <span className="font-semibold">{Math.abs(amounts[0]).toPrecision(6)}</span>{' '}
            <span className="text-gray-600 dark:text-slate-400">{tokens[0].symbol}</span>
          </span>
        )
      }
      case TransactionType.Mint:
      case TransactionType.Burn:
      case TransactionType.Collect:
        return (
          <span className="font-normal">
            <span className="font-semibold">{row.amount0.toPrecision(6)}</span>{' '}
            <span className="text-gray-600 dark:text-slate-400">{row.pool.token0.symbol}</span>
          </span>
        )
    }
  },
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
})

export const AMOUNT_OUT_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type']
): ColumnDef<Transaction, unknown> => ({
  id: 'amount_out',
  header: type === TransactionType.Swap ? 'Amount out' : 'Token 1',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionType.Swap: {
        const amounts = row.amount0 < 0 ? [row.amount0, row.amount1] : [row.amount1, row.amount0]
        const tokens = row.amount0 < 0 ? [row.pool.token0, row.pool.token1] : [row.pool.token1, row.pool.token0]

        return (
          <span className="font-normal">
            <span className="font-semibold">{Math.abs(amounts[1]).toFixed(2)}</span>{' '}
            <span className="text-gray-600 dark:text-slate-400">{tokens[1].symbol}</span>
          </span>
        )
      }
      case TransactionType.Mint:
      case TransactionType.Burn:
      case TransactionType.Collect:
        return (
          <span className="font-normal">
            <span className="font-semibold">{row.amount1.toFixed(2)}</span>{' '}
            <span className="text-gray-600 dark:text-slate-400">{row.pool.token1.symbol}</span>
          </span>
        )
    }
  },
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
})

export const AMOUNT_USD_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      {formatUSD(props.row.original.amountUSD)}
    </span>
  ),
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TIME_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      {formatDistance(props.row.original.timestamp * 1000, new Date(), { addSuffix: true })}
    </span>
  ),
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

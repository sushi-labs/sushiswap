import { FormattedNumber } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import formatDistance from 'date-fns/formatDistance'
import React from 'react'
import { formatUSD } from 'sushi'
import { shortenEvmAddress } from 'sushi/evm'

import {
  type Transaction,
  TransactionType,
  type useTransactionsV2,
} from './pool-transactions-v2'

export const TX_SENDER_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => shortenEvmAddress(props.row.original.sender),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_AMOUNT_IN_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type'],
): ColumnDef<Transaction, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionType.Swap ? 'Amount in' : 'Token 0',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return (
          <span>
            <FormattedNumber
              number={
                row.original.amount0In !== '0'
                  ? row.original.amount0In
                  : row.original.amount1In
              }
            />{' '}
            {row.original.amount0In !== '0'
              ? row.original.symbol0
              : row.original.symbol1}
          </span>
        )
      case TransactionType.Mint:
      case TransactionType.Burn:
        return (
          <span>
            <FormattedNumber number={row.original.amount0.toPrecision(6)} />{' '}
            {row.original.symbol0}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_OUT_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type'],
): ColumnDef<Transaction, unknown> => ({
  id: 'amount_out',
  header: type === TransactionType.Swap ? 'Amount out' : 'Token 1',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return (
          <span>
            <FormattedNumber
              number={Math.abs(
                row.original.amount0Out !== '0'
                  ? Number(row.original.amount0Out)
                  : Number(row.original.amount1Out),
              ).toPrecision(2)}
            />{' '}
            {row.original.amount0Out !== '0'
              ? row.original.symbol0
              : row.original.symbol1}
          </span>
        )
      case TransactionType.Mint:
      case TransactionType.Burn:
        return (
          <span>
            <FormattedNumber number={row.original.amount1.toPrecision(2)} />{' '}
            {row.original.symbol1}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_USD_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => formatUSD(props.row.original.amountUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_CREATED_TIME_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) =>
    formatDistance(props.row.original.createdAtTimestamp * 1000, new Date(), {
      addSuffix: true,
    }),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

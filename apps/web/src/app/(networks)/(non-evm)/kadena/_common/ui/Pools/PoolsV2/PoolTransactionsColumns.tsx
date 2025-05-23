import { SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatUSD } from 'sushi/format'
import type { PoolTransaction } from '~kadena/_common/types/get-pool-by-id'

export const MAKER_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'maker',
  header: 'Maker',
  accessorFn: (row) => row.maker,
  cell: (props) => props.getValue(),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const AMOUNT_IN_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'amountIn',
  header: 'Amount In',
  accessorFn: (row) =>
    Number(row.amount0In) > 0
      ? `${row.amount0In} Token0`
      : `${row.amount1In} Token1`,
  cell: (props) => props.getValue(),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const AMOUNT_OUT_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'amountOut',
  header: 'Amount Out',
  accessorFn: (row) =>
    Number(row.amount0Out) > 0
      ? `${row.amount0Out} Token0`
      : `${row.amount1Out} Token1`,
  cell: (props) => props.getValue(),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const AMOUNT_USD_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'amountUsd',
  header: 'Amount (USD)',
  accessorFn: (row) => row.amountUsd,
  cell: (props) => formatUSD(props.row.original.amountUsd),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TIMESTAMP_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  cell: (props) => {
    const date = new Date(props.row.original.timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

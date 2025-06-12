import { SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatUSD } from 'sushi/format'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
import type { PoolTransaction } from '~kadena/_common/types/get-pool-by-id'

export const MAKER_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'maker',
  header: 'Maker',
  accessorFn: (row) => row.maker,
  cell: (props) => truncateText(props.getValue() as string),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const AMOUNT_USD_COLUMN: ColumnDef<PoolTransaction> = {
  id: 'amountUsd',
  header: 'Amount (USD)',
  accessorFn: (row) => row.amountUsd,
  cell: (props) => formatUSD(props.row.original.amountUsd),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
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
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export function createAmountColumn({
  accessorKey,
  header,
  tokenSymbol,
}: {
  accessorKey: keyof PoolTransaction
  header: string
  tokenSymbol: string
}): ColumnDef<PoolTransaction, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string
      return `${Number.parseFloat(value).toFixed(4)} ${tokenSymbol}`
    },
  }
}

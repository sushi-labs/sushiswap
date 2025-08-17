import { FormattedNumber, SkeletonText } from '@sushiswap/ui'
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
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    return <span className="whitespace-nowrap">{formattedDate}</span>
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
  token0Symbol,
  token1Symbol,
}: {
  accessorKey: keyof PoolTransaction
  header: string
  token0Symbol: string
  token1Symbol: string
}): ColumnDef<PoolTransaction, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ row }) => {
      let value = row.getValue(accessorKey) as string
      let tokenSymbol = ''

      //SWAP
      if (row.original.transactionType === 'SWAP') {
        if (value === '0' && accessorKey === 'amount0In') {
          tokenSymbol = token1Symbol
          value = row.original.amount1In
        } else if (accessorKey === 'amount0In' && value !== '0') {
          tokenSymbol = token0Symbol
        }

        if (value === '0' && accessorKey === 'amount1Out') {
          tokenSymbol = token0Symbol
          value = row.original.amount0Out
        } else if (accessorKey === 'amount1Out' && value !== '0') {
          tokenSymbol = token1Symbol
        }
      }

      //REMOVE_LIQUIDITY
      if (row.original.transactionType === 'REMOVE_LIQUIDITY') {
        tokenSymbol = token1Symbol
        if (value === '0' && accessorKey === 'amount0In') {
          tokenSymbol = token0Symbol
          value = row.original.amount1Out
        }

        if (value === '0' && accessorKey === 'amount1Out') {
          value = row.original.amount1In
        }
      }

      //ADD_LIQUIDITY
      if (row.original.transactionType === 'ADD_LIQUIDITY') {
        tokenSymbol = token0Symbol
        if (accessorKey === 'amount0In') {
          value = row.original.amount0In
        }

        if (accessorKey === 'amount1In') {
          value = row.original.amount1In
          tokenSymbol = token1Symbol
        }
      }

      return (
        <span>
          <FormattedNumber number={Number.parseFloat(value).toPrecision(2)} />{' '}
          {tokenSymbol}
        </span>
      )
    },
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  }
}

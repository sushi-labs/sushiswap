import { ArrowUpRightIcon } from '@heroicons/react/24/outline'

import {
  Chip,
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DollarCircledIcon } from 'src/ui/icons/dollar-circled'
import type { Native } from 'sushi/currency'
import { formatPercent, formatUSD, shortenHash } from 'sushi/format'
import { formatNumber } from 'sushi/format'

export type DCAOrderDetails = {
  id: string
  orderId: string
  date: number
  buyAmount: number
  sellAmount: number
  sellToken: Native
  buyToken: Native
  priceUsd: number
  valueUsd: number
  txHash: string
}

export const DATE_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.date,
  cell: ({ row }) => format(new Date(row.original.date), 'MM/dd/yy h:mm a'),
}

export const BUY_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,

  accessorFn: (row) => row.buyAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon currency={row.original.buyToken} width={18} height={18} />
      <span>
        {formatNumber(row.original.buyAmount)} {row.original.buyToken.symbol}
      </span>
    </div>
  ),
}

export const SELL_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'sell',
  header: 'Sell',
  enableSorting: false,

  accessorFn: (row) => row.sellAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon currency={row.original.sellToken} width={18} height={18} />
      <span>
        {formatNumber(row.original.sellAmount)} {row.original.sellToken.symbol}
      </span>
    </div>
  ),
}

export const VALUE_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'valueUsd',
  header: 'Value',
  enableSorting: false,
  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.valueUsd)}</span>,
}

export const PRICE_USD_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'priceUsd',
  enableSorting: false,

  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-start gap-1">
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current">
              <DollarCircledIcon className="w-3 h-3" />
              <span>USD</span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle to view price in USD or token pair unit.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.priceUsd)}</span>,
}

export const TX_HASH_COLUMN: ColumnDef<DCAOrderDetails> = {
  id: 'txHash',
  header: 'Tx Hash',
  enableSorting: false,
  accessorFn: (row) => row.txHash,
  cell: ({ row }) => (
    <a
      href={`https://etherscan.io/tx/${row.original.txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="dark:text-skyblue hover:underline"
    >
      {shortenHash(row.original.txHash)}
    </a>
  ),
}

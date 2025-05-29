import { XMarkIcon } from '@heroicons/react/24/solid'

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
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'
import type { LimitOrder } from './limit-orders-table'

export const BUY_COLUMN: ColumnDef<LimitOrder> = {
  id: 'buy',
  header: 'Buy',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon
        disableLink
        currency={row.original.buyToken}
        width={24}
        height={24}
      />{' '}
      <span>
        {formatNumber(row.original.buyAmount)} {row.original.buyToken.symbol}
      </span>
    </div>
  ),
}

export const SELL_COLUMN: ColumnDef<LimitOrder> = {
  id: 'sell',
  header: 'Sell',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => {
    console.log('Sell Token:', row.original.sellToken)
    return (
      <div className="flex items-center gap-2">
        <Currency.Icon
          disableLink
          currency={row.original.sellToken}
          width={24}
          height={24}
        />
        <span>
          {formatNumber(row.original.sellAmount)}{' '}
          {row.original.sellToken.symbol}
        </span>
      </div>
    )
  },
}

export const CHAIN_COLUMN: ColumnDef<LimitOrder> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => row.chainId,
  cell: ({ row }) => (
    <NetworkIcon
      type="square"
      chainId={row.original.chainId}
      width={20}
      height={20}
      className="rounded-sm"
    />
  ),
}

export const VALUE_PNL_COLUMN: ColumnDef<LimitOrder> = {
  id: 'valueUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="border-b border-dotted border-muted-foreground">
            Value / Est. PnL
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Copy address</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  enableSorting: false,
  accessorFn: (row) => row.valueUSD,
  sortingFn: ({ original: a }, { original: b }) => a.valueUSD - b.valueUSD,
  cell: ({ row }) => (
    <div className="flex flex-col">
      <span>{formatUSD(row.original.valueUSD)}</span>
      <span
        className={
          row.original.pnlPercent > 0
            ? 'text-xs text-green'
            : row.original.pnlPercent < 0
              ? 'text-xs text-red'
              : 'text-xs text-muted-foreground'
        }
      >
        {row.original.pnlPercent > 0 ? '+' : ''}
        {formatPercent(row.original.pnlPercent)}
      </span>
    </div>
  ),
}
export const PRICE_USD_COLUMN: ColumnDef<LimitOrder> = {
  id: 'priceUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1">
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
              <DollarCircledIcon />
              <span>USD</span>
            </span>
          </span>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <p>Toggle to view price in USD or token pair unit.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  enableSorting: false,
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <span>{formatUSD(row.original.priceUsd)}</span>
    </div>
  ),
}

export const FILLED_COLUMN: ColumnDef<LimitOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => row.filledPercent,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <span>
        {formatNumber(row.original.filledAmount)}/
        {formatNumber(row.original.totalAmount)} {row.original.buyToken.symbol}
      </span>
      <Chip className="dark:bg-[#222137] bg-[#E8E7EB] !p-2 dark:text-slate-500 text-slate-450">
        {formatPercent(row.original.filledPercent)}
      </Chip>
    </div>
  ),
}

export const TIME_COLUMN: ColumnDef<LimitOrder> = {
  id: 'time',
  header: 'Time',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => format(new Date(row.original.timestamp), 'yyyy/MM/dd'),
}

export const ACTION_COLUMN: ColumnDef<LimitOrder> = {
  id: 'action',
  header: 'Action',
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: () => (
    <XMarkIcon
      className="w-4 h-4 ml-auto cursor-pointer text-red"
      aria-label="Cancel order"
    />
  ),
}

export const EXPIRES_COLUMN: ColumnDef<LimitOrder> = {
  id: 'expires',
  header: 'Expires',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => format(new Date(row.original.timestamp), 'yyyy/MM/dd'),
}

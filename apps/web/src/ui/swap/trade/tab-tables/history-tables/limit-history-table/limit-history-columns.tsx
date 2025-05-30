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
import { formatUSD } from 'sushi/format'
import { formatPercent } from 'sushi/format'
import { formatNumber } from 'sushi/format'
import type { LimitOrderHistory } from './limit-history-table'

export const DATE_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) =>
    format(new Date(row.original.timestamp), 'MM/dd/yy h:mm a'),
}

export const BUY_COLUMN: ColumnDef<LimitOrderHistory> = {
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

export const SELL_COLUMN: ColumnDef<LimitOrderHistory> = {
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

export const CHAIN_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => row.chain.id,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2">
      <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
        <NetworkIcon
          type="square"
          chainId={row.original.chain.id}
          className="w-3 h-3 md:w-5 md:h-5"
        />
      </div>
      <span className="block text-xs md:hidden">{row.original.chain.name}</span>
    </div>
  ),
}

export const VALUE_PNL_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'valueUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="border-b border-dotted border-muted-foreground">
            Value / PnL
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Lorem ipsum dolor sit amet</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  enableSorting: false,

  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:flex-col ">
      <span>{formatUSD(row.original.valueUsd)}</span>
      <span
        className={
          row.original.pnlUsd > 0
            ? 'text-xs text-green'
            : row.original.pnlUsd < 0
              ? 'text-xs text-red'
              : 'text-xs text-muted-foreground'
        }
      >
        {row.original.pnlUsd > 0 ? '+' : ''}
        {formatUSD(row.original.pnlUsd)}
      </span>
    </div>
  ),
}

export const PRICE_USD_COLUMN: ColumnDef<LimitOrderHistory> = {
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

export const FILLED_COLUMN: ColumnDef<LimitOrderHistory> = {
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
      <Chip className="dark:!bg-[#222137] !bg-[#E8E7EB] !p-2 dark:text-slate-500 text-slate-450">
        {formatPercent(row.original.filledPercent)}
      </Chip>
    </div>
  ),
}

/** Status column */
export const STATUS_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'status',
  header: 'Status',
  enableSorting: false,
  accessorFn: (row) => row.status,
  cell: ({ row }) => {
    const color =
      row.original.status === 'Completed'
        ? 'text-green'
        : row.original.status === 'Cancelled'
          ? 'text-orange-400'
          : 'text-muted-foreground'
    return (
      <span className={`${color} inline-flex items-center gap-1`}>
        {row.original.status}
        <ArrowUpRightIcon className="w-3.5 h-3.5" />
      </span>
    )
  },
}

import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  Button,
  Chip,
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { DollarCircledIcon } from '@sushiswap/ui/icons/DollarCircled'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'
import type { LimitOrder } from './limit-orders-table'

export const BUY_COLUMN: ColumnDef<LimitOrder> = {
  id: 'buy',
  header: 'Buy',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
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
    return (
      <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
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
        <TooltipContent
          side="top"
          className="dark:bg-black/10 bg-white/10 py-4 px-5 !text-slate-900 dark:!text-pink-100 text-xs max-w-[250px]"
        >
          <p>
            Profit or loss calculated as the difference in USD value of the
            asset on the day it was bought and the day it was sold.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  enableSorting: false,
  accessorFn: (row) => row.valueUSD,
  sortingFn: ({ original: a }, { original: b }) => a.valueUSD - b.valueUSD,
  cell: ({ row }) => (
    <div className="flex items-start gap-1 md:flex-col ">
      <span>{formatUSD(row.original.valueUSD)}</span>
      <span
        className={
          row.original.pnlPercent > 0
            ? 'text-xs text-green-500'
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

export const getPriceColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<LimitOrder> => ({
  id: 'priceUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowInUsd((prev) => !prev)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
              <DollarCircledIcon />
              <span>{showInUsd ? 'USD' : 'Token'}</span>
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="dark:bg-black/10 bg-white/10 py-4 px-5 !text-slate-900 dark:!text-pink-100 text-xs"
        >
          <p>Toggle to view price in USD or token pair unit.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  enableSorting: false,
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => {
    const tokenPrice = row.original.sellAmount / row.original.buyAmount
    return (
      <span className="whitespace-nowrap">
        {showInUsd
          ? formatUSD(row.original.priceUsd)
          : `${tokenPrice.toFixed(4)} ${row.original.sellToken.symbol}`}
      </span>
    )
  },
})

export const FILLED_COLUMN: ColumnDef<LimitOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => row.filledPercent,
  cell: ({ row }) => (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span>
        {formatNumber(row.original.filledAmount)}/
        {formatNumber(row.original.totalAmount)} {row.original.buyToken.symbol}
      </span>
      <Chip className="dark:!bg-slate-750 !bg-[#0000000A] !p-2 dark:text-slate-500 text-slate-700">
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
  header: () => <span className="hidden text-right md:block">Action</span>,
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: () => (
    <>
      <XMarkIcon
        className="hidden w-4 h-4 ml-auto cursor-pointer text-red md:block"
        aria-label="Cancel order"
      />
      <Button className="w-full md:hidden" variant="destructive" asChild>
        <span>Cancel</span>
      </Button>{' '}
    </>
  ),
}

export const EXPIRES_COLUMN: ColumnDef<LimitOrder> = {
  id: 'expires',
  header: 'Expires',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => format(new Date(row.original.timestamp), 'yyyy/MM/dd'),
}

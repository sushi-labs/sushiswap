import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import {
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
import { TooltipDrawer } from 'src/ui/common/tooltip-drawer'
import { formatUSD } from 'sushi/format'
import { formatPercent } from 'sushi/format'
import { formatNumber } from 'sushi/format'
import type { LimitOrderHistory } from './limit-history-table'

export const DATE_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {format(new Date(row.original.timestamp), 'MM/dd/yy h:mm a')}
    </span>
  ),
}

export const BUY_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,

  accessorFn: (row) => row.buyAmount,
  cell: ({ row }) => (
    <div className="w-full min-w-[150px] flex items-center gap-2 whitespace-nowrap">
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
    <div className="flex items-center gap-2 whitespace-nowrap">
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
    <TooltipDrawer
      trigger={
        <span className="border-b border-dotted border-muted-foreground">
          Value / PnL
        </span>
      }
      content={
        <p>
          Profit or loss calculated as the difference in USD value of the asset
          on the day it was bought and the day it was sold.
        </p>
      }
      dialogTitle="Value / PnL"
    />
  ),
  enableSorting: false,

  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => (
    <div className="flex items-start gap-1 md:flex-col ">
      <span>{formatUSD(row.original.valueUsd)}</span>
      <span
        className={
          row.original.pnlUsd > 0
            ? 'text-xs text-green-500'
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

export const getPriceUsdColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<LimitOrderHistory> => ({
  id: 'priceUsd',
  enableSorting: false,
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation()
              setShowInUsd((prev) => !prev)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            className="flex items-start gap-1 cursor-pointer select-none min-w-[100px]"
          >
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current">
              <DollarCircledIcon className="w-3 h-3" />
              <span>{showInUsd ? 'USD' : 'Token'}</span>
            </span>
          </div>
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
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => {
    const tokenPrice =
      row.original.sellAmount && row.original.buyAmount
        ? row.original.sellAmount / row.original.buyAmount
        : 0
    return showInUsd ? (
      <span>{formatUSD(row.original.priceUsd)}</span>
    ) : (
      <span className="whitespace-nowrap">{`${tokenPrice.toFixed(4)} ${row.original.sellToken.symbol}`}</span>
    )
  },
})

export const FILLED_COLUMN: ColumnDef<LimitOrderHistory> = {
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
      <Chip className="dark:!bg-slate-750 !bg-slate-200 !p-2 dark:text-slate-500 text-slate-450 !h-[20px]">
        {formatPercent(row.original.filledPercent)}
      </Chip>
    </div>
  ),
}

/** Status column */
export const STATUS_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'status',
  header: () => <span className="md:text-right md:block">Status</span>,
  enableSorting: false,
  accessorFn: (row) => row.status,
  cell: ({ row }) => {
    const color =
      row.original.status === 'Completed'
        ? 'text-green-500'
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

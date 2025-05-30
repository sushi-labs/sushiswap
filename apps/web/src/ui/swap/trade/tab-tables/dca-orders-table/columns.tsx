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
import { formatUSD } from 'sushi/format'
import { formatPercent } from 'sushi/format'
import { formatNumber } from 'sushi/format'
import type { DCAOrder } from './dca-orders-table'

export const FILLED_COLUMN: ColumnDef<DCAOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => row.filledPercent,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2">
      <Currency.Icon
        disableLink
        currency={row.original.token}
        width={24}
        height={24}
      />{' '}
      <span>
        {formatNumber(row.original.totalAmount)} {row.original.token.symbol}
      </span>
    </div>
  ),
}

export const SIZE_COLUMN: ColumnDef<DCAOrder> = {
  id: 'size',
  header: 'Size',
  enableSorting: false,
  accessorFn: (row) => row.sizeAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2">
      <Currency.Icon
        disableLink
        currency={row.original.token}
        width={24}
        height={24}
      />{' '}
      <div className="flex flex-col">
        <span>
          {formatNumber(row.original.sizeAmount)} {row.original.token.symbol}
        </span>
        <span className="hidden text-xs text-muted-foreground md:block">
          {formatUSD(row.original.sizeUSD)}
        </span>
      </div>
    </div>
  ),
}

export const SPENT_COLUMN: ColumnDef<DCAOrder> = {
  id: 'spent',
  header: 'Spent',
  enableSorting: false,
  accessorFn: (row) => row.spentAmount,
  cell: ({ row }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span>
          {formatNumber(row.original.spentAmount)} {row.original.token.symbol}
        </span>
        <Chip className="dark:!bg-[#222137] !bg-[#E8E7EB] !p-2 dark:text-slate-500 text-slate-450">
          {formatPercent(row.original.spentPercent)}
        </Chip>
      </div>
      <span className="text-xs text-muted-foreground">
        {row.original.ordersRemaining}/{row.original.ordersTotal} Order
        Remaining
      </span>
    </div>
  ),
}

export const AVG_PRICE_USD_COLUMN: ColumnDef<DCAOrder> = {
  id: 'avgPriceUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <span>Avg. Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
              <DollarCircledIcon />
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
  enableSorting: false,
  accessorFn: (row) => row.avgPriceUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.avgPriceUsd)}</span>,
}

export const EXPIRES_COLUMN: ColumnDef<DCAOrder> = {
  id: 'expires',
  header: 'Expires',
  enableSorting: false,
  accessorFn: (row) => row.expires,
  cell: ({ row }) => {
    const formattedDate = format(
      new Date(row.original.expires),
      'MM/dd/yy h:mm a',
    )
    return formattedDate
  },
}

export const CHAIN_COLUMN: ColumnDef<DCAOrder> = {
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

export const ACTION_COLUMN: ColumnDef<DCAOrder> = {
  id: 'action',
  header: 'Action',
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: () => <Button className="w-full bg-red-100 md:hidden">Cancel</Button>,
}

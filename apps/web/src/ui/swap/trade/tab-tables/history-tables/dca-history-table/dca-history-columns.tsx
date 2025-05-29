import { TooltipContent } from '@sushiswap/ui'
import { TooltipTrigger } from '@sushiswap/ui'
import { Tooltip } from '@sushiswap/ui'
import { TooltipProvider } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Currency } from 'node_modules/@sushiswap/ui/dist/components/currency'
import { DollarCircledIcon } from 'src/ui/icons/dollar-circled'
import { formatNumber, formatUSD } from 'sushi/format'
import type { DCAOrderSummary } from './dca-history-table'

export const ORDER_ID_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'orderId',
  header: 'Order ID',
  enableSorting: false,
  accessorFn: (row) => row.orderId,
  cell: ({ row }) => <span>{row.original.orderId}</span>,
}

export const FILLED_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => row.filledAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon
        currency={row.original.filledToken}
        width={28}
        height={28}
      />
      <span>
        {formatNumber(row.original.filledAmount)}{' '}
        {row.original.filledToken.symbol}
      </span>
    </div>
  ),
}

export const SIZE_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'size',
  header: 'Size',
  enableSorting: false,
  accessorFn: (row) => row.sizeAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon currency={row.original.sizeToken} width={28} height={28} />
      <span>
        {formatNumber(row.original.sizeAmount)} {row.original.sizeToken.symbol}
      </span>
    </div>
  ),
}

export const CHAIN_COLUMN: ColumnDef<DCAOrderSummary> = {
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
      className="border rounded-[4px] dark:border-[#222137] border-[#F5F5F5]"
    />
  ),
}

export const VALUE_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'valueUsd',
  header: 'Value',
  enableSorting: false,
  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.valueUsd)}</span>,
}

export const AVG_PRICE_USD_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'avgPriceUsd',
  enableSorting: false,
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
  accessorFn: (row) => row.avgPriceUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.avgPriceUsd)}</span>,
}

export const ORDERS_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'orders',
  header: 'Orders',
  enableSorting: false,
  accessorFn: (row) => row.ordersCount,
  cell: ({ row }) => (
    <div className="flex flex-col">
      <span>{row.original.ordersCount} Orders</span>
      <span className="text-xs dark:text-slate-500 text-slate-450">
        {row.original.frequency}
      </span>
    </div>
  ),
}

export const STATUS_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'status',
  header: 'Status',
  enableSorting: false,
  accessorFn: (row) => row.status,
  cell: ({ row }) => (
    <div className="flex flex-col">
      <span>{row.original.status} On</span>
      <span className="text-xs dark:text-slate-500 text-slate-450">
        {format(new Date(row.original.statusDate), 'MM/dd/yy h:mm a')}
      </span>
    </div>
  ),
}

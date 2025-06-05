import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import {
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
import { Icon } from 'node_modules/@sushiswap/ui/dist/components/currency/Icon'
import { shortenHash } from 'sushi/format'
import { formatNumber } from 'sushi/format'
import { formatUSD } from 'sushi/format'
import type { MarketTrade } from './market-history-table'

export const BUY_COLUMN: ColumnDef<MarketTrade> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,
  accessorFn: (row) => row.buyAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
      <Currency.Icon currency={row.original.buyToken} width={24} height={24} />
      <span>
        {formatNumber(row.original.buyAmount)} {row.original.buyToken.symbol}
      </span>
    </div>
  ),
}

export const SELL_COLUMN: ColumnDef<MarketTrade> = {
  id: 'sell',
  header: 'Sell',
  enableSorting: false,
  accessorFn: (row) => row.sellAmount,
  cell: ({ row }) => (
    <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
      <Icon currency={row.original.sellToken} width={24} height={24} />
      <span>
        {formatNumber(row.original.sellAmount)} {row.original.sellToken.symbol}
      </span>
    </div>
  ),
}

export const CHAIN_COLUMN: ColumnDef<MarketTrade> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => `${row.chainFrom}-${row.chainTo}`,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 md:gap-2">
        <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
          <NetworkIcon
            type="square"
            chainId={row.original.chainFrom.id}
            className="w-3 h-3 md:w-5 md:h-5"
          />
        </div>
        <span className="block text-xs md:hidden">
          {row.original.chainFrom.name}
        </span>
        <ArrowSmallRightIcon className="w-3 h-3 dark:text-slate-500 text-slate-450" />
        <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
          <NetworkIcon
            type="square"
            chainId={row.original.chainTo.id}
            className="w-3 h-3 md:w-5 md:h-5"
          />
        </div>
        <span className="block text-xs md:hidden">
          {row.original.chainTo.name}
        </span>
      </div>
    </div>
  ),
}

export const VALUE_PNL_COLUMN: ColumnDef<MarketTrade> = {
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
  sortingFn: ({ original: a }, { original: b }) => a.valueUsd - b.valueUsd,
  cell: ({ row }) => (
    <div className="flex flex-col">
      <span>{formatUSD(row.original.valueUsd)}</span>
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
        {formatUSD(row.original.valueUsd * row.original.pnlPercent)}
      </span>
    </div>
  ),
}

export const PRICE_USD_COLUMN: ColumnDef<MarketTrade> = {
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

export const TX_HASH_COLUMN: ColumnDef<MarketTrade> = {
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

export const DATE_COLUMN: ColumnDef<MarketTrade> = {
  id: 'timestamp',
  header: () => <span className="md:text-right md:block">Date</span>,
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {format(new Date(row.original.timestamp), 'MM/dd/yy h:mm a')}
    </span>
  ),
}

'use client'

import { CurrencyDollarIcon } from '@heroicons/react-v1/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Chip, Currency, DataTable, Loader } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DollarCircledIcon } from 'src/ui/icons/dollar-circled'
import { Native } from 'sushi/currency'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'

/* ------------------------------------------------------------------ */
/* 📝 Types & Mock Data                                               */
/* ------------------------------------------------------------------ */

export interface LimitOrder {
  id: string
  chainId: number
  buyToken: ReturnType<typeof Native.onChain>
  buyAmount: number
  sellToken: ReturnType<typeof Native.onChain>
  sellAmount: number
  valueUSD: number
  pnlPercent: number
  filledAmount: number
  totalAmount: number
  filledPercent: number
  timestamp: number
  priceUsd: number
}

const MOCK_DATA: LimitOrder[] = [
  {
    id: '1',
    chainId: 1,
    buyToken: Native.onChain(1), // ETH
    buyAmount: 0.42,
    sellToken: Native.onChain(137), // MATIC
    sellAmount: 1200,
    valueUSD: 1200,
    pnlPercent: 6.4,
    filledAmount: 0,
    totalAmount: 0.42,
    filledPercent: 0,
    timestamp: 1741737600000, // 2025-04-10
    priceUsd: 0.84,
  },
  {
    id: '2',
    chainId: 56,
    buyToken: Native.onChain(56), // BNB
    buyAmount: 10,
    sellToken: Native.onChain(1), // ETH
    sellAmount: 32,
    valueUSD: 950,
    pnlPercent: -3.2,
    filledAmount: 5,
    totalAmount: 10,
    filledPercent: 50,
    timestamp: 1739644800000, // 2025-03-18
    priceUsd: 1.2,
  },
  // Add more rows as needed for layout
]

/* ------------------------------------------------------------------ */
/* 🔢 Column Definitions                                              */
/* ------------------------------------------------------------------ */

const BUY_COLUMN: ColumnDef<LimitOrder> = {
  id: 'buy',
  header: 'Buy',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon disableLink currency={row.original.buyToken} />{' '}
      <span>
        {formatNumber(row.original.buyAmount)} {row.original.buyToken.symbol}
      </span>
    </div>
  ),
}

const SELL_COLUMN: ColumnDef<LimitOrder> = {
  id: 'sell',
  header: 'Sell',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Currency.Icon disableLink currency={row.original.sellToken} />
      <span>
        {formatNumber(row.original.sellAmount)} {row.original.sellToken.symbol}
      </span>
    </div>
  ),
}

const CHAIN_COLUMN: ColumnDef<LimitOrder> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => row.chainId,
  cell: ({ row }) => (
    <NetworkIcon
      type="square"
      chainId={row.original.chainId}
      width={16}
      height={16}
      className="rounded-md"
    />
  ),
}

const VALUE_PNL_COLUMN: ColumnDef<LimitOrder> = {
  id: 'valueUsd',
  header: 'Value / Est. PnL',
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

const PRICE_USD_COLUMN: ColumnDef<LimitOrder> = {
  id: 'priceUsd',
  header: () => (
    <div className="flex items-center gap-1">
      <span>Price</span>
      <span className="inline-flex items-center dark:text-[#3DB1FF] font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
        <DollarCircledIcon className="w-4 h-4" />
        <span>USD</span>
      </span>
    </div>
  ),
  enableSorting: false,
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <span>{formatUSD(row.original.priceUsd)}</span>
    </div>
  ),
}

const FILLED_COLUMN: ColumnDef<LimitOrder> = {
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
      <Chip className="dark:bg-[#222137] !p-2 dark:text-[#ABA5B0]">
        {formatPercent(row.original.filledPercent)}
      </Chip>
    </div>
  ),
}

const TIME_COLUMN: ColumnDef<LimitOrder> = {
  id: 'time',
  header: 'Time',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => format(new Date(row.original.timestamp), 'yyyy/MM/dd'),
}

const ACTION_COLUMN: ColumnDef<LimitOrder> = {
  id: 'action',
  header: 'Action',
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: () => (
    <XMarkIcon
      className="w-4 h-4 cursor-pointer text-red"
      aria-label="Cancel order"
    />
  ),
}

const COLUMNS: ColumnDef<LimitOrder>[] = [
  BUY_COLUMN,
  SELL_COLUMN,
  CHAIN_COLUMN,
  VALUE_PNL_COLUMN,
  PRICE_USD_COLUMN,
  FILLED_COLUMN,
  TIME_COLUMN,
  ACTION_COLUMN,
]

/* ------------------------------------------------------------------ */
/* 📈 Table Component                                                 */
/* ------------------------------------------------------------------ */

export const LimitOrdersTable = () => {
  // Layout-only phase: static mock data, no pagination needed yet
  const data = MOCK_DATA

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {}}
      hasMore={false}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <DataTable columns={COLUMNS} data={data} loading={false} />
    </InfiniteScroll>
  )
}

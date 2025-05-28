'use client'

import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Card, Chip, Currency, DataTable, Loader } from '@sushiswap/ui'
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

export type LimitOrderStatus = 'Completed' | 'Cancelled' | 'Pending'

export interface LimitOrderHistory {
  id: string
  timestamp: number
  buyToken: ReturnType<typeof Native.onChain>
  buyAmount: number
  sellToken: ReturnType<typeof Native.onChain>
  sellAmount: number
  chainId: number
  valueUsd: number
  pnlUsd: number
  priceUsd: number
  filledAmount: number
  totalAmount: number
  filledPercent: number
  status: LimitOrderStatus
}

const MOCK_DATA: LimitOrderHistory[] = [
  {
    id: '1',
    timestamp: 1736122860000, // 02/04/25 3:41 PM
    buyToken: Native.onChain(1), // SUSHI
    buyAmount: 21,
    sellToken: Native.onChain(1), // ETH
    sellAmount: 0.01,
    chainId: 1,
    valueUsd: 100.23,
    pnlUsd: +19.8,
    priceUsd: 0.86,
    filledAmount: 21,
    totalAmount: 21,
    filledPercent: 100,
    status: 'Completed',
  },
  {
    id: '2',
    timestamp: 1736122860000,
    buyToken: Native.onChain(1),
    buyAmount: 21,
    sellToken: Native.onChain(1),
    sellAmount: 0.01,
    chainId: 137,
    valueUsd: 100.23,
    pnlUsd: +19.8,
    priceUsd: 0.86,
    filledAmount: 10,
    totalAmount: 21,
    filledPercent: 45,
    status: 'Cancelled',
  },
]

/* ------------------------------------------------------------------ */
/* 🔢 Column Definitions                                              */
/* ------------------------------------------------------------------ */

/** Date column */
const DATE_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) =>
    format(new Date(row.original.timestamp), 'MM/dd/yy h:mm a'),
}

/** Buy column */
const BUY_COLUMN: ColumnDef<LimitOrderHistory> = {
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

/** Sell column */
const SELL_COLUMN: ColumnDef<LimitOrderHistory> = {
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

/** Chain column */
const CHAIN_COLUMN: ColumnDef<LimitOrderHistory> = {
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
      className="border rounded-sm dark:border-[#F5F5F5]"
    />
  ),
}

/** Value / PnL column */
const VALUE_PNL_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'valueUsd',
  header: () => <span className="border-b border-dotted">Value / PnL</span>,
  enableSorting: false,

  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => (
    <div className="flex flex-col ">
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

/** Price USD column */
const PRICE_USD_COLUMN: ColumnDef<LimitOrderHistory> = {
  id: 'priceUsd',
  enableSorting: false,

  header: () => (
    <div className="flex items-start gap-1">
      <span>Price</span>
      <span className="inline-flex items-center dark:text-skyblue font-normal gap-[1px] border-b border-dashed border-current">
        <DollarCircledIcon className="w-3 h-3" />
        <span>USD</span>
      </span>
    </div>
  ),
  accessorFn: (row) => row.priceUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.priceUsd)}</span>,
}

/** Filled column: ratio + percentage chip */
const FILLED_COLUMN: ColumnDef<LimitOrderHistory> = {
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

/** Status column */
const STATUS_COLUMN: ColumnDef<LimitOrderHistory> = {
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

/** Assemble column list */
const COLUMNS: ColumnDef<LimitOrderHistory>[] = [
  DATE_COLUMN,
  BUY_COLUMN,
  SELL_COLUMN,
  CHAIN_COLUMN,
  VALUE_PNL_COLUMN,
  PRICE_USD_COLUMN,
  FILLED_COLUMN,
  STATUS_COLUMN,
]

/* ------------------------------------------------------------------ */
/* 📈 Table Component                                                 */
/* ------------------------------------------------------------------ */

export const LimitOrdersHistoryTable = () => {
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
      <Card className="overflow-hidden border-none bg-slate-50 dark:bg-slate-800">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={false}
          className="border-none"
          pagination
        />
      </Card>
    </InfiniteScroll>
  )
}

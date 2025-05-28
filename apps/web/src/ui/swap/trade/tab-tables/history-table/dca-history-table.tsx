'use client'

import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Card, Chip, Currency, DataTable, Loader } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DollarCircledIcon } from 'src/ui/icons/dollar-circled'
import { Native } from 'sushi/currency'
import { formatNumber, formatUSD } from 'sushi/format'

export interface DCAOrderSummary {
  id: string
  orderId: string
  filledToken: ReturnType<typeof Native.onChain>
  filledAmount: number
  sizeToken: ReturnType<typeof Native.onChain>
  sizeAmount: number
  chainId: number
  valueUsd: number
  avgPriceUsd: number
  ordersCount: number
  frequency: string
  status: 'Completed' | 'Cancelled' | 'Active'
  statusDate: number
}

const MOCK_DATA: DCAOrderSummary[] = [
  {
    id: 'row-1',
    orderId: '001',
    filledToken: Native.onChain(42161),
    filledAmount: 10,
    sizeToken: Native.onChain(43114),
    sizeAmount: 19_000,
    chainId: 43114,
    valueUsd: 19_000,
    avgPriceUsd: 1_900,
    ordersCount: 5,
    frequency: 'Every 5 minutes',
    status: 'Completed',
    statusDate: 1736122860000,
  },
]

const ORDER_ID_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'orderId',
  header: 'Order ID',
  enableSorting: false,
  accessorFn: (row) => row.orderId,
  cell: ({ row }) => <span>{row.original.orderId}</span>,
}

const FILLED_COLUMN: ColumnDef<DCAOrderSummary> = {
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

const SIZE_COLUMN: ColumnDef<DCAOrderSummary> = {
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

const CHAIN_COLUMN: ColumnDef<DCAOrderSummary> = {
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

const VALUE_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'valueUsd',
  header: 'Value',
  enableSorting: false,
  accessorFn: (row) => row.valueUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.valueUsd)}</span>,
}

const AVG_PRICE_USD_COLUMN: ColumnDef<DCAOrderSummary> = {
  id: 'avgPriceUsd',
  enableSorting: false,
  header: () => (
    <div className="flex items-center gap-1">
      <span>Avg. Price</span>
      <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
        <DollarCircledIcon />
        <span>USD</span>
      </span>
    </div>
  ),
  accessorFn: (row) => row.avgPriceUsd,
  cell: ({ row }) => <span>{formatUSD(row.original.avgPriceUsd)}</span>,
}

const ORDERS_COLUMN: ColumnDef<DCAOrderSummary> = {
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

const STATUS_COLUMN: ColumnDef<DCAOrderSummary> = {
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

const COLUMNS: ColumnDef<DCAOrderSummary>[] = [
  ORDER_ID_COLUMN,
  FILLED_COLUMN,
  SIZE_COLUMN,
  CHAIN_COLUMN,
  VALUE_COLUMN,
  AVG_PRICE_USD_COLUMN,
  ORDERS_COLUMN,
  STATUS_COLUMN,
]

export const DCAOrdersHistoryTable = () => {
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

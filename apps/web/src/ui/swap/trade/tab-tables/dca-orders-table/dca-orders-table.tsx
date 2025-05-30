'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import { MobileCard } from '../history-tables/mobile-card/mobile-card'
import {
  ACTION_COLUMN,
  AVG_PRICE_USD_COLUMN,
  CHAIN_COLUMN,
  EXPIRES_COLUMN,
  FILLED_COLUMN,
  SIZE_COLUMN,
  SPENT_COLUMN,
} from './columns'

export interface DCAOrder {
  id: string
  chain: {
    id: number
    name: string
  }
  token: ReturnType<typeof Native.onChain>
  sizeAmount: number
  sizeUSD: number
  filledAmount: number
  totalAmount: number
  filledPercent: number
  spentAmount: number
  spentPercent: number
  ordersRemaining: number
  ordersTotal: number
  avgPriceUsd: number
  expires: number
  status: 'completed' | 'cancelled'
  date: number
  txHash: string
  orderId: string
}

const MOCK_DATA: DCAOrder[] = [
  {
    id: '1',
    chain: {
      id: 1,
      name: 'Ethereum',
    },
    token: Native.onChain(1),
    sizeAmount: 8_000,
    sizeUSD: 8_000,
    filledAmount: 0,
    totalAmount: 8_000,
    filledPercent: 0,
    spentAmount: 0,
    spentPercent: 0,
    ordersRemaining: 5,
    ordersTotal: 5,
    avgPriceUsd: 2_000,
    expires: 1741737600000,
    status: 'completed',
    date: 1741737600000,
    txHash: '0xf84D7537c997837b32E5aA643949e2cF53D190fD',
    orderId: '001',
  },
  {
    id: '2',
    chain: {
      id: 56,
      name: 'Binance Smart Chain',
    },
    token: Native.onChain(56),
    sizeAmount: 1_200,
    sizeUSD: 300,
    filledAmount: 600,
    totalAmount: 1_200,
    filledPercent: 50,
    spentAmount: 300,
    spentPercent: 25,
    ordersRemaining: 3,
    ordersTotal: 5,
    avgPriceUsd: 240,
    expires: 1739644800000,
    status: 'cancelled',
    date: 1741737600000,
    txHash: '0xf84D7537c997837b32E5aA643949e2cF53D190fD',
    orderId: '002',
  },
]

const COLUMNS: ColumnDef<DCAOrder>[] = [
  FILLED_COLUMN,
  SIZE_COLUMN,
  CHAIN_COLUMN,
  SPENT_COLUMN,
  AVG_PRICE_USD_COLUMN,
  EXPIRES_COLUMN,
  ACTION_COLUMN,
]

export const DCAOrdersTable = () => {
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
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={false}
          className="border-none"
          pagination
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  )
}

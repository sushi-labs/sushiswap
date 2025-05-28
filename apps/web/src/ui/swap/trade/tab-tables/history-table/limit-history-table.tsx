'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import {
  BUY_COLUMN,
  CHAIN_COLUMN,
  DATE_COLUMN,
  FILLED_COLUMN,
  PRICE_USD_COLUMN,
  SELL_COLUMN,
  STATUS_COLUMN,
  VALUE_PNL_COLUMN,
} from './limit-history-columns'

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
    timestamp: 1736122860000,
    buyToken: Native.onChain(1),
    buyAmount: 21,
    sellToken: Native.onChain(1),
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

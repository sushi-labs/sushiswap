'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import {
  ACTION_COLUMN,
  BUY_COLUMN,
  CHAIN_COLUMN,
  FILLED_COLUMN,
  PRICE_USD_COLUMN,
  SELL_COLUMN,
  TIME_COLUMN,
  VALUE_PNL_COLUMN,
} from './columns'

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

export const MOCK_DATA: LimitOrder[] = [
  {
    id: '1',
    chainId: 1,
    buyToken: Native.onChain(1),
    buyAmount: 0.42,
    sellToken: Native.onChain(43114),
    sellAmount: 1200,
    valueUSD: 1200,
    pnlPercent: 6.4,
    filledAmount: 0,
    totalAmount: 0.42,
    filledPercent: 0,
    timestamp: 1741737600000,
    priceUsd: 0.84,
  },
  {
    id: '2',
    chainId: 56,
    buyToken: Native.onChain(56),
    buyAmount: 10,
    sellToken: Native.onChain(1),
    sellAmount: 32,
    valueUSD: 950,
    pnlPercent: -3.2,
    filledAmount: 5,
    totalAmount: 10,
    filledPercent: 50,
    timestamp: 1739644800000,
    priceUsd: 1.2,
  },
]

export const LimitOrdersTable = () => {
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
          pagination={true}
        />
      </Card>
    </InfiniteScroll>
  )
}

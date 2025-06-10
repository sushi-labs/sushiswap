'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import { MobileCard } from '../mobile-card/mobile-card'
import {
  BUY_COLUMN,
  CHAIN_COLUMN,
  DATE_COLUMN,
  FILLED_COLUMN,
  SELL_COLUMN,
  STATUS_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceUsdColumn,
} from './limit-history-columns'

export type LimitOrderStatus = 'Completed' | 'Cancelled' | 'Pending'

export interface LimitOrderHistory {
  id: string
  timestamp: number
  buyToken: ReturnType<typeof Native.onChain>
  buyAmount: number
  sellToken: ReturnType<typeof Native.onChain>
  sellAmount: number
  chain: {
    id: number
    name: string
  }
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
    chain: {
      id: 1,
      name: 'Ethereum',
    },
    valueUsd: 100.23,
    pnlUsd: +19.8,
    priceUsd: 0.86,
    filledAmount: 21,
    totalAmount: 21,
    filledPercent: 1,
    status: 'Completed',
  },
  {
    id: '2',
    timestamp: 1736122860000,
    buyToken: Native.onChain(1),
    buyAmount: 21,
    sellToken: Native.onChain(1),
    sellAmount: 0.01,
    chain: {
      id: 137,
      name: 'Polygon',
    },
    valueUsd: 100.23,
    pnlUsd: +19.8,
    priceUsd: 0.86,
    filledAmount: 10,
    totalAmount: 21,
    filledPercent: 45,
    status: 'Cancelled',
  },
]

export const LimitOrdersHistoryTable = () => {
  const data = MOCK_DATA
  const [showInUsd, setShowInUsd] = React.useState(true)

  const priceColumn = React.useMemo(
    () => getPriceUsdColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const COLUMNS = React.useMemo(
    () => [
      DATE_COLUMN,
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceColumn,
      FILLED_COLUMN,
      STATUS_COLUMN,
    ],
    [priceColumn],
  )

  const MOBILE_COLUMNS = React.useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      priceColumn,
      VALUE_PNL_COLUMN,
      FILLED_COLUMN,
      STATUS_COLUMN,
      DATE_COLUMN,
      CHAIN_COLUMN,
    ],
    [priceColumn],
  )

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
            <MobileCard row={row} columns={MOBILE_COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  )
}

'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import { MobileCard } from '../history-tables/mobile-card/mobile-card'
import {
  ACTION_COLUMN,
  BUY_COLUMN,
  CHAIN_COLUMN,
  FILLED_COLUMN,
  SELL_COLUMN,
  TIME_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceColumn,
} from './columns'

export interface LimitOrder {
  id: string
  chain: {
    id: number
    name: string
  }
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

export const LIMIT_ORDER_MOCK_DATA: LimitOrder[] = [
  {
    id: '1',
    chain: {
      id: 1,
      name: 'Ethereum',
    },
    buyToken: Native.onChain(1),
    buyAmount: 0.42,
    sellToken: Native.onChain(43114),
    sellAmount: 1200,
    valueUSD: 1200,
    pnlPercent: 6.4,
    filledAmount: 0.0,
    totalAmount: 21,
    filledPercent: 0,
    timestamp: 1741737600000,
    priceUsd: 0.84,
  },
  {
    id: '2',
    chain: {
      id: 56,
      name: 'Binance Smart Chain',
    },
    buyToken: Native.onChain(56),
    buyAmount: 10,
    sellToken: Native.onChain(1),
    sellAmount: 32,
    valueUSD: 950,
    pnlPercent: -3.2,
    filledAmount: 5,
    totalAmount: 10,
    filledPercent: 0.5,
    timestamp: 1739644800000,
    priceUsd: 1.2,
  },
]

export const LimitOrdersTable = () => {
  const [showInUsd, setShowInUsd] = useState(true)

  const priceCol = useMemo(
    () => getPriceColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const LIMIT_ORDER_COLUMNS: ColumnDef<LimitOrder>[] = useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceCol,
      FILLED_COLUMN,
      TIME_COLUMN,
      ACTION_COLUMN,
    ],
    [priceCol],
  )

  const data = LIMIT_ORDER_MOCK_DATA

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
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block !rounded-t-none xl:!rounded-lg">
        <DataTable
          columns={LIMIT_ORDER_COLUMNS}
          data={data}
          loading={false}
          className="border-none"
          pagination={true}
        />
      </Card>

      <Card className="p-5 space-y-6 border-accent !shadow-none border bg-slate-50 dark:bg-slate-800 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={LIMIT_ORDER_COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  )
}

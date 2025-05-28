'use client'

import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import {
  AVG_PRICE_USD_COLUMN,
  CHAIN_COLUMN,
  FILLED_COLUMN,
  ORDERS_COLUMN,
  ORDER_ID_COLUMN,
  SIZE_COLUMN,
  STATUS_COLUMN,
  VALUE_COLUMN,
} from './dca-history-columns'

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

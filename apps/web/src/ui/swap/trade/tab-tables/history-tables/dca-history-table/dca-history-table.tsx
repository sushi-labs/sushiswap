'use client'

import { Card, DataTable, Loader, Slot } from '@sushiswap/ui'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { type ReactNode, useState } from 'react'
import { useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import { MobileCard } from '../mobile-card/mobile-card'
import {
  AVG_PRICE_USD_COLUMN,
  CHAIN_COLUMN,
  FILLED_COLUMN,
  ORDERS_COLUMN,
  ORDER_ID_COLUMN,
  SIZE_COLUMN,
  STATUS_COLUMN,
  VALUE_COLUMN,
  makeActionColumn,
} from './dca-history-columns'
import { DCAOrderDetailsModal } from './order-details-modal'

export interface DCAOrderSummary {
  id: string
  orderId: string
  filledToken: ReturnType<typeof Native.onChain>
  filledAmount: number
  sizeToken: ReturnType<typeof Native.onChain>
  sizeAmount: number
  chain: {
    id: number
    name: string
  }
  valueUsd: number
  avgPriceUsd: number
  ordersCount: number
  frequency: string
  status: 'Completed' | 'Cancelled' | 'Active'
  statusDate: number
  txHash: string
}

const MOCK_DATA: DCAOrderSummary[] = [
  {
    id: 'row-1',
    orderId: '001',
    filledToken: Native.onChain(42161),
    filledAmount: 10,
    sizeToken: Native.onChain(43114),
    sizeAmount: 19_000,
    chain: {
      id: 43114,
      name: 'Avalanche',
    },
    valueUsd: 19_000,
    avgPriceUsd: 1_900,
    ordersCount: 5,
    frequency: 'Every 5 minutes',
    status: 'Completed',
    statusDate: 1736122860000,
    txHash: '0x1234567890abcdef',
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
  const [_selectedRow, setSelectedRow] = useState<DCAOrderSummary | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openDetails = (row: DCAOrderSummary) => {
    setSelectedRow(row)
    setIsOpen(true)
  }

  const MOBILE_ACTION_COLUMN = makeActionColumn(openDetails)

  const MOBILE_COLUMNS: ColumnDef<DCAOrderSummary>[] = [
    FILLED_COLUMN,
    SIZE_COLUMN,
    AVG_PRICE_USD_COLUMN,
    VALUE_COLUMN,
    CHAIN_COLUMN,
    ORDERS_COLUMN,
    STATUS_COLUMN,
    MOBILE_ACTION_COLUMN,
    ORDER_ID_COLUMN,
  ]

  const rowRenderer = useCallback(
    (row: Row<DCAOrderSummary>, rowNode: ReactNode) => (
      <Slot
        className="cursor-pointer hover:bg-accent"
        onClick={() => {
          setSelectedRow(row.original)
          setIsOpen(true)
        }}
      >
        {rowNode}
      </Slot>
    ),
    [],
  )

  return (
    <>
      <DCAOrderDetailsModal isOpen={isOpen} onOpenChange={setIsOpen} />
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
        <Card className="hidden overflow-hidden border-none md:block bg-slate-50 dark:bg-slate-800">
          <DataTable
            columns={COLUMNS}
            data={data}
            loading={false}
            className="border-none"
            rowRenderer={rowRenderer}
            pagination
            className="!border-none"
          />
        </Card>

        <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 md:hidden">
          {data.map((row) => (
            <div
              key={row.id}
              className="pb-6 border-b last:border-b-0 last:pb-0"
            >
              <MobileCard row={row} columns={MOBILE_COLUMNS} />
            </div>
          ))}
        </Card>
      </InfiniteScroll>
    </>
  )
}

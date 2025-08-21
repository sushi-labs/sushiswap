'use client'

import { OrderStatus } from '@orbs-network/twap-sdk'
import { Card, DataTable, Loader, SkeletonBox, Slot } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'
import React, { useState, useMemo, useCallback, type ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  type TwapOrder,
  getTwapDcaOrders,
} from 'src/lib/hooks/react-query/twap'
import { DCAOrderDetailsModal } from '../history-tables/dca-history-table/order-details-modal'
import { MobileDataCard } from '../history-tables/mobile-data-card/mobile-data-card'
import { useTradeTablesContext } from '../trade-tables-context'
import {
  ACTION_COLUMN,
  CHAIN_COLUMN,
  EXPIRES_COLUMN,
  FILLED_COLUMN,
  SIZE_COLUMN,
  SPENT_COLUMN,
  getAvgPriceColumn,
} from './columns'

export const DCAOrdersTable = () => {
  const [showInUsd, setShowInUsd] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrderId, setSelectedRowId] = useState<number | null>(null)

  const { orders, ordersLoading } = useTradeTablesContext()
  const data = useMemo(() => {
    return getTwapDcaOrders(orders).filter(
      (order) => order.status === OrderStatus.Open,
    )
  }, [orders])

  const avgPriceCol = useMemo(
    () => getAvgPriceColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const COLUMNS: ColumnDef<TwapOrder>[] = [
    FILLED_COLUMN,
    SIZE_COLUMN,
    CHAIN_COLUMN,
    SPENT_COLUMN,
    avgPriceCol,
    EXPIRES_COLUMN,
    ACTION_COLUMN,
  ]

  const rowRenderer = useCallback(
    (row: Row<TwapOrder>, rowNode: ReactNode) => (
      <Slot
        className="cursor-pointer hover:bg-accent"
        onClick={() => {
          setSelectedRowId(row.original.id)
          setIsOpen(true)
        }}
      >
        {rowNode}
      </Slot>
    ),
    [],
  )

  const selectedOrder = useMemo(() => {
    return data.find((order) => order.id === selectedOrderId)
  }, [data, selectedOrderId])

  return (
    <>
      <DCAOrderDetailsModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        order={selectedOrder}
      />
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
            columns={COLUMNS}
            data={data}
            loading={ordersLoading}
            className="border-none [&_td]:h-[92px]"
            rowRenderer={rowRenderer}
            pagination={false}
          />
        </Card>

        <Card className="p-5 space-y-6 border-accent !shadow-none border bg-slate-50 dark:bg-slate-800 md:hidden">
          {ordersLoading ? (
            <SkeletonBox className="w-full h-52" />
          ) : !data?.length ? (
            <p className="text-sm italic text-center text-muted-foreground dark:text-pink-200 h-52 flex items-center justify-center">
              No Active DCA Orders
            </p>
          ) : (
            data?.map((row) => (
              <div
                key={row.id}
                className="pb-6 border-b last:border-b-0 last:pb-0"
              >
                <MobileDataCard row={row} columns={COLUMNS} />
              </div>
            ))
          )}
        </Card>
      </InfiniteScroll>
    </>
  )
}

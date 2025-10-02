'use client'

import { OrderStatus } from '@orbs-network/twap-sdk'
import { Card, DataTable, Loader, SkeletonBox } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  type TwapOrder,
  getTwapLimitOrders,
} from 'src/lib/hooks/react-query/twap'
import { useTradeTablesContext } from '../../trade-tables-context'
import { MobileDataCard } from '../mobile-data-card/mobile-data-card'
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

export const LimitOrdersHistoryTable = () => {
  const [showInUsd, setShowInUsd] = React.useState(true)
  const { orders, ordersLoading } = useTradeTablesContext()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const data = useMemo(() => {
    return getTwapLimitOrders(orders).filter(
      (order) => order.status !== OrderStatus.Open,
    )
  }, [orders])

  const priceColumn = React.useMemo(
    () => getPriceUsdColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const COLUMNS: ColumnDef<TwapOrder>[] = React.useMemo(
    () => [
      DATE_COLUMN,
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceColumn,
      STATUS_COLUMN,
    ],
    [priceColumn],
  )

  const MOBILE_COLUMNS: ColumnDef<TwapOrder>[] = React.useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      priceColumn,
      VALUE_PNL_COLUMN,
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
      <Card className="hidden overflow-hidden !border-none bg-slate-50 dark:bg-slate-800 lg:block">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={ordersLoading}
          className="border-none [&_td]:h-[92px]"
          pagination
          state={{
            pagination: paginationState,
          }}
          onPaginationChange={setPaginationState}
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 lg:hidden">
        {ordersLoading ? (
          <SkeletonBox className="w-full h-52" />
        ) : !data?.length ? (
          <p className="text-sm italic text-center text-muted-foreground dark:text-pink-200 h-52 flex items-center justify-center">
            No Past Limit Orders
          </p>
        ) : (
          data?.map((row) => (
            <div
              key={row.id}
              className="pb-6 border-b last:border-b-0 last:pb-0"
            >
              <MobileDataCard row={row} columns={MOBILE_COLUMNS} />
            </div>
          ))
        )}
      </Card>
    </InfiniteScroll>
  )
}

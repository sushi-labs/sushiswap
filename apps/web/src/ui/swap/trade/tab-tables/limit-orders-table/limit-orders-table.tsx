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
import { MobileDataCard } from '../history-tables/mobile-data-card/mobile-data-card'
import { useTradeTablesContext } from '../trade-tables-context'
import {
  ACTION_COLUMN,
  BUY_COLUMN,
  CHAIN_COLUMN,
  SELL_COLUMN,
  TIME_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceColumn,
} from './columns'

export const LimitOrdersTable = ({
  tableRowClassName = '',
}: {
  tableRowClassName?: string
}) => {
  const [showInUsd, setShowInUsd] = useState(true)

  const priceCol = useMemo(
    () => getPriceColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const LIMIT_ORDER_COLUMNS: ColumnDef<TwapOrder>[] = useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceCol,
      TIME_COLUMN,
      ACTION_COLUMN,
    ],
    [priceCol],
  )

  const { orders, ordersLoading } = useTradeTablesContext()
  const data = useMemo(() => {
    return getTwapLimitOrders(orders).filter(
      (it) => it.status === OrderStatus.Open,
    )
  }, [orders])

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {}}
      hasMore={false}
      loader={
        <div className="flex justify-center py-4 w-full">
          <Loader size={16} />
        </div>
      }
    >
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block !rounded-t-none xl:!rounded-lg">
        <DataTable
          columns={LIMIT_ORDER_COLUMNS}
          data={data}
          loading={ordersLoading}
          className="border-none [&_td]:h-[92px]"
          pagination={false}
          tableRowClassName={tableRowClassName}
        />
      </Card>

      <Card className="p-5 space-y-6 border-accent !shadow-none border bg-slate-50 dark:bg-slate-800 md:hidden">
        {ordersLoading ? (
          <SkeletonBox className="w-full h-52" />
        ) : !data?.length ? (
          <p className="flex justify-center items-center h-52 text-sm italic text-center text-muted-foreground dark:text-pink-200">
            No Active Limit Orders
          </p>
        ) : (
          data?.map((row) => (
            <div
              key={row.id}
              className="pb-6 border-b last:border-b-0 last:pb-0"
            >
              <MobileDataCard row={row} columns={LIMIT_ORDER_COLUMNS} />
            </div>
          ))
        )}
      </Card>
    </InfiniteScroll>
  )
}

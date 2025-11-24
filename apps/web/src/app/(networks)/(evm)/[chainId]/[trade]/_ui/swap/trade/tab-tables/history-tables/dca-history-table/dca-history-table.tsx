'use client'

import { OrderStatus } from '@orbs-network/twap-sdk'
import { Card, DataTable, SkeletonBox, Slot, classNames } from '@sushiswap/ui'
import type { ColumnDef, PaginationState, Row } from '@tanstack/react-table'
import { type ReactNode, useMemo, useState } from 'react'
import { useCallback } from 'react'
import {
  type TwapOrder,
  getTwapDcaOrders,
} from 'src/lib/hooks/react-query/twap'
import { useTradeTablesContext } from '../../trade-tables-context'
import { MobileDataCard } from '../mobile-data-card/mobile-data-card'
import {
  CHAIN_COLUMN,
  FILLED_COLUMN,
  ORDERS_COLUMN,
  ORDER_ID_COLUMN,
  SIZE_COLUMN,
  STATUS_COLUMN,
  VALUE_COLUMN,
  getAvgPriceColumn,
  makeActionColumn,
} from './dca-history-columns'
import { DCAOrderDetailsModal } from './order-details-modal'

export const DCAOrdersHistoryTable = ({
  tableRowClassName = '',
  mobileCardClassName = '',
}: {
  tableRowClassName?: string
  mobileCardClassName?: string
}) => {
  const { orders, ordersLoading } = useTradeTablesContext()

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showInUsd, setShowInUsd] = useState(true)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const data = useMemo(() => {
    return getTwapDcaOrders(orders).filter(
      (order) => order.status !== OrderStatus.Open,
    )
  }, [orders])

  const avgPriceColumn = useMemo(
    () => getAvgPriceColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const COLUMNS: ColumnDef<TwapOrder>[] = useMemo(
    () => [
      ORDER_ID_COLUMN,
      FILLED_COLUMN,
      SIZE_COLUMN,
      CHAIN_COLUMN,
      VALUE_COLUMN,
      avgPriceColumn,
      ORDERS_COLUMN,
      STATUS_COLUMN,
    ],
    [avgPriceColumn],
  )

  const MOBILE_ACTION_COLUMN = useMemo(
    () => makeActionColumn(setSelectedRowId),
    [],
  )

  const MOBILE_COLUMNS: ColumnDef<TwapOrder>[] = useMemo(
    () => [
      FILLED_COLUMN,
      SIZE_COLUMN,
      avgPriceColumn,
      VALUE_COLUMN,
      CHAIN_COLUMN,
      ORDERS_COLUMN,
      STATUS_COLUMN,
      MOBILE_ACTION_COLUMN,
      ORDER_ID_COLUMN,
    ],
    [avgPriceColumn, MOBILE_ACTION_COLUMN],
  )

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
    return data.find((order) => order.id === selectedRowId)
  }, [data, selectedRowId])

  return (
    <>
      <DCAOrderDetailsModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        order={selectedOrder}
      />
      <Card className="hidden overflow-hidden border-none lg:block bg-slate-50 dark:bg-slate-800">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={ordersLoading}
          rowRenderer={rowRenderer}
          pagination
          className="!border-none [&_td]:h-[92px]"
          state={{
            pagination: paginationState,
          }}
          onPaginationChange={setPaginationState}
          tableRowClassName={tableRowClassName}
        />
      </Card>

      <Card
        className={classNames(
          'p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 lg:hidden',
          mobileCardClassName,
        )}
      >
        {ordersLoading ? (
          <SkeletonBox className="w-full h-52" />
        ) : !data?.length ? (
          <p className="text-sm italic text-center text-muted-foreground dark:text-pink-200 h-52 flex items-center justify-center">
            No Past DCA Orders
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
    </>
  )
}

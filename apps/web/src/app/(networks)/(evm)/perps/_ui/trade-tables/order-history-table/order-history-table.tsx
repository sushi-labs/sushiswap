import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type OrderHistoryItemType,
  useOrderHistory,
} from 'src/lib/perps/use-order-history'
import { MobileTable } from '../_common/mobile-table'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  COIN_COLUMN,
  DIRECTION_COLUMN,
  FILLED_SIZE_COLUMN,
  ORDER_ID_COLUMN,
  ORDER_VALUE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  SIZE_COLUMN,
  STATUS_COLUMN,
  TIME_COLUMN,
  TP_SL_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TYPE_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  TYPE_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  SIZE_COLUMN,
  FILLED_SIZE_COLUMN,
  ORDER_VALUE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TP_SL_COLUMN,
  STATUS_COLUMN,
  ORDER_ID_COLUMN,
] as ColumnDef<OrderHistoryItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  TIME_COLUMN,
  TYPE_COLUMN,
  DIRECTION_COLUMN,
  SIZE_COLUMN,
  FILLED_SIZE_COLUMN,
  ORDER_VALUE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TP_SL_COLUMN,
  STATUS_COLUMN,
  ORDER_ID_COLUMN,
] as ColumnDef<OrderHistoryItemType, unknown>[]

export const OrderHistoryTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useOrderHistory()
  const [sorting, setSorting] = useState([{ id: 'oid', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.['order-history']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.order.side === 'B')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.order.side === 'A')
      }
      if (filterValue === 'active') {
        _data = data.filter((item) => item.order.marketType === 'perp')
      }
    }

    return _data
  }, [data, isError, filterValue])
  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: tableData.length,
      },
    }
  }, [tableData, sorting])

  return isLg ? (
    <DataTable
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
      onSortingChange={setSorting}
    />
  ) : (
    <MobileTable
      columns={MOBILE_COLUMNS}
      data={tableData}
      isLoading={isLoading}
      sorting={sorting}
    />
  )
}

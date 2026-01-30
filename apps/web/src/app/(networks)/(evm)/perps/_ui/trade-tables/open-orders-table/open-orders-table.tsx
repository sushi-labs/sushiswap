import { DataTable } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type UserOpenOrdersItemType,
  useUserOpenOrders,
} from 'src/lib/perps/use-user-open-orders'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  CANCEL_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  OG_SIZE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  SIZE_COLUMN,
  TIME_COLUMN,
  TP_SL_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TYPE_COLUMN,
  VALUE_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  TYPE_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  SIZE_COLUMN,
  OG_SIZE_COLUMN,
  VALUE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TP_SL_COLUMN,
  CANCEL_COLUMN,
] as ColumnDef<UserOpenOrdersItemType, unknown>[]

export const OpenOrdersTable = () => {
  const { data, isLoading, isError } = useUserOpenOrders()
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.['open-orders']?.split(':')?.[1] as
    | TradeFilterType
    | undefined
  // console.log(data)
  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all or active do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.side === 'B')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.side === 'A')
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

  return (
    <DataTable
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
      onSortingChange={setSorting}
    />
  )
}

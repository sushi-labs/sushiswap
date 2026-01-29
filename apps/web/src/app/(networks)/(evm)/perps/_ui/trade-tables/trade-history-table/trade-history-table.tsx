import { DataTable } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import {
  type TradeHistoryItemType,
  useTradeHistory,
} from 'src/lib/perps/use-trade-history'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  CLOSED_PNL_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  FEE_COLUMN,
  PRICE_COLUMN,
  SIZE_COLUMN,
  TIME_COLUMN,
  TRADE_VALUE_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  PRICE_COLUMN,
  SIZE_COLUMN,
  TRADE_VALUE_COLUMN,
  FEE_COLUMN,
  CLOSED_PNL_COLUMN,
] as ColumnDef<TradeHistoryItemType, unknown>[]

export const TradeHistoryTable = () => {
  const { data, isLoading, isError } = useTradeHistory()
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()

  const filterValue = tradeFilter?.['trade-history']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.side === 'B')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.side === 'A')
      }
      if (filterValue === 'active') {
        //fills in the same date as today
        _data = data.filter(
          (item) =>
            new Date(item.time).toDateString() === new Date().toDateString(),
        )
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

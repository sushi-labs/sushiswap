import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type TwapHistoryItemType, useTwapHistory } from 'src/lib/perps'
import { MobileTable } from '../../_common/mobile-table'
import {
  type TradeFilterType,
  useTradeTables,
} from '../../trade-tables-provider'
import {
  AVG_PRICE_COLUMN,
  COIN_COLUMN,
  EXECUTED_SIZE_COLUMN,
  RANDOMIZE_COLUMN,
  REDUCE_ONLY_COLUMN,
  STATUS_COLUMN,
  TIME_COLUMN,
  TOTAL_RUNTIME_COLUMN,
  TOTAL_SIZE_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  COIN_COLUMN,
  TOTAL_SIZE_COLUMN,
  EXECUTED_SIZE_COLUMN,
  AVG_PRICE_COLUMN,
  TOTAL_RUNTIME_COLUMN,
  REDUCE_ONLY_COLUMN,
  RANDOMIZE_COLUMN,
  STATUS_COLUMN,
] as ColumnDef<TwapHistoryItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  TIME_COLUMN,
  TOTAL_SIZE_COLUMN,
  EXECUTED_SIZE_COLUMN,
  AVG_PRICE_COLUMN,
  TOTAL_RUNTIME_COLUMN,
  REDUCE_ONLY_COLUMN,
  RANDOMIZE_COLUMN,
  STATUS_COLUMN,
] as ColumnDef<TwapHistoryItemType, unknown>[]

export const HistoryTwapTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useTwapHistory()
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()

  const filterValue = tradeFilter?.['twap']?.split(':')?.[1] as
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
            new Date(item.timestamp * 1000).toDateString() ===
            new Date().toDateString(),
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

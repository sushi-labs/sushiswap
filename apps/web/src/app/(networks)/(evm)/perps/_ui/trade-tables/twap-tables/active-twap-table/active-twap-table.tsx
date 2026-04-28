import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type ActiveTwapItemType, useActiveTwap } from 'src/lib/perps'
import { MobileTable } from '../../_common'
import {
  type TradeFilterType,
  useTradeTables,
} from '../../trade-tables-provider'
import {
  AVG_PRICE_COLUMN,
  COIN_COLUMN,
  CREATION_TIME_COLUMN,
  EXECUTED_SIZE_COLUMN,
  REDUCE_ONLY_COLUMN,
  RUNTIME_COLUMN,
  SIZE_COLUMN,
  TERMINATE_COLUMN,
} from './columns'

const COLUMNS = [
  COIN_COLUMN,
  SIZE_COLUMN,
  EXECUTED_SIZE_COLUMN,
  AVG_PRICE_COLUMN,
  RUNTIME_COLUMN,
  REDUCE_ONLY_COLUMN,
  CREATION_TIME_COLUMN,
  TERMINATE_COLUMN,
] as ColumnDef<ActiveTwapItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  SIZE_COLUMN,
  RUNTIME_COLUMN,
  EXECUTED_SIZE_COLUMN,
  AVG_PRICE_COLUMN,
  REDUCE_ONLY_COLUMN,
  CREATION_TIME_COLUMN,
  TERMINATE_COLUMN,
] as ColumnDef<ActiveTwapItemType, unknown>[]

export const ActiveTwapTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useActiveTwap()
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
      //filterValue active do nothing, only active ones returned
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
    <DataTableVirtual
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
      onSortingChange={setSorting}
      thClassName="!h-8 !px-0"
      hideScrollbar={true}
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

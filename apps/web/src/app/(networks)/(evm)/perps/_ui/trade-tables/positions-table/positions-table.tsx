import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type UserPositionsItemType, useUserPositions } from 'src/lib/perps'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  CLOSE_COLUMN,
  COIN_COLUMN,
  ENTRY_PRICE_COLUMN,
  FUNDING_COLUMN,
  LIQUIDATION_PRICE_COLUMN,
  MARGIN_COLUMN,
  MARK_PRICE_COLUMN,
  PNL_COLUMN,
  POSITION_VALUE_COLUMN,
  SIZE_COLUMN,
  TP_SL_COLUMN,
} from './columns'

const COLUMNS = [
  COIN_COLUMN,
  SIZE_COLUMN,
  POSITION_VALUE_COLUMN,
  ENTRY_PRICE_COLUMN,
  MARK_PRICE_COLUMN,
  PNL_COLUMN,
  LIQUIDATION_PRICE_COLUMN,
  MARGIN_COLUMN,
  FUNDING_COLUMN,
  CLOSE_COLUMN,
  TP_SL_COLUMN,
] as ColumnDef<UserPositionsItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  SIZE_COLUMN,
  PNL_COLUMN,
  ENTRY_PRICE_COLUMN,
  MARK_PRICE_COLUMN,
  LIQUIDATION_PRICE_COLUMN,
  POSITION_VALUE_COLUMN,
  MARGIN_COLUMN,
  FUNDING_COLUMN,
  TP_SL_COLUMN,
  CLOSE_COLUMN,
] as ColumnDef<UserPositionsItemType, unknown>[]

export const PositionsTable = () => {
  const { data, isLoading, isError } = useUserPositions()
  const [sorting, setSorting] = useState([{ id: 'size', desc: true }])
  const { isLg } = useBreakpoint('lg')
  const {
    state: { tradeFilter, expandAll },
  } = useTradeTables()
  const filterValue = tradeFilter?.['positions']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

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
      isExpandedOverride={expandAll ?? undefined}
    />
  )
}

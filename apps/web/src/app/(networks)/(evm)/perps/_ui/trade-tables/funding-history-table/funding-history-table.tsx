import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type FundingHistoryItemType, useFundingHistory } from 'src/lib/perps'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'

import {
  COIN_COLUMN,
  PAYMENT_COLUMN,
  RATE_COLUMN,
  SIDE_COLUMN,
  SIZE_COLUMN,
  TIME_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  COIN_COLUMN,
  SIZE_COLUMN,
  SIDE_COLUMN,
  PAYMENT_COLUMN,
  RATE_COLUMN,
] as ColumnDef<FundingHistoryItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  TIME_COLUMN,
  SIZE_COLUMN,
  SIDE_COLUMN,
  PAYMENT_COLUMN,
  RATE_COLUMN,
] as ColumnDef<FundingHistoryItemType, unknown>[]

export const FundingHistoryTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useFundingHistory()
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.['funding-history']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.side === 'long')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.side === 'short')
      }
      if (filterValue === 'active') {
        _data = []
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

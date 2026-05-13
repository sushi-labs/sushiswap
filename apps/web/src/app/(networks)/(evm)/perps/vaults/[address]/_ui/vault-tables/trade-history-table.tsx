import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type TradeHistoryItemType, useVaultTradeHistory } from 'src/lib/perps'
import {
  MobileTable,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'
import {
  CLOSED_PNL_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  FEE_COLUMN,
  PRICE_COLUMN,
  SIZE_COLUMN,
  TIME_COLUMN,
  TRADE_VALUE_COLUMN,
} from '~evm/perps/_ui/trade-tables/trade-history-table/columns'
import { type VaultFilterType, useVaultTables } from './vault-tables-provider'

const COLUMNS = [
  TIME_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  PRICE_COLUMN,
  SIZE_COLUMN,
  TRADE_VALUE_COLUMN,
  FEE_COLUMN,
  CLOSED_PNL_COLUMN(false),
] as ColumnDef<TradeHistoryItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  TIME_COLUMN,
  SIZE_COLUMN,
  DIRECTION_COLUMN,
  PRICE_COLUMN,
  TRADE_VALUE_COLUMN,
  FEE_COLUMN,
  CLOSED_PNL_COLUMN(false),
] as ColumnDef<TradeHistoryItemType, unknown>[]

export const TradeHistoryTable = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: {
      vaultFilter,
      vaultAddress,
      shouldAggregateTradeHistory,
      expandAll,
    },
  } = useVaultTables()
  const { data, isLoading, isError } = useVaultTradeHistory(
    vaultAddress,
    shouldAggregateTradeHistory,
  )
  const [sorting, setSorting] = useState([{ id: 'time', desc: true }])

  const filterValue = vaultFilter?.['trade-history']?.split(':')?.[1] as
    | VaultFilterType
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

  return isLg ? (
    <DataTableVirtual
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
      onSortingChange={setSorting}
      thClassName="!h-8 !px-0"
      hideScrollbar={true}
      trClassName={tableRowClassName}
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

import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type BalanceItemType, useBalances } from 'src/lib/perps'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  AVAILABLE_BALANCE_COLUMN,
  COIN_COLUMN,
  CONTRACT_COLUMN,
  PNL_COLUMN,
  TOTAL_BALANCE_COLUMN,
  USDC_VALUE_COLUMN,
} from './columns'

const COLUMNS = [
  COIN_COLUMN,
  TOTAL_BALANCE_COLUMN,
  AVAILABLE_BALANCE_COLUMN,
  USDC_VALUE_COLUMN,
  PNL_COLUMN,
  CONTRACT_COLUMN,
] as ColumnDef<BalanceItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  USDC_VALUE_COLUMN,
  TOTAL_BALANCE_COLUMN,
  AVAILABLE_BALANCE_COLUMN,
  PNL_COLUMN,
  CONTRACT_COLUMN,
] as ColumnDef<BalanceItemType, unknown>[]

export const BalanceTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useBalances()
  const [sorting, setSorting] = useState([{ id: 'usdcValue', desc: true }])
  const {
    state: { hideSmallBalances, tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.balances?.split(':')?.[1] as
    | TradeFilterType
    | undefined

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data
    if (hideSmallBalances) {
      _data = data.filter((item) => Number(item.usdcValue) >= 10)
    }
    if (filterValue) {
      //filterValue all or long do nothing
      if (filterValue === 'short') {
        //no short positions in balances
        _data = []
      }
      if (filterValue === 'active') {
        _data = data.filter(
          (item) =>
            Number(item.usdcValue) >= 0.01 &&
            item.marketType === 'spot' &&
            item.coin !== 'USDC (Spot)',
        )
      }
    }

    return _data
  }, [data, isError, hideSmallBalances, filterValue])

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

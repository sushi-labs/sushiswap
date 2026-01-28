import { DataTable } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo } from 'react'
import { type BalanceItemType, useBalances } from 'src/lib/perps/use-balances'
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

export const BalanceTable = () => {
  const { data, isLoading, isError } = useBalances()
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
      pagination: {
        pageIndex: 0,
        pageSize: tableData.length,
      },
    }
  }, [tableData])

  return (
    <DataTable
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
    />
  )
}

import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type {
  ColumnDef,
  PaginationState,
  TableState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { type TwapFillHistoryItemType, useTwapFillHistory } from 'src/lib/perps'
import { MobileTable, tableRowClassName } from '../../_common'
import {
  type TradeFilterType,
  useTradeTables,
} from '../../trade-tables-provider'
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
] as ColumnDef<TwapFillHistoryItemType, unknown>[]

const MOBILE_COLUMNS = [
  COIN_COLUMN,
  TIME_COLUMN,
  SIZE_COLUMN,
  DIRECTION_COLUMN,
  PRICE_COLUMN,
  TRADE_VALUE_COLUMN,
  FEE_COLUMN,
  CLOSED_PNL_COLUMN,
] as ColumnDef<TwapFillHistoryItemType, unknown>[]

export const FillHistoryTwapTable = ({
  isViewAll = false,
}: { isViewAll?: boolean }) => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useTwapFillHistory({ isViewAll })
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
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
            new Date(item.time).toDateString() === new Date().toDateString(),
        )
      }
    }

    return _data
  }, [data, isError, filterValue])

  const state: Partial<TableState> = useMemo(() => {
    if (isViewAll) {
      return {
        sorting,
        pagination: paginationState,
      }
    }
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: tableData.length,
      },
    }
  }, [tableData, sorting, isViewAll, paginationState])

  return isLg || isViewAll ? (
    <DataTableVirtual
      state={state}
      loading={isLoading}
      columns={COLUMNS}
      data={tableData}
      onSortingChange={setSorting}
      thClassName="!h-8 !px-0"
      hideScrollbar={true}
      trClassName={tableRowClassName}
      pagination={isViewAll}
      onPaginationChange={isViewAll ? setPaginationState : undefined}
      skeletonRowCount={isViewAll ? 25 : 10}
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

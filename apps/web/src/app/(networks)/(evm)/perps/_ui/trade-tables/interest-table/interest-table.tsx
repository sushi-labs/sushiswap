import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type UserBorrowLendInterestItemType,
  useUserBorrowLendInterest,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { MobileTable, tableRowClassName } from '../_common'
import {
  EARNED_COLUMN,
  PAID_COLUMN,
  TIME_COLUMN,
  TOKEN_COLUMN,
} from './columns'

const COLUMNS = [
  TIME_COLUMN,
  TOKEN_COLUMN,
  PAID_COLUMN,
  EARNED_COLUMN,
] as ColumnDef<UserBorrowLendInterestItemType, unknown>[]

const MOBILE_COLUMNS = [
  TOKEN_COLUMN,
  TIME_COLUMN,
  PAID_COLUMN,
  EARNED_COLUMN,
] as ColumnDef<UserBorrowLendInterestItemType, unknown>[]

const startTime = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30 // 30 days ago

export const InterestTable = () => {
  const { isLg } = useBreakpoint('lg')
  const address = useAccount('evm')
  const { data, isLoading, isError } = useUserBorrowLendInterest({
    address,
    startTime,
  })
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])

  const tableData = useMemo(() => {
    if (isError || !data) return []
    //filterValue does nothing for this table
    return data
  }, [data, isError])

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
    />
  )
}

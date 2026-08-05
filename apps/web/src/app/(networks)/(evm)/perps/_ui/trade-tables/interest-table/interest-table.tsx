import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type {
  ColumnDef,
  PaginationState,
  TableState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type UserBorrowLendInterestItemType,
  useUserBorrowLendInterest,
} from 'src/lib/perps'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
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

export const INTEREST_HISTORY_START_TIME =
  Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30 // 30 days ago

export const InterestTable = ({
  isViewAll = false,
}: { isViewAll?: boolean }) => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const { data, isLoading, isError } = useUserBorrowLendInterest({
    address: activeAddress,
    startTime: INTEREST_HISTORY_START_TIME,
    isViewAll,
  })
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const tableData = useMemo(() => {
    if (isError || !data) return []
    //filterValue does nothing for this table
    return data
  }, [data, isError])

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

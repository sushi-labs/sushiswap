import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type UserNonFundingLedgerUpdatesItemType,
  useUserNonFundingLedgerUpdates,
} from 'src/lib/perps'
import {
  MobileTable,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'
import {
  ACC_VAL_CHANGE_COLUMN,
  ACTION_COLUMN,
  DESTINATION_COLUMN,
  FEE_COLUMN,
  SOURCE_COLUMN,
  STATUS_COLUMN,
  TIME_COLUMN,
} from '~evm/perps/_ui/trade-tables/deposit-withdrawals-table/columns'
import { useVaultTables } from './vault-tables-provider'

const COLUMNS = [
  TIME_COLUMN,
  STATUS_COLUMN,
  ACTION_COLUMN,
  SOURCE_COLUMN,
  DESTINATION_COLUMN,
  ACC_VAL_CHANGE_COLUMN,
  FEE_COLUMN,
] as ColumnDef<UserNonFundingLedgerUpdatesItemType, unknown>[]

const MOBILE_COLUMNS = [
  TIME_COLUMN,
  STATUS_COLUMN,
  ACTION_COLUMN,
  SOURCE_COLUMN,
  DESTINATION_COLUMN,
  ACC_VAL_CHANGE_COLUMN,
  FEE_COLUMN,
] as ColumnDef<UserNonFundingLedgerUpdatesItemType, unknown>[]

export const DepositsWithdrawalsTable = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { vaultAddress },
  } = useVaultTables()
  const { data, isLoading, isError } = useUserNonFundingLedgerUpdates({
    address: vaultAddress,
    isVault: true,
  })

  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])

  const tableData = useMemo(() => {
    if (isError || !data) return []
    //no filterValue for this table
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

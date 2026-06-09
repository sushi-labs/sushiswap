import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  type DepositorType,
  useVaultDetails,
} from 'src/lib/perps/info/use-vault-details'
import {
  MobileTable,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'
import { useVaultTables } from '../vault-tables-provider'
import {
  ALL_TIME_PNL_COLUMN,
  DAYS_FOLLOWING_COLUMN,
  DEPOSITOR_COLUMN,
  UNREALIZED_PNL_COLUMN,
  VAULT_AMOUNT_COLUMN,
} from './columns'

const COLUMNS = [
  DEPOSITOR_COLUMN,
  VAULT_AMOUNT_COLUMN,
  UNREALIZED_PNL_COLUMN,
  ALL_TIME_PNL_COLUMN,
  DAYS_FOLLOWING_COLUMN,
] as ColumnDef<DepositorType, unknown>[]

const MOBILE_COLUMNS = [
  DEPOSITOR_COLUMN,
  VAULT_AMOUNT_COLUMN,
  UNREALIZED_PNL_COLUMN,
  ALL_TIME_PNL_COLUMN,
  DAYS_FOLLOWING_COLUMN,
] as ColumnDef<DepositorType, unknown>[]

export const DepositorsTable = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { vaultAddress },
  } = useVaultTables()
  const { data, isLoading, isError } = useVaultDetails({ vaultAddress })

  const [sorting, setSorting] = useState([{ id: 'vaultAmount', desc: true }])

  const tableData = useMemo(() => {
    if (isError || !data) return []
    return data?.followers
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

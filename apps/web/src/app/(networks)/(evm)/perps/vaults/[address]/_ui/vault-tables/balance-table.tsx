import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { type BalanceItemType, useVaultBalances } from 'src/lib/perps'
import {
  MobileTable,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'
import {
  AVAILABLE_BALANCE_COLUMN,
  COIN_COLUMN,
  CONTRACT_COLUMN,
  PNL_COLUMN,
  TOTAL_BALANCE_COLUMN,
  USDC_VALUE_COLUMN,
} from '~evm/perps/_ui/trade-tables/balance-table/columns'
import { type VaultFilterType, useVaultTables } from './vault-tables-provider'

type BalanceAction = 'send' | 'transfer' | 'evm-core-transfer' | 'share-pnl'
const getBalanceColumns = ({
  openModal,
  isMobile,
}: {
  openModal: (action: BalanceAction, balance: BalanceItemType) => void
  isMobile: boolean
}): ColumnDef<BalanceItemType, unknown>[] => {
  if (isMobile) {
    return [
      COIN_COLUMN,
      TOTAL_BALANCE_COLUMN,
      AVAILABLE_BALANCE_COLUMN,
      USDC_VALUE_COLUMN,
      PNL_COLUMN(openModal, true),
      CONTRACT_COLUMN,
    ]
  }
  return [
    COIN_COLUMN,
    TOTAL_BALANCE_COLUMN,
    AVAILABLE_BALANCE_COLUMN,
    USDC_VALUE_COLUMN,
    PNL_COLUMN(openModal, true),
    CONTRACT_COLUMN,
  ]
}

export const BalanceTable = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { vaultAddress, vaultFilter },
  } = useVaultTables()
  const { data, isLoading, isError } = useVaultBalances(vaultAddress)
  const [sorting, setSorting] = useState([{ id: 'usdcValue', desc: true }])
  const filterValue = vaultFilter?.balances?.split(':')?.[1] as
    | VaultFilterType
    | undefined

  const openModal = useCallback(
    (_action: BalanceAction, _balance: BalanceItemType) => {},
    [],
  )

  const columns = useMemo(() => {
    return getBalanceColumns({ openModal, isMobile: !isLg })
  }, [openModal, isLg])

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data
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

  return (
    <>
      {isLg ? (
        <DataTableVirtual
          state={state}
          loading={isLoading}
          columns={columns}
          data={tableData}
          onSortingChange={setSorting}
          thClassName="!h-8 !px-0"
          hideScrollbar={true}
          trClassName={tableRowClassName}
        />
      ) : (
        <MobileTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          sorting={sorting}
        />
      )}
    </>
  )
}

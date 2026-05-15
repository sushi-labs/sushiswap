import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { type UserPositionsItemType, useVaultPositions } from 'src/lib/perps'
import {
  MobileTable,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'
import {
  COIN_COLUMN,
  ENTRY_PRICE_COLUMN,
  FUNDING_COLUMN,
  LIQUIDATION_PRICE_COLUMN,
  MARGIN_COLUMN,
  MARK_PRICE_COLUMN,
  PNL_COLUMN,
  POSITION_VALUE_COLUMN,
  SIZE_COLUMN,
} from '~evm/perps/_ui/trade-tables/positions-table/columns'
import { type VaultFilterType, useVaultTables } from './vault-tables-provider'

type PositionAction =
  | 'limit-close'
  | 'market-close'
  | 'reverse'
  | 'edit-tpsl'
  | 'update-margin'
  | 'update-leverage'
  | 'share-pnl'

const getPositionColumns = ({
  openModal,
  isMobile,
}: {
  openModal: (action: PositionAction, position: UserPositionsItemType) => void
  isMobile: boolean
}): ColumnDef<UserPositionsItemType, unknown>[] => {
  if (isMobile) {
    return [
      COIN_COLUMN(openModal),
      SIZE_COLUMN,
      PNL_COLUMN(openModal, true),
      ENTRY_PRICE_COLUMN,
      MARK_PRICE_COLUMN,
      LIQUIDATION_PRICE_COLUMN,
      POSITION_VALUE_COLUMN,
      MARGIN_COLUMN(openModal),
      FUNDING_COLUMN,
    ]
  }
  return [
    COIN_COLUMN(openModal),
    SIZE_COLUMN,
    POSITION_VALUE_COLUMN,
    ENTRY_PRICE_COLUMN,
    MARK_PRICE_COLUMN,
    PNL_COLUMN(openModal, true),
    LIQUIDATION_PRICE_COLUMN,
    MARGIN_COLUMN(openModal),
    FUNDING_COLUMN,
  ]
}

export const PositionsTable = () => {
  const {
    state: { vaultFilter, expandAll, vaultAddress },
  } = useVaultTables()
  const { data, isLoading, isError } = useVaultPositions(vaultAddress)
  const [sorting, setSorting] = useState([{ id: 'posValue', desc: true }])
  const { isLg } = useBreakpoint('lg')

  const openModal = useCallback(
    (_action: PositionAction, _position: UserPositionsItemType) => {},
    [],
  )

  const columns = useMemo(() => {
    return getPositionColumns({ openModal, isMobile: !isLg })
  }, [openModal, isLg])

  const filterValue = vaultFilter?.['positions']?.split(':')?.[1] as
    | VaultFilterType
    | undefined

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all or active do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.side === 'B')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.side === 'A')
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
          isExpandedOverride={expandAll ?? undefined}
        />
      )}
    </>
  )
}

'use client'
import { DataTableVirtual } from '@sushiswap/ui'
import type { PaginationState, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useAllVaults } from 'src/lib/perps'
import { PerpsCard } from '~evm/perps/_ui/_common'
import {
  AGE_COLUMN,
  APR_COLUMN,
  DEPOSIT_COLUMN,
  LEADER_COLUMN,
  NAME_COLUMN,
  SNAPSHOT_COLUMN,
  TVL_COLUMN,
} from './columns'
import { UserVaultsFilters } from './user-vaults-filters'
import { useUserVaultsState } from './user-vaults-provider'

const COLUMNS = [
  NAME_COLUMN,
  LEADER_COLUMN,
  APR_COLUMN,
  TVL_COLUMN,
  DEPOSIT_COLUMN,
  AGE_COLUMN,
  SNAPSHOT_COLUMN,
]

const PROTOCOL_VAULTS = new Set([
  'Hyperliquidity Provider (HLP)',
  'HLP Strategy X',
  'HLP Strategy B',
  'HLP Strategy A',
  'HLP Liquidator 4',
  'HLP Liquidator 3',
  'HLP Liquidator 2',
  'HLP Liquidator',
  'Liquidator',
])

export const UserVaultsTable = () => {
  const { data, isLoading, isError } = useAllVaults()
  const [sorting, setSorting] = useState([{ id: 'tvl', desc: true }])
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const {
    state: { filter, search },
  } = useUserVaultsState()

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data?.filter(
      (vault) => !PROTOCOL_VAULTS.has(vault.summary.name),
    )
    _data = _data.filter((vault) => {
      const isLeading = vault.isVaultLeader
      const isDeposited = Number(vault.depositAmount) > 0
      const isClosed = vault.summary.isClosed
      const isOthers = !isLeading && !isDeposited && !isClosed

      return filter.some((f) => {
        if (f === 'leading') return isLeading
        if (f === 'deposited') return isDeposited
        if (f === 'closed') return isClosed
        if (f === 'others') return isOthers
        return false
      })
    })
    if (search) {
      _data = _data.filter((vault) => {
        return (
          vault.summary.name.toLowerCase().includes(search.toLowerCase()) ||
          vault.summary.leader.toLowerCase().includes(search.toLowerCase()) ||
          vault.summary.vaultAddress
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      })
    }
    return _data
  }, [data, isError, filter, search])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: paginationState,
    }
  }, [sorting, paginationState])

  return (
    <PerpsCard className="p-3 gap-4 flex flex-col">
      <div className="flex justify-between flex-wrap gap-2">
        <h3 className="font-medium">User Vaults</h3>
        <UserVaultsFilters />
      </div>
      <DataTableVirtual
        state={state}
        loading={isLoading}
        columns={COLUMNS}
        data={tableData}
        onSortingChange={setSorting}
        thClassName="!h-8 !px-0"
        hideScrollbar={true}
        onPaginationChange={setPaginationState}
        pagination={true}
      />
    </PerpsCard>
  )
}

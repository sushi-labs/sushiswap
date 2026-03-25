'use client'

import { SmartPoolChainIds } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState, Row } from '@tanstack/react-table'
import React, { type FC, useCallback, useState } from 'react'
import { useClaimableVaults } from 'src/lib/steer/hooks/use-claimable-vaults'
import type { ChainVaultData } from 'src/lib/steer/hooks/use-claimable-vaults'
import { useConnection } from 'wagmi'
import {
  VAULTS_ACTION_COLUMN,
  VAULTS_AMOUNT_COLUMN,
  VAULTS_CHAIN_COLUMN,
} from './columns'
import { VaultDetailHeader } from './vault-detail-header'
import { VaultDetailRow } from './vault-detail-row'

const COLUMNS = [
  VAULTS_CHAIN_COLUMN,
  VAULTS_AMOUNT_COLUMN,
  VAULTS_ACTION_COLUMN,
] satisfies ColumnDef<ChainVaultData, unknown>[]

export const ClaimableVaultsTab: FC = () => {
  const { isConnecting } = useConnection()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useClaimableVaults({
    chainIds: SmartPoolChainIds,
  })

  const rowRenderer = useCallback(
    (row: Row<ChainVaultData>, rowNode: React.ReactNode) => {
      return (
        <React.Fragment key={row.id}>
          {rowNode}
          <VaultDetailHeader />
          {row.original.vaults.map((vault) => (
            <VaultDetailRow key={vault.vaultId} vault={vault} />
          ))}
        </React.Fragment>
      )
    },
    [],
  )

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Vault Fees</CardTitle>
        </CardHeader>
        <DataTable
          loading={isLoading || isConnecting}
          columns={COLUMNS}
          data={data || []}
          pagination={true}
          onPaginationChange={setPaginationState}
          rowRenderer={rowRenderer}
          state={{
            pagination: paginationState,
          }}
        />
      </Card>
    </Container>
  )
}

'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { type FC, useState } from 'react'
import {
  type AngleRewardsPool,
  useAngleRewardsMultipleChains,
} from 'src/lib/hooks/react-query'
import { MERKL_SUPPORTED_CHAIN_IDS } from 'sushi/config'
import { useAccount } from 'wagmi'
import {
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
} from './columns'

const COLUMNS = [
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_APR_COLUMN,
] satisfies ColumnDef<AngleRewardsPool, unknown>[]

export const ClaimableFeesTab: FC = () => {
  const { address, isConnecting } = useAccount()
  const { data: _data, isLoading } = useAngleRewardsMultipleChains({
    chainIds: MERKL_SUPPORTED_CHAIN_IDS,
    account: address,
  })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const networksWithFees = [] as AngleRewardsPool[]

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Claimable Fees{' '}
            <span className="text-gray-400 dark:text-slate-500">
              ({networksWithFees.length})
            </span>
          </CardTitle>
        </CardHeader>
        <DataTable
          loading={isLoading || isConnecting}
          columns={COLUMNS}
          data={networksWithFees}
          pagination={true}
          onPaginationChange={setPaginationState}
          state={{
            pagination: paginationState,
          }}
        />
      </Card>
    </Container>
  )
}

'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { type FC, useMemo, useState } from 'react'
import {
  type ClaimableRewards,
  useClaimableRewards,
} from 'src/lib/hooks/react-query'
import { useAccount } from 'wagmi'
import {
  REWARDS_ACTION_COLUMN,
  REWARDS_AMOUNT_COLUMN,
  REWARDS_CHAIN_COLUMN,
} from './columns'

const COLUMNS = [
  REWARDS_CHAIN_COLUMN,
  REWARDS_AMOUNT_COLUMN,
  REWARDS_ACTION_COLUMN,
] satisfies ColumnDef<ClaimableRewards, unknown>[]

export const ClaimableRewardsTab: FC = () => {
  const { address, isConnecting } = useAccount()
  const { data: _data, isLoading } = useClaimableRewards({ account: address })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const data = useMemo(() => (_data ? Object.values(_data) : []), [_data])

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Claimable Rewards{' '}
            <span className="text-gray-400 dark:text-slate-500">
              ({data.length})
            </span>
          </CardTitle>
        </CardHeader>
        <DataTable
          loading={isLoading || isConnecting}
          columns={COLUMNS}
          data={data}
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

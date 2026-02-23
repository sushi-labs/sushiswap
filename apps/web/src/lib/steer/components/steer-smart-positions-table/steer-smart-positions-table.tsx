'use client'

import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { type FC, useMemo, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { useConnection } from 'wagmi'
import {
  type SteerAccountPositionExtended,
  useSteerAccountPositionsExtended,
} from '../../hooks'
import {
  STEER_APR_COLUMN,
  STEER_NAME_COLUMN,
  STEER_POSITION_SIZE_COLUMN,
  STEER_STRATEGY_COLUMN,
} from './columns'

const COLUMNS = [
  STEER_NAME_COLUMN,
  STEER_STRATEGY_COLUMN,
  STEER_POSITION_SIZE_COLUMN,
  STEER_APR_COLUMN,
] satisfies ColumnDef<SteerAccountPositionExtended, unknown>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

export const SteerSmartPositionsTable: FC<{ chainId: SmartPoolChainId }> = ({
  chainId,
}) => {
  const { address } = useConnection()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: positions, isLoading } = useSteerAccountPositionsExtended({
    account: address,
    chainId,
  })

  const _positions = useMemo(() => (positions ? positions : []), [positions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          My Positions{' '}
          <span className="text-gray-400 dark:text-slate-500">
            ({_positions?.length})
          </span>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        linkFormatter={(row) =>
          `/${getEvmChainById(row.chainId).key}/pool/v3/${row.vault.poolAddress}/smart/${
            row.address
          }`
        }
        columns={COLUMNS}
        data={_positions}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          ...tableState,
          pagination: paginationState,
        }}
      />
    </Card>
  )
}

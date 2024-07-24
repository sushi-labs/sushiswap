'use client'

import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'

import { STEER_SUPPORTED_CHAIN_IDS } from '@sushiswap/steer-sdk'
import {
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import {
  SteerAccountPositionExtended,
  useSteerAccountPositionsExtended,
} from 'src/lib/wagmi/hooks/steer/useSteerAccountPositionsExtended'
import { ChainId, formatPercent, SushiSwapProtocol } from 'sushi'
import { useAccount } from 'wagmi'
import { APRHoverCard } from './APRHoverCard'
import {
  STEER_NAME_COLUMN,
  STEER_POSITION_SIZE_COLUMN,
  STEER_STRATEGY_COLUMN,
} from './ConcentratedPositionsTable/Tables/Smart/columns'
import { usePoolFilters } from './PoolsFiltersProvider'
import { Address } from 'viem'

const COLUMNS = [
  STEER_NAME_COLUMN,
  STEER_STRATEGY_COLUMN,
  STEER_POSITION_SIZE_COLUMN,
  {
    id: 'totalApr1d',
    header: 'APR (24h)',
    accessorFn: (row) => row.vault.stakedAndIncentiveApr1d,
    cell: (props) => {
      const totalAPR = props.row.original.vault.stakedAndIncentiveApr1d

      return (
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="line-through text-muted-foreground">
                  {formatPercent(props.row.original.vault.feeAndIncentiveApr1d)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>APR when not staked within the vault.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <APRHoverCard
            pool={{
              id: props.row.original.id as `${string}:0x${string}`,
              address: props.row.original.vault.poolAddress as Address,
              chainId: props.row.original.vault.chainId as ChainId,

              protocol: SushiSwapProtocol.SUSHISWAP_V3,
              feeApr1d: props.row.original.vault.feeApr1d,
              incentiveApr: props.row.original.vault.incentiveApr,
              isIncentivized: props.row.original.vault.isIncentivized,
              wasIncentivized: props.row.original.vault.wasIncentivized,
            }}
            smartPoolAPR={props.row.original.vault.stakedAndIncentiveApr1d}
          >
            <span className="underline decoration-dotted underline-offset-2">
              {formatPercent(totalAPR / 100)}
            </span>
          </APRHoverCard>
        </div>
      )
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
] satisfies ColumnDef<SteerAccountPositionExtended, unknown>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

export const SmartPositionsTable = () => {
  const { address } = useAccount()
  const { chainIds } = usePoolFilters()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: positions, isLoading } = useSteerAccountPositionsExtended({
    account: address,
    chainIds: chainIds ? chainIds : [...STEER_SUPPORTED_CHAIN_IDS],
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
          `/pool/${row.vault.poolAddress}/smart/${row.vault.id}`
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

import { ColumnDef } from '@tanstack/react-table'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import React from 'react'
import { RewardsV3NameCell } from './RewardsV3NameCell'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { Pool } from '@sushiswap/client'
import { formatNumber } from '@sushiswap/format'
import { Explainer } from '@sushiswap/ui/future/components/Explainer'
import { RewardsV3ClaimableCell } from './RewardsV3ClaimableCell'

export const REWARDS_V3_NAME_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'poolName',
  header: 'Pool',
  cell: (props) => <RewardsV3NameCell row={props.row.original} />,
  size: 200,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <Skeleton.Circle radius={40} />
          <Skeleton.Circle radius={40} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}

export const REWARDS_V3_POSITION_SIZE_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'positionSize',
  header: 'Position Size',
  accessorFn: (row) => row.userTVL ?? 0,
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      ${formatNumber(props.row.original.userTVL)}
    </span>
  ),
  size: 100,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const REWARDS_V3_APR_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'apr',
  header: () => (
    <div className="flex items-center gap-1">
      APR
      <Explainer hover iconSize={16} placement="bottom">
        The APRs displayed for the liquidity pools are algorithmic and subject to change.
      </Explainer>
    </div>
  ),
  accessorFn: (row) => row.meanAPR ?? 0,
  cell: (props) => (
    <span className="text-sm text-right text-gray-900 dark:text-slate-50">
      {formatNumber(props.row.original.meanAPR)}%
    </span>
  ),
  size: 100,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const REWARDS_V3_CLAIMABLE_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'claimable',
  header: 'Claimable',
  accessorFn: (row) => row.userTVL ?? 0,
  cell: (props) => <RewardsV3ClaimableCell row={props.row.original} />,
  size: 100,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

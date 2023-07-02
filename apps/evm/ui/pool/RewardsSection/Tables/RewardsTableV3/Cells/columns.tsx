import { formatNumber } from '@sushiswap/format'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { RewardsV3ClaimableCell } from './RewardsV3ClaimableCell'
import { RewardsV3NameCell } from './RewardsV3NameCell'

export const REWARDS_V3_NAME_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'poolName',
  header: 'Pool',
  cell: (props) => <RewardsV3NameCell row={props.row.original} />,
  size: 200,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={40} />
          <SkeletonCircle radius={40} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
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
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const REWARDS_V3_APR_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'apr',
  header: () => (
    <div className="flex items-center gap-1">
      APR
      <Explainer>The APRs displayed for the liquidity pools are algorithmic and subject to change.</Explainer>
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
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const REWARDS_V3_CLAIMABLE_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'claimable',
  header: 'Claimable',
  accessorFn: (row) => row.userTVL ?? 0,
  cell: (props) => <RewardsV3ClaimableCell row={props.row.original} />,
  size: 100,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

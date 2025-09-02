import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { ClaimableRewardsActionCell } from './ClaimableRewardsActionCell'
import { ClaimableRewardsAmountCell } from './ClaimableRewardsAmountCell'
import { ClaimableRewardsChainCell } from './ClaimableRewardsChainCell'

export const REWARDS_CHAIN_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: (props) => <ClaimableRewardsChainCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-2 items-center w-full">
          <SkeletonCircle radius={18} />
          <div className="w-28">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      ),
    },
  },
}

export const REWARDS_AMOUNT_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'amount',
  header: 'Rewards Amount',
  cell: (props) => <ClaimableRewardsAmountCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="w-24">
          <SkeletonText fontSize="sm" />
        </div>
      ),
    },
  },
}

export const REWARDS_ACTION_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'action',
  header: 'Action',
  cell: (props) => <ClaimableRewardsActionCell {...props.row} />,
  size: 280,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-3 w-[280px]">
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-10 w-full" />
        </div>
      ),
    },
  },
}

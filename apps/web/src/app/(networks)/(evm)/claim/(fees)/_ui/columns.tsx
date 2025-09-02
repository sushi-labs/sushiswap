import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { ClaimableFeesActionCell } from './claimable-fees-action-cell'
import { ClaimableFeesAmountCell } from './claimable-fees-amount-cell'
import { ClaimableFeesChainCell } from './claimable-fees-chain-cell'
import type { ClaimableFees } from './claimable-fees-tab'

export const FEES_CHAIN_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: (props) => <ClaimableFeesChainCell {...props.row} />,
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

export const FEES_AMOUNT_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'amount',
  header: 'Fees Amount',
  cell: (props) => <ClaimableFeesAmountCell {...props.row} />,
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

export const FEES_ACTION_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'action',
  header: 'Action',
  cell: (props) => <ClaimableFeesActionCell {...props.row} />,
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

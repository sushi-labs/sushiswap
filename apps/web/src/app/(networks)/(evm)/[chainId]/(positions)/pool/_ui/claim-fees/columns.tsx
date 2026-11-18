import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { ClaimableFeesActionCell } from './claimable-fees-action-cell'
import { ClaimableFeesAmountCell } from './claimable-fees-amount-cell'
import { ClaimableFeesChainCell } from './claimable-fees-chain-cell'
import type { ClaimableFees } from './claimable-fees-dialog'

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
      className: 'md:!h-[72px]',
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
      className: 'md:!h-[72px]',
    },
  },
}

export function createFeesActionColumn(
  onClaim: (claim: ClaimableFees) => void,
): ColumnDef<ClaimableFees, unknown> {
  return {
    id: 'action',
    header: 'Action',
    cell: (props) => (
      <ClaimableFeesActionCell {...props.row} onClaim={onClaim} />
    ),
    size: 280,
    meta: {
      body: {
        skeleton: (
          <div className="flex gap-3 w-[280px]">
            <SkeletonBox className="h-10 w-full" />
            <SkeletonBox className="h-10 w-full" />
          </div>
        ),
        className: 'md:!h-[72px]',
      },
    },
  }
}

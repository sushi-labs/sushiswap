import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { getEvmChainById } from 'sushi/evm'
import { V4ClaimableFeesActionCell } from './v4-claimable-fees-action-cell'
import type { ClaimableV4Fees } from './v4-claimable-fees-tab'

export const V4_FEES_CHAIN_COLUMN: ColumnDef<ClaimableV4Fees, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: ({ row }) => (
    <div className="flex gap-2 items-center w-full">
      <NetworkIcon chainId={row.original.chainId} width={18} height={18} />
      <span className="font-medium text-sm whitespace-nowrap">
        {getEvmChainById(row.original.chainId).name}
      </span>
    </div>
  ),
  size: 240,
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

export const V4_FEES_POSITIONS_COLUMN: ColumnDef<ClaimableV4Fees, unknown> = {
  id: 'positions',
  accessorFn: ({ tokenIds }) => tokenIds.length,
  header: 'Positions',
  cell: ({ row }) => (
    <span className="font-medium text-sm">{row.original.tokenIds.length}</span>
  ),
  size: 160,
  meta: {
    body: {
      skeleton: (
        <div className="w-10">
          <SkeletonText fontSize="sm" />
        </div>
      ),
    },
  },
}

export const V4_FEES_AMOUNT_COLUMN: ColumnDef<ClaimableV4Fees, unknown> = {
  id: 'amount',
  header: 'Fees Amount',
  cell: () => (
    <span className="text-sm text-muted-foreground">
      Calculated when claimed
    </span>
  ),
  size: 240,
  meta: {
    body: {
      skeleton: (
        <div className="w-32">
          <SkeletonText fontSize="sm" />
        </div>
      ),
    },
  },
}

export const V4_FEES_ACTION_COLUMN: ColumnDef<ClaimableV4Fees, unknown> = {
  id: 'action',
  header: 'Action',
  cell: ({ row }) => <V4ClaimableFeesActionCell {...row} />,
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

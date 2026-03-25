import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { ChainVaultData } from 'src/lib/steer/hooks/use-claimable-vaults'
import { ClaimableVaultsActionCell } from './claimable-vaults-action-cell'
import { ClaimableVaultsAmountCell } from './claimable-vaults-amount-cell'
import { ClaimableVaultsChainCell } from './claimable-vaults-chain-cell'

export const VAULTS_CHAIN_COLUMN: ColumnDef<ChainVaultData, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: (props) => <ClaimableVaultsChainCell {...props.row} />,
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

export const VAULTS_AMOUNT_COLUMN: ColumnDef<ChainVaultData, unknown> = {
  id: 'amount',
  header: 'Total Fees',
  cell: (props) => <ClaimableVaultsAmountCell {...props.row} />,
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

export const VAULTS_ACTION_COLUMN: ColumnDef<ChainVaultData, unknown> = {
  id: 'action',
  header: 'Action',
  cell: (props) => <ClaimableVaultsActionCell {...props.row} />,
  size: 280,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-3 w-[280px]">
          <SkeletonBox className="h-10 w-full" />
        </div>
      ),
    },
  },
}

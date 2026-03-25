import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ChainVaultData } from 'src/lib/steer/hooks/use-claimable-vaults'
import { formatUSD } from 'sushi'

export const ClaimableVaultsAmountCell: FC<Row<ChainVaultData>> = ({
  original,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-sm">
        {formatUSD(original.totalUSD)}
      </span>
      <span className="text-xs text-gray-500 dark:text-slate-400">
        {original.vaults.length} vault{original.vaults.length !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

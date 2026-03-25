import type { FC } from 'react'
import type { VaultWithFees } from 'src/lib/steer/hooks/use-claimable-vaults'
import { Amount, formatUSD } from 'sushi'

interface VaultDetailRowProps {
  vault: VaultWithFees
}

export const VaultDetailRow: FC<VaultDetailRowProps> = ({ vault }) => {
  return (
    <tr className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
      <td className="py-3 px-4 pl-8">
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {vault.token0.symbol}/{vault.token1.symbol}
          </span>
          <span className="text-xs text-gray-500">{vault.swapFee * 100}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm">
          {vault.tvlUSD > 0 ? formatUSD(vault.tvlUSD) : '-'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="text-sm">
            {new Amount(vault.token0, vault.amount0).toSignificant(4)}{' '}
            {vault.token0.symbol}
          </span>
          <span className="text-sm">
            {new Amount(vault.token1, vault.amount1).toSignificant(4)}{' '}
            {vault.token1.symbol}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {formatUSD(vault.totalUSD)}
          </span>
        </div>
      </td>
    </tr>
  )
}

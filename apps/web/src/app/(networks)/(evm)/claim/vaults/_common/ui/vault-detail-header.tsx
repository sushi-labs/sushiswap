import type { FC } from 'react'

export const VaultDetailHeader: FC = () => {
  return (
    <tr className="bg-gray-100/50 dark:bg-slate-800/50 text-xs text-gray-500 uppercase">
      <th className="py-2 px-4 pl-8 text-left font-medium">Pool</th>
      <th className="py-2 px-4 text-left font-medium">TVL</th>
      <th className="py-2 px-4 text-left font-medium">Fees</th>
    </tr>
  )
}

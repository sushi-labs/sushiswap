import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { formatPercent } from '@sushiswap/format'
import { Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  const formattedApr = formatPercent(row.apr)
  return (
    <Typography variant="sm" className="flex items-center gap-1 text-slate-400">
      {formattedApr}
      <Tooltip
        placement="bottom"
        button={<ExclamationCircleIcon className="text-slate-500 hover:text-slate-300" width={14} height={14} />}
        panel={<>{formattedApr}</>}
      />
    </Typography>
  )
}

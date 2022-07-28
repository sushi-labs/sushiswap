import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Popover, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PoolsTableAPRCell: FC<CellProps> = () => {
  return (
    <Typography variant="sm" className="text-slate-400 flex items-center gap-1">
      14.32%
      <Popover
        hover
        button={<ExclamationCircleIcon className="text-slate-500 hover:text-slate-300" width={14} height={14} />}
        panel={<div className="bg-slate-800 border border-slate-200/10 p-3 text-xs rounded-2xl">Example</div>}
      />
    </Typography>
  )
}

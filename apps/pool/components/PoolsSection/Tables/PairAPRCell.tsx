import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CellProps } from './types'

export const PairAPRCell: FC<CellProps> = () => {
  return (
    <Typography variant="sm" className="text-slate-400 flex items-center gap-1">
      14.32%
      <Tooltip
        placement="bottom"
        button={<ExclamationCircleIcon className="text-slate-500 hover:text-slate-300" width={14} height={14} />}
        panel={<>Example</>}
      />
    </Typography>
  )
}

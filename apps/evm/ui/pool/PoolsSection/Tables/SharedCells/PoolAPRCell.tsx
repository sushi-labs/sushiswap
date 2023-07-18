import { Pool } from '@sushiswap/client'
import { formatPercent } from '@sushiswap/format'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import { FC } from 'react'

import { Row } from './types'

export const PoolAPRCell: FC<Row<{ totalApr1d: number; incentives: Pool['incentives'] }>> = ({ row }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
            {formatPercent(row.totalApr1d)}
          </span>
        </TooltipTrigger>
        <TooltipContent>The APR displayed is algorithmic and subject to change.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

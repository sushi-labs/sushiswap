import { PoolExtended } from 'lib/pool/use-pools-extended'
import React, { FC } from 'react'
import { formatUSD } from 'sushi/format'
import { Row } from './types'

export const PoolTVLCell: FC<Row<PoolExtended>> = ({ row }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(row.reserveUSD)}
        </span>
      </div>
    </div>
  )
}

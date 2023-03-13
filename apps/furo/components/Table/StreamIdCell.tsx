import { Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const StreamIdCell: FC<CellProps> = ({ row }) => {
    return (
        <div>
            <Typography variant="sm" weight={500} className="text-slate-200">
                {row.id}
            </Typography>
        </div>
    )
}

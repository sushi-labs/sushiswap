import { Badge } from '@sushiswap/ui/components/badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import React, { FC } from 'react'

import { CellProps } from './types'

export const NetworkCell: FC<CellProps> = ({ row }) => {
  return (
    <Badge
      position="bottom-right"
      badgeContent={
        <div className="border-2 rounded-full dark:border-slate-900 border-gray-100">
          <NetworkIcon width={14} height={14} chainId={row.chainId} />
        </div>
      }
    >
      <Currency.Icon currency={row.token} width={26} height={26} />
      {/*{row.totalAmount?.toSignificant(6)}*/}
    </Badge>
  )
}

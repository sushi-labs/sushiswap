import React, { FC } from 'react'

import { CellProps } from './types'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Currency } from '@sushiswap/ui'

export const NetworkCell: FC<CellProps> = ({ row }) => {
  return (
    <Badge
      position="bottom-right"
      badgeContent={
        <div className="border-2 rounded-full dark:border-slate-900 border-gray-100">
          <NetworkIcon width={20} height={20} chainId={row.chainId} />
        </div>
      }
    >
      <Currency.Icon currency={row.token} width={36} height={36} />
      {/*{row.totalAmount?.toSignificant(6)}*/}
    </Badge>
  )
}

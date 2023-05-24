import React, { FC } from 'react'

import { CellProps } from './types'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'

export const NetworkCell: FC<CellProps> = ({ row }) => {
  return <NetworkIcon width={24} height={24} chainId={row.chainId} />
}

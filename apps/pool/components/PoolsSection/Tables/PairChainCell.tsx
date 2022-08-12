import { NetworkIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PairChainCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon chainId={Number(row.chainId)} width={ICON_SIZE} height={ICON_SIZE} />
    </div>
  )
}

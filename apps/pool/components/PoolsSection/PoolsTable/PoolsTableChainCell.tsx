import { NetworkIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PoolsTableChainCell: FC<CellProps> = ({ pair }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon chainId={Number(pair.chainId)} width={ICON_SIZE} height={ICON_SIZE} />
    </div>
  )
}

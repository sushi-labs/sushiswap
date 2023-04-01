import { ChainId } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from '../columns'
import { Row } from '../types'

export const ChainCell: FC<Row<{ chainId: ChainId }>> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <NetworkIcon chainId={Number(row.chainId)} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
    </div>
  )
}

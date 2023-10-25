import { ChainId } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { FC } from 'react'

import { ICON_SIZE } from '../constants'
import { Row } from './types'

export const PoolChainCell: FC<Row<{ chainId: ChainId }>> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon type="naked" chainId={row.chainId} width={ICON_SIZE} height={ICON_SIZE} />
    </div>
  )
}

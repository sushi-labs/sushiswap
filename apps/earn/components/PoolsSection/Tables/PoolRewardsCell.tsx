import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from './constants'
import { Row } from './SharedCells/types'

export const PoolRewardsCell: FC<Row<{ chainId: ChainId }>> = ({ row }) => {
  return (
    <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
      <Currency.Icon currency={SUSHI[row.chainId as keyof typeof SUSHI]} />
    </Currency.IconList>
  )
}

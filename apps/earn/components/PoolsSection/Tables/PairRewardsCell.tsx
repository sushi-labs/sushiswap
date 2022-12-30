import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PairRewardsCell: FC<CellProps> = ({ row }) => {
  return (
    <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
      <Currency.Icon currency={SUSHI[row.chainId]} />
    </Currency.IconList>
  )
}

import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PairRewardsCell: FC<CellProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPair(row)

  return (
    <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
      <Currency.Icon currency={SUSHI[row.chainId]} />
    </Currency.IconList>
  )
}

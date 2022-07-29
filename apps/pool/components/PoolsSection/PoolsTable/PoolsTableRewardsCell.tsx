import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PoolsTableRewardsCell: FC<CellProps> = ({ pair }) => {
  const [token0, token1] = useTokensFromPair(pair)

  return (
    <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
      <Currency.Icon currency={token0} />
      <Currency.Icon currency={token1} />
    </Currency.IconList>
  )
}

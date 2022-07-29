import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PairNameCell: FC<CellProps> = ({ row }) => {
  const [token0, token1] = useTokensFromPair(row)

  return (
    <div className="flex items-center gap-2">
      <div>
        <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
          <Currency.Icon currency={token0} />
          <Currency.Icon currency={token1} />
        </Currency.IconList>
      </div>
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="text-slate-50 flex gap-1">
          {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
        </Typography>
        <Typography variant="xxs" className="text-slate-400">
          SushiSwap Farm
        </Typography>
      </div>
    </div>
  )
}

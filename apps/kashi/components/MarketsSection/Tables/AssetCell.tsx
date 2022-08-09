import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../../lib/hooks'
import { ICON_SIZE } from './constants'
import { CellProps } from './types'

export const AssetCell: FC<CellProps> = ({ row }) => {
  const { asset } = useTokensFromKashiPair(row)

  return (
    <div className="flex gap-2 items-center">
      <Currency.Icon currency={asset} width={ICON_SIZE} height={ICON_SIZE} />
      <Typography variant="sm" weight={600} className="text-slate-50">
        {asset.symbol}
      </Typography>
    </div>
  )
}

import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { ICON_SIZE } from './constants'
import { CellProps } from './types'

export const CollateralCell: FC<CellProps> = ({ row }) => {
  const { collateral } = useTokensFromKashiPair(row)

  return (
    <div className="flex gap-2 items-center">
      <Currency.Icon currency={collateral} width={ICON_SIZE} height={ICON_SIZE} />
      <Typography variant="sm" weight={600} className="text-slate-50">
        {collateral.symbol}
      </Typography>
    </div>
  )
}

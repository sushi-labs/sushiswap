import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { CellProps } from './types'

export const LendAssetCell: FC<CellProps> = ({ row }) => {
  const { asset, collateral } = useTokensFromKashiPair(row)

  return (
    <div className="flex gap-2 items-center">
      <Currency.Icon currency={asset} width={40} height={40} />
      <Currency.Icon currency={collateral} width={24} height={24} />
      <Typography variant="sm" weight={600} className="text-slate-50">
        {asset.symbol}
      </Typography>
    </div>
  )
}

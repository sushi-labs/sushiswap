import { Amount } from '@sushiswap/currency'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../../lib/hooks'
import { CellProps } from './types'

export const TotalAssetCell: FC<CellProps> = ({ row }) => {
  const { asset } = useTokensFromKashiPair(row)

  return (
    <Typography variant="sm" weight={500} className="text-slate-50 truncate">
      {Amount.fromRawAmount(asset, row.totalAsset.base)?.toSignificant(6)}{' '}
      <span className="text-slate-500">{asset.symbol}</span>
    </Typography>
  )
}

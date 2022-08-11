import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { CellProps } from './types'

export const AvailableForBorrowCell: FC<CellProps> = ({ row }) => {
  const { asset } = useTokensFromKashiPair(row)

  return (
    <Typography variant="sm" weight={500} className="text-slate-50 truncate">
      {'0.00'} {asset.symbol}
    </Typography>
  )
}

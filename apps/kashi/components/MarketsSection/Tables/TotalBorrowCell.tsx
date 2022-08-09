import { Amount } from '@sushiswap/currency'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../../lib/hooks'
import { CellProps } from './types'

export const TotalBorrowCell: FC<CellProps> = ({ row }) => {
  const { collateral } = useTokensFromKashiPair(row)

  return (
    <Typography variant="sm" weight={500} className="text-slate-50 truncate">
      {Amount.fromRawAmount(collateral, row.totalBorrow.base)?.toSignificant(6)}
    </Typography>
  )
}

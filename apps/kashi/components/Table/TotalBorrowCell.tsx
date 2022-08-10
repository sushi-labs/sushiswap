import { Amount } from '@sushiswap/currency'
import { Percent, ZERO } from '@sushiswap/math'
import { Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { CellProps } from './types'

export const TotalBorrowCell: FC<CellProps> = ({ row }) => {
  const { collateral, asset } = useTokensFromKashiPair(row)
  const utilization = useMemo(() => {
    const assetAmount = Amount.fromRawAmount(asset, row.totalAsset.base)
    if (assetAmount.greaterThan(ZERO)) {
      return new Percent(Amount.fromRawAmount(collateral, row.totalBorrow.base).quotient, assetAmount.quotient)
    }

    return undefined
  }, [asset, collateral, row.totalAsset.base, row.totalBorrow.base])

  return (
    <Typography variant="sm" weight={500} className="text-slate-50 truncate">
      {utilization ? utilization?.toFixed(2) : '0.00'}%
    </Typography>
  )
}

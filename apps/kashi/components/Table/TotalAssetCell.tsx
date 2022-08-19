import { Amount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { CellProps } from './types'

export const TotalAssetCell: FC<CellProps> = ({ row }) => {
  const { asset } = useTokensFromKashiPair(row)
  const { data: prices } = usePrices({ chainId: asset.chainId })
  const amount = useMemo(() => Amount.fromRawAmount(asset, row.totalAsset.base), [asset, row.totalAsset.base])

  return (
    <Typography variant="sm" weight={500} className="text-slate-50 truncate">
      {amount && prices?.[asset.wrapped.address]
        ? formatUSD(amount.multiply(prices?.[asset.wrapped.address].asFraction).toFixed(2))
        : '$0.00'}{' '}
    </Typography>
  )
}

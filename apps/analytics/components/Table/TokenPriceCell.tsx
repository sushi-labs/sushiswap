import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import useSWR from 'swr'

import { Bundle } from '../../.graphclient'
import { TokenCellProps } from './types'

export const TokenPriceCell: FC<TokenCellProps> = ({ row }) => {
  const { data: bundles } = useSWR<Bundle[]>(
    '/analytics/api/bundles',
    (url) => fetch(url).then((response) => response.json()),
    {}
  )

  const price = formatUSD(row.price.derivedNative * bundles?.[row.chainId]?.nativePrice)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50 text-right">
      {price.includes('NaN') ? '$0.00' : price}
    </Typography>
  )
}

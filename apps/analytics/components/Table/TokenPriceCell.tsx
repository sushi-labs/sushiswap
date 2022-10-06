import { formatUSD } from '@sushiswap/format'
import { Bundle } from '@sushiswap/graph-client/.graphclient'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import useSWR from 'swr'

import { TokenCellProps } from './types'

export const TokenPriceCell: FC<TokenCellProps> = ({ row }) => {
  const { data: bundles } = useSWR<Bundle[]>('/analytics/api/bundles', (url) =>
    fetch(url).then((response) => response.json())
  )

  const price = formatUSD(row.price.derivedNative * bundles?.[row.chainId]?.nativePrice)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {price.includes('NaN') ? '$0.00' : price}
    </Typography>
  )
}

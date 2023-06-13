import { formatUSD } from '@sushiswap/format'
import { Bundle, Token } from '@sushiswap/graph-client'
import { Typography } from '@sushiswap/ui'
import { Row } from '../../Common'
import { FC } from 'react'
import useSWR from 'swr'

export const TokenPriceCell: FC<Row<Token>> = ({ row }) => {
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

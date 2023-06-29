import { formatUSD } from '@sushiswap/format'
import { Bundle, Token } from '@sushiswap/graph-client'
import { FC } from 'react'
import useSWR from 'swr'

import { Row } from '../../Common'

export const TokenPriceCell: FC<Row<Token>> = ({ row }) => {
  const { data: bundles } = useSWR<Bundle[]>('/analytics/api/bundles', (url) =>
    fetch(url).then((response) => response.json())
  )

  const price = formatUSD(row.price.derivedNative * bundles?.[row.chainId]?.nativePrice)

  return <p className="text-sm font-semibold  text-right text-slate-50">{price.includes('NaN') ? '$0.00' : price}</p>
}

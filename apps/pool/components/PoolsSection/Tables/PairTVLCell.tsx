import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import useSWR from 'swr'

import { Bundle } from '../../../.graphclient'
import { CellProps } from './types'

export const PairTVLCell: FC<CellProps> = ({ row }) => {
  const { data: bundles } = useSWR<Record<number, Bundle>>(`/pool/api/bundles`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const tvl = formatUSD(row.reserveETH * bundles?.[row.chainId].ethPrice)

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}

import { formatUSD } from '@sushiswap/format'
import { FC } from 'react'

import { Row } from '../../Common/types'
import { Token } from '@sushiswap/graph-client'

export const TokenVolumeCell: FC<Row<Token>> = ({ row }) => {
  const volume = formatUSD(row.volumeUSD)

  return <p className="text-sm font-semibold  text-slate-50 text-right">{volume.includes('NaN') ? '$0.00' : volume}</p>
}

import { formatUSD } from '@sushiswap/format'
import { useInViewport } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import { FC, useRef } from 'react'
import { PositionWithPool } from '../../../../../types'

import { PoolPositionProvider } from '../../../../PoolPositionProvider'
import { PoolPositionStakedProvider } from '../../../../PoolPositionStakedProvider'
import { Row } from '../../SharedCells/types'

export const PairValueCell: FC<Row<PositionWithPool>> = ({ row }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  return (
    <div ref={ref}>
      {inViewport && (
        <PoolPositionProvider watch={false} pool={row.pool}>
          <PoolPositionStakedProvider watch={false} pool={row.pool}>
            <_PairValueCell row={row} />
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      )}
    </div>
  )
}

const _PairValueCell: FC<Row<PositionWithPool>> = ({ row }) => {
  const valueUSD = (Number(row.balance) / Number(row.pool.totalSupply)) * Number(row.pool.liquidityUSD)

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {formatUSD(valueUSD)}
    </Typography>
  )
}

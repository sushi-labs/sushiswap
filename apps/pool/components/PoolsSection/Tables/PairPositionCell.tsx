import { formatUSD } from '@sushiswap/format'
import { useInViewport } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import { FC, useRef } from 'react'

import { PoolPositionProvider, usePoolPosition } from '../../PoolPositionProvider'
import { PoolPositionStakedProvider, usePoolPositionStaked } from '../../PoolPositionStakedProvider'
import { CellProps } from './types'

export const PairPositionCell: FC<CellProps> = ({ row }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  return (
    <div ref={ref}>
      {inViewport && (
        <PoolPositionProvider watch={false} pair={row}>
          <PoolPositionStakedProvider watch={false} pair={row}>
            <_PairPositionCell row={row} />
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      )}
    </div>
  )
}

const _PairPositionCell: FC<CellProps> = () => {
  const { value1, value0 } = usePoolPosition()
  const { value0: stakedValue0, value1: stakedValue1 } = usePoolPositionStaked()

  return (
    <Typography variant="sm" weight={600} className="text-right text-slate-50">
      {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
    </Typography>
  )
}

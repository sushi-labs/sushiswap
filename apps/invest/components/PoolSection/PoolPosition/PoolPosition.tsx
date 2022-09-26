import { formatUSD } from '@sushiswap/format'
import { Typography, useBreakpoint } from '@sushiswap/ui'
import { FC } from 'react'

import { PairWithAlias } from '../../../types'
import { usePoolPosition } from '../../PoolPositionProvider'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'

interface PoolPositionProps {
  pair: PairWithAlias
}

export const PoolPosition: FC<PoolPositionProps> = ({ pair }) => {
  const { value0, value1 } = usePoolPosition()
  const { value0: stakedValue0, value1: stakedValue1 } = usePoolPositionStaked()
  const { isLg } = useBreakpoint('lg')

  if (!isLg) return <></>

  return (
    <div className="flex flex-col shadow-md bg-slate-800 rounded-2xl shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/5">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right text-slate-50">
            {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
          </Typography>
        </div>
      </div>
      <PoolPositionDesktop pair={pair} />
      <PoolPositionStakedDesktop pair={pair} />
    </div>
  )
}

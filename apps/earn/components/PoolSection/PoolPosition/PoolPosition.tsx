import { formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { useBreakpoint } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { usePoolPosition } from '../../PoolPositionProvider'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'

interface PoolPositionProps {
  pool: Pool
}

export const PoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { value0, value1 } = usePoolPosition()
  const { value0: stakedValue0, value1: stakedValue1 } = usePoolPositionStaked()
  const { isLg } = useBreakpoint('lg')

  if (!isLg) return <></>

  return (
    <div className="flex flex-col dark:bg-slate-800 rounded-2xl bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
        <Typography weight={600} className="text-gray-900 dark:text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right dark:text-slate-50 text-gray-900">
            {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
          </Typography>
        </div>
      </div>
      <PoolPositionDesktop pool={pool} />
      <PoolPositionStakedDesktop pool={pool} />
    </div>
  )
}

import { Pool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { useBreakpoint } from '@sushiswap/hooks'
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
        <p className="font-semibold  text-gray-900 dark:text-slate-50">My Position</p>
        <div className="flex flex-col">
          <p className="text-sm font-semibold  text-right dark:text-slate-50 text-gray-900">
            {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
          </p>
        </div>
      </div>
      <PoolPositionDesktop pool={pool} />
      <PoolPositionStakedDesktop pool={pool} />
    </div>
  )
}

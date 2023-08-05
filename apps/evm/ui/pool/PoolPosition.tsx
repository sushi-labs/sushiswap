'use client'

import { Pool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { List, Separator } from '@sushiswap/ui'
import { FC } from 'react'

import { PoolPositionDesktop } from './PoolPositionDesktop'
import { usePoolPosition } from './PoolPositionProvider'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolPositionProps {
  pool: Pool
}

export const PoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { value0, value1 } = usePoolPosition()
  const { value0: stakedValue0, value1: stakedValue1 } = usePoolPositionStaked()

  return (
    <List>
      <div className="flex justify-between">
        <List.Label>My Position</List.Label>
        <List.Label>{formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}</List.Label>
      </div>

      <List.Control>
        <PoolPositionDesktop pool={pool} />
        <div className="px-4">
          <Separator className="my-2" />
        </div>
        <PoolPositionStakedDesktop pool={pool} />
      </List.Control>
    </List>
  )
}

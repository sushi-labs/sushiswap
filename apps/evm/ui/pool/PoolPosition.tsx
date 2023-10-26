'use client'

import { Pool } from '@sushiswap/client'
import { formatUSD } from 'sushi/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui/components/card'
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
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <CardDescription>
          {formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolPositionDesktop pool={pool} />
        <PoolPositionStakedDesktop pool={pool} />
      </CardContent>
    </Card>
  )
}

'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { formatUSD } from 'sushi'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { SkeletonText } from '@sushiswap/ui'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'wagmi'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { usePoolPosition } from './PoolPositionProvider'

interface PoolPositionProps {
  pool: V2Pool
}

const PoolPositionDisconnected: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectButton fullWidth variant="secondary" />
      </CardContent>
    </Card>
  )
}

const PoolPositionConnected: FC<PoolPositionProps> = ({ pool }) => {
  const { value0, value1, isLoading } = usePoolPosition()

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <CardDescription>
          {isLoading ? (
            <SkeletonText className="w-[ch-16]" />
          ) : (
            <>{formatUSD(value0 + value1)}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolPositionDesktop pool={pool} />
      </CardContent>
    </Card>
  )
}

export const PoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { address } = useAccount()

  if (!address) {
    return <PoolPositionDisconnected />
  }

  return <PoolPositionConnected pool={pool} />
}

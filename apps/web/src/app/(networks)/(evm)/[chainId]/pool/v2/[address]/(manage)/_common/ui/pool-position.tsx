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

import type { RawV2Pool } from '@sushiswap/graph-client/data-api'
import { SkeletonText } from '@sushiswap/ui'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'wagmi'
import { usePoolPosition } from '../../../_common/ui/pool-position-provider'
import { PoolPositionDesktop } from './pool-position-desktop'

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

const PoolPositionConnected = () => {
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
        <PoolPositionDesktop />
      </CardContent>
    </Card>
  )
}

export const PoolPosition = () => {
  const { address } = useAccount()

  if (!address) {
    return <PoolPositionDisconnected />
  }

  return <PoolPositionConnected />
}

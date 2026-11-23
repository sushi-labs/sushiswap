'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useConnection } from 'wagmi'
import { PoolPositionDesktop } from './pool-position-desktop'

export function PoolPosition(): ReactElement {
  const { address } = useConnection()

  if (address) return <PoolPositionDesktop />
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

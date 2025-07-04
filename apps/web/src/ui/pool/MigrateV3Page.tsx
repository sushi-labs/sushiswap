'use client'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DialogProvider,
} from '@sushiswap/ui'
import React, { type FC } from 'react'
import { useConcentratedLiquidityPositionsFromTokenIdV3 } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenIdV3'
import { MigrateV4 } from './MigrateV4'

export const MigrateV3Page: FC<{ pool: V3Pool; tokenId: string }> = ({
  pool,
  tokenId,
}) => {
  const { data: position } = useConcentratedLiquidityPositionsFromTokenIdV3({
    chainId: pool.chainId,
    tokenId,
  })

  return (
    <DialogProvider>
      <Card>
        <CardHeader>
          <CardTitle>Migrate position</CardTitle>
          <CardDescription>
            Migrate your V2 position to a concentrated liquidity position to
            improve your capital efficiency.
          </CardDescription>
        </CardHeader>
        <MigrateV4 pool={pool} position={position} />
      </Card>
    </DialogProvider>
  )
}

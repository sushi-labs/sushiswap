'use client'

import { ChainId } from '@sushiswap/chain'
import React from 'react'
import { PoolPositionProvider, PoolPositionRewardsProvider, PoolPositionStakedProvider } from 'ui/pool'
import { ConcentratedLiquidityProvider } from 'ui/pool/ConcentratedLiquidityProvider'
import { MigrateTab } from 'ui/pool/PoolPage/MigrateTab'

import { getPool } from '../page'

export default async function MigratePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return (
    <div className="grid md:grid-cols-[auto_404px] gap-10">
      <PoolPositionProvider pool={pool}>
        <PoolPositionStakedProvider pool={pool}>
          <PoolPositionRewardsProvider pool={pool}>
            <ConcentratedLiquidityProvider>
              <MigrateTab pool={pool} />
            </ConcentratedLiquidityProvider>
          </PoolPositionRewardsProvider>
        </PoolPositionStakedProvider>
      </PoolPositionProvider>
    </div>
  )
}

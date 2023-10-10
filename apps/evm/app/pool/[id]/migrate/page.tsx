'use client'

import { LinkInternal } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import {
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
} from 'ui/pool'
import { ConcentratedLiquidityProvider } from 'ui/pool/ConcentratedLiquidityProvider'

import { MigrateTab } from '../../../../ui/pool/MigrateTab'
import { Pool } from '@sushiswap/client'

export default async function MigratePage({
  params,
}: { params: { id: string } }) {
  const [chainId, address] = params.id.split(
    params.id.includes('%3A') ? '%3A' : ':',
  ) as [string, string]
  const res = await fetch(
    `https://pools.sushi.com/api/v0/${chainId}/${address}`,
    { next: { revalidate: 60 } },
  )
  const pool = (await res.json()) as Pool
  if (!pool) {
    notFound()
  }
  return (
    <div className="flex flex-col gap-4">
      <LinkInternal
        href={'/pool/migrate'}
        className="text-blue hover:underline text-sm"
      >
        ← Back
      </LinkInternal>
      <div className="flex flex-col gap-6">
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
    </div>
  )
}

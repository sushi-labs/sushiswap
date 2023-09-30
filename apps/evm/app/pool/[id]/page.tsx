import { ChainId } from '@sushiswap/chain'
import { getPool } from '@sushiswap/client'
import { unsanitize } from '@sushiswap/format'
import { Container, Separator } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { ManageV2LiquidityCard } from 'ui/pool/ManageV2LiquidityCard'
import { PoolTransactionsV2 } from 'ui/pool/PoolTransactionsV2'

import {
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  UnknownTokenAlert,
} from '../../../ui/pool'
import { PoolChartV2 } from '../../../ui/pool/PoolChartV2'
import { PoolComposition } from '../../../ui/pool/PoolComposition'
import { PoolMyRewards } from '../../../ui/pool/PoolMyRewards'
import { PoolPageV3 } from '../../../ui/pool/PoolPageV3'
import { PoolPosition } from '../../../ui/pool/PoolPosition'
import { PoolRewards } from '../../../ui/pool/PoolRewards'
import { PoolStats } from '../../../ui/pool/PoolStats'

export default async function PoolPage({
  params,
  tab = 'add',
}: {
  params: { id: string }
  tab: 'add' | 'remove' | 'unstake' | 'stake'
}) {
  const poolId = unsanitize(params.id)
  const pool = await unstable_cache(async () => getPool(poolId), ['pool', poolId], {
    revalidate: 60 * 15,
  })()

  if (!pool) {
    notFound()
  }

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <UnknownTokenAlert pool={pool} />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <div>
            <ManageV2LiquidityCard pool={pool} tab={tab} />
          </div>
          <div className="flex flex-col gap-6">
            <PoolPositionProvider pool={pool}>
              <PoolPositionStakedProvider pool={pool}>
                <PoolPositionRewardsProvider pool={pool}>
                  <PoolPosition pool={pool} />
                  <PoolMyRewards pool={pool} />
                </PoolPositionRewardsProvider>
              </PoolPositionStakedProvider>
            </PoolPositionProvider>
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
          <div>
            <PoolChartV2 address={pool.address} chainId={pool.chainId as ChainId} />
          </div>
          <div className="flex flex-col gap-6">
            <PoolComposition pool={pool} />
            <PoolStats pool={pool} />
            <PoolRewards pool={pool} />
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <PoolTransactionsV2 pool={pool} poolId={pool.address} />
      </div>
    </Container>
  )
}

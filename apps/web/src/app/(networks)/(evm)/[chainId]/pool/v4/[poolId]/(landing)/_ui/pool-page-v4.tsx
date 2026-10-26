'use client'

import { type RawV4Pool, hydrateV4Pool } from '@sushiswap/graph-client/data-api'
import { Container, Separator } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useV4PoolReserves } from 'src/lib/pool/v4'
import { SushiSwapProtocol } from 'sushi/evm'
import { PoolLiquidityCard } from '~evm/[chainId]/pool/_ui/pool-liquidity-card'
import { PoolStatisticsCharts } from '~evm/[chainId]/pool/_ui/pool-statistics-charts'
import { PoolStatsCard } from '~evm/[chainId]/pool/_ui/pool-stats-card'
import { LiquidityDepthWidgetV4 } from './liquidity-depth-widget-v4'
import { PoolTransactionsV4 } from './pool-transactions-v4'

export const PoolPageV4: FC<{ pool: RawV4Pool }> = ({ pool: rawPool }) => {
  const pool = useMemo(() => hydrateV4Pool(rawPool), [rawPool])

  const { data: reserves, isLoading: isReservesLoading } = useV4PoolReserves({
    pool,
  })

  // Incentives are not expected on V4 pools yet; enable alongside the card below.
  // const { data: rewardsData, isLoading: rewardsLoading } = useRewardCampaigns({
  //   pool: pool.address,
  //   chainId: pool.chainId,
  //   enabled: isMerklChainId(pool.chainId),
  // })

  return (
    <Container maxWidth="5xl" className="flex flex-col gap-4 px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PoolStatisticsCharts
          pool={pool}
          protocol={SushiSwapProtocol.SUSHISWAP_V4}
          depthChart={<LiquidityDepthWidgetV4 pool={pool} />}
        />
        <div className="flex flex-col gap-6">
          <PoolLiquidityCard
            chainId={pool.chainId}
            reserves={reserves}
            isLoading={isReservesLoading}
            unwrap={false}
          />
          <PoolStatsCard stats={pool} />
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      {/* <PoolRewardDistributionsCard
        pool={pool}
        isLoading={rewardsLoading}
        rewardsData={rewardsData}
      /> */}
      <PoolTransactionsV4 pool={pool} />
    </Container>
  )
}

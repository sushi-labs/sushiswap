import { Container, Separator } from '@sushiswap/ui'

import type { RawV2Pool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { PoolChartV2 } from './pool-chart-v2'
import { PoolComposition } from './pool-composition'
import { PoolRewards } from './pool-rewards'
import { PoolStats } from './pool-stats'
import { PoolTransactionsV2 } from './pool-transactions-v2'

interface PoolPageV2 {
  pool: RawV2Pool
}

export const PoolPageV2: FC<PoolPageV2> = ({ pool }) => {
  return (
    <Container maxWidth="5xl" className="flex flex-col gap-4 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolComposition pool={pool} />
          <PoolStats pool={pool} />
          {pool.isIncentivized ? <PoolRewards pool={pool} /> : null}
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      <PoolTransactionsV2 pool={pool} poolAddress={pool.address} />
    </Container>
  )
}

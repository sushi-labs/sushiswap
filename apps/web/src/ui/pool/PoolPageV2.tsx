import { Container, Separator } from '@sushiswap/ui'
import { PoolTransactionsV2 } from 'src/ui/pool/PoolTransactionsV2'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { APRChart } from './APRChart'
import { PoolChartV2 } from './PoolChartV2'
import { PoolComposition } from './PoolComposition'
import { PoolRewards } from './PoolRewards'
import { PoolStats } from './PoolStats'
// import { UnknownTokenAlert } from './UnknownTokenAlert'

interface PoolPageV2 {
  pool: Awaited<V2Pool>
}

export const PoolPageV2: FC<PoolPageV2> = ({ pool }) => {
  return (
    <Container maxWidth="screen-3xl" className="flex flex-col gap-4 px-4">
      {/* <UnknownTokenAlert pool={pool} /> */}
      <APRChart />
      <div className="flex gap-6 w-full">
        <div className="flex-[3_3_0%] min-w-0">
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-w-0 flex flex-col gap-6">
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

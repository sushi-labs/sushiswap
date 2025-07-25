import { Container, Separator } from '@sushiswap/ui'
import { PoolTransactionsV2 } from 'src/ui/pool/PoolTransactionsV2'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { APRChart } from './APRChart'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolChartV2 } from './PoolChartV2'
import { PoolComposition } from './PoolComposition'
import { PoolPrice } from './PoolPrice'
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
      <div className="flex flex-col-reverse gap-6 w-full lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0 flex flex-col gap-6">
          <APRChart />
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-6">
          <PoolAPR />
          <PoolComposition pool={pool} />
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} />
          {pool.isIncentivized ? <PoolRewards pool={pool} /> : null}
        </div>
      </div>

      <PoolTransactionsV2 pool={pool} poolAddress={pool.address} />
    </Container>
  )
}

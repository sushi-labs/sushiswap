import type { GetPoolResponse } from '@sushiswap/graph-client/kadena'
import { Container, Separator } from '@sushiswap/ui'
import type { FC } from 'react'
import { PoolChartV2 } from './PoolChartV2'
import { PoolComposition } from './PoolComposition'
import { PoolStats } from './PoolStats'
import { PoolTransactionsV2 } from './PoolTransactionsV2'

export interface PoolPageV2 {
  pool: GetPoolResponse | undefined
}

export const PoolPageV2: FC<PoolPageV2> = ({ pool }) => {
  return (
    <Container maxWidth="5xl" className="flex flex-col gap-4 px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolComposition pool={pool} />
          <PoolStats pool={pool} />
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      <PoolTransactionsV2 pool={pool} />
    </Container>
  )
}

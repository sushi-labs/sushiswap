'use client'

import { Container } from '@sushiswap/ui'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { Manage } from '~kadena/_common/ui/Pools/Manage/Manage'
import { PoolPosition } from '~kadena/_common/ui/Pools/PoolPosition/PoolPosition'
import { PoolComposition } from '~kadena/_common/ui/Pools/PoolsV2/PoolComposition'
import { usePoolState } from '~kadena/_common/ui/Pools/pool-provider'

export default function AddRemoveLiqPage(props: { params: { id: string } }) {
  const params = props.params
  const poolId = params?.id
  const { token0, token1, isLoadingPool } = usePoolState()

  const { data, isLoading } = usePoolById({
    poolId,
    first: 4,
  })

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Manage />
          <PoolComposition pool={data} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPosition
            token0={token0}
            token1={token1}
            isLoading={isLoadingPool || isLoading}
          />
        </div>
      </div>
    </Container>
  )
}

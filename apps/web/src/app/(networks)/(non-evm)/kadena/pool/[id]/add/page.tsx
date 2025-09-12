'use client'

import { Container } from '@sushiswap/ui'
import { use } from 'react'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { Manage } from '~kadena/_common/ui/Pools/Manage/Manage'
import { PoolPosition } from '~kadena/_common/ui/Pools/PoolPosition/PoolPosition'
import { PoolComposition } from '~kadena/_common/ui/Pools/PoolsV2/PoolComposition'

export default function AddRemoveLiqPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const poolId = params?.id
  const { data } = usePoolById({
    poolId,
    first: 1,
  })

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Manage />
          <PoolComposition pool={data} />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPosition />
        </div>
      </div>
    </Container>
  )
}

'use client'

import { use } from 'react'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { PoolPageV2 } from '~kadena/_common/ui/Pools/PoolsV2/PoolPageV2'

export default function PoolByIdPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const poolId = decodeURIComponent(params.id)

  const { data: pool } = usePoolById({
    poolId,
    first: 1,
  })

  return <PoolPageV2 pool={pool} />
}

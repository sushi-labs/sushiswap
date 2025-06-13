'use client'

import { Container } from '@sushiswap/ui'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { PoolPageV2 } from '~kadena/_common/ui/Pools/PoolsV2/PoolPageV2'

export default function PoolByIdPage(props: { params: { id: string } }) {
  const params = props.params
  const poolId = params.id
  const { data: pool } = usePoolById({
    poolId,
    first: 10,
  })

  console.log('usePoolById data', pool)

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <PoolPageV2 pool={pool} />
    </Container>
  )
}

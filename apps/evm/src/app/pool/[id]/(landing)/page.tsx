import { getPool } from '@sushiswap/client'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { PoolPageV2 } from 'src/ui/pool/PoolPageV2'
import { PoolPageV3 } from 'src/ui/pool/PoolPageV3'
import { unsanitize } from 'sushi'

export default async function PoolPage({
  params,
  tab,
}: {
  params: { id: string }
  tab: 'add' | 'remove' | 'unstake' | 'stake'
}) {
  const poolId = unsanitize(params.id)
  const pool = await unstable_cache(
    async () => getPool(poolId),
    ['pool', poolId],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    notFound()
  }

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return <PoolPageV2 pool={pool} />
}

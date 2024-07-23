import { getPool } from '@sushiswap/client'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { PoolPageV2 } from 'src/ui/pool/PoolPageV2'
import { PoolPageV3 } from 'src/ui/pool/PoolPageV3'
import { unsanitize } from 'sushi'

export default async function PoolPage({
  params,
}: {
  params: { id: string; tab: 'add' | 'remove' | 'unstake' | 'stake' }
}) {
  const poolId = unsanitize(params.id)
  const pool = await unstable_cache(
    async () => await getPool(poolId),
    ['pool', poolId],
    {
      revalidate: 60 * 15,
    },
  )()

  // Rockstar C&D
  if (!pool || pool.id === '42161:0x0a4f9962e24893a4a7567e52c1ce37d5482365de') {
    notFound()
  }

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return <PoolPageV2 pool={pool} tab={params.tab} />
}

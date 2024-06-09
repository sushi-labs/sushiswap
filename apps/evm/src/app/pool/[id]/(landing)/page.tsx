import { getPool } from '@sushiswap/client'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { PoolPageV2 } from 'src/ui/pool/PoolPageV2'
import { PoolPageV3 } from 'src/ui/pool/PoolPageV3'
import { deserialize, serialize, unsanitize } from 'sushi'

export default async function PoolPage({
  params,
}: {
  params: { id: string; tab: 'add' | 'remove' | 'unstake' | 'stake' }
}) {
  const poolId = unsanitize(params.id)
  const pool = await unstable_cache(
    async () => serialize(await getPool(poolId)),
    ['pool', poolId],
    {
      revalidate: 60 * 15,
    },
  )().then(deserialize<Awaited<ReturnType<typeof getPool>>>)

  if (!pool) {
    notFound()
  }

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return <PoolPageV2 pool={pool} tab={params.tab} />
}

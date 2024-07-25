import { getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { PoolPageV2 } from 'src/ui/pool/PoolPageV2'

export default async function PoolPage({
  params,
}: {
  params: { chainId: string; address: string }
}) {
  const { chainId, address } = params
  const pool = await unstable_cache(
    async () => await getV2Pool({ chainId: Number(chainId), address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 3,
    },
  )()

  // Rockstar C&D
  if (!pool || pool.id === '42161:0x0a4f9962e24893a4a7567e52c1ce37d5482365de') {
    return notFound()
  }

  return <PoolPageV2 pool={pool} />
}

import { notFound } from 'next/navigation'

import { Pool } from '@sushiswap/client'
import { PoolPageV2 } from 'src/ui/pool/PoolPageV2'
import { PoolPageV3 } from '../../../ui/pool/PoolPageV3'

export default async function PoolPage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split(
    params.id.includes('%3A') ? '%3A' : ':',
  ) as [string, string]

  const res = await fetch(
    `https://pools.sushi.com/api/v0/${chainId}/${address}`,
    { next: { revalidate: 60 } },
  )
  const pool = (await res.json()) as Pool

  if (!pool) {
    notFound()
  }

  if (pool.protocol === 'SUSHISWAP_V3') {
    return <PoolPageV3 pool={pool} />
  }

  return <PoolPageV2 pool={pool} />
}

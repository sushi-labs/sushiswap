import { getPool } from '@sushiswap/client'
import { unsanitize } from '@sushiswap/format'
import notFound from 'app/pool/not-found'
import { unstable_cache } from 'next/cache'
import { SteerCarousel } from 'ui/pool/Steer/SteerCarousel'

export default async function PositionsCreatePage({
  params,
}: { params: { id: string } }) {
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

  return <SteerCarousel pool={pool} />
}

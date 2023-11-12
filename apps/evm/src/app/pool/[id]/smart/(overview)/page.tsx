import { getPool } from '@sushiswap/client'
import { unstable_cache } from 'next/cache'
import notFound from 'src/app/pool/not-found'
import { SteerCarousel } from 'src/ui/pool/Steer/SteerCarousel'
import { unsanitize } from 'sushi/format'

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

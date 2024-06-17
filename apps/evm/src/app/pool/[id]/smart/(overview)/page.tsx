import { getPool, getSteerVaults } from '@sushiswap/client'
import { unstable_cache } from 'next/cache'
import notFound from 'src/app/pool/not-found'
import { SteerCarousel } from 'src/ui/pool/Steer/SteerCarousel'
import type { ID } from 'sushi'
import { unsanitize } from 'sushi/format'

export default async function VaultOverviewPage({
  params,
}: { params: { id: string } }) {
  const poolId = unsanitize(params.id) as ID
  const poolP = unstable_cache(async () => getPool(poolId), ['pool', poolId], {
    revalidate: 60 * 15,
  })()

  const vaultsP = unstable_cache(
    async () => getSteerVaults({ poolId }),
    ['pool', poolId],
    {
      revalidate: 60 * 15,
    },
  )()

  const [pool, vaults] = await Promise.all([poolP, vaultsP])

  if (!pool || !vaults) {
    notFound()
  }

  return <SteerCarousel pool={pool} />
}

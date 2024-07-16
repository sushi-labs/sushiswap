import { getPool } from '@sushiswap/client'
import { LinkInternal } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import notFound from 'src/app/(evm)/pool/not-found'
import {
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
} from 'src/ui/pool'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { MigrateTab } from 'src/ui/pool/MigrateTab'
import { unsanitize } from 'sushi'

export default async function MigratePage({
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

  return (
    <div className="flex flex-col gap-4">
      <LinkInternal
        href={'/pool/migrate'}
        className="text-blue hover:underline text-sm"
      >
        ← Back
      </LinkInternal>
      <div className="flex flex-col gap-6">
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <ConcentratedLiquidityProvider>
                <MigrateTab pool={pool} />
              </ConcentratedLiquidityProvider>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </div>
    </div>
  )
}

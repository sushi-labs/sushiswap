import { getV3Pool, getVaults } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import notFound from 'src/app/(evm)/pool/not-found'
import { SteerCarousel } from 'src/ui/pool/Steer/SteerCarousel'


export default async function VaultOverviewPage({
  params,
}: {
  params: { chainId: string; address: string }
}) {
  const { chainId, address } = params
  const poolP = await unstable_cache(
    async () => getV3Pool({ chainId: Number(chainId), address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 3,
    },
  )()

  const vaultsP = unstable_cache(
    async () => getVaults({ chainId: Number(chainId), poolAddress: address }),
    ['vaults', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  const [pool, vaults] = await Promise.all([poolP, vaultsP])

  if (!pool || !vaults) {
    notFound()
  }

  return <SteerCarousel pool={pool} vaults={vaults} />
}

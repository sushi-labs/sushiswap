import { getV3Pool, getVaults } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { SteerCarousel } from 'src/ui/pool/Steer/SteerCarousel'
import { ChainId } from 'sushi/chain'
import notFound from '../../../../../not-found'

export default async function VaultOverviewPage({
  params,
}: {
  params: { chainId: string; address: string }
}) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as ChainId
  const pool = await unstable_cache(
    async () => getV3Pool({ chainId, address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  const vaults = await unstable_cache(
    async () => getVaults({ chainId, poolAddress: address }),
    ['vaults', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool || !vaults) {
    return notFound(chainId)
  }

  return <SteerCarousel pool={pool} vaults={vaults} />
}

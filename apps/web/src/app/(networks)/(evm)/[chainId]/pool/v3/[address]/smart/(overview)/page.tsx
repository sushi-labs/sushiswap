import {
  getV3Pool,
  getVaults,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { SteerCarousel } from 'src/lib/steer/components/steer-carousel'
import { type EvmChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'

export default async function VaultOverviewPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await getCachedV3Pool({ chainId, address }))!

  const vaults = await unstable_cache(
    async () => getVaults({ chainId, poolAddress: address }),
    ['vaults', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool || !vaults) {
    return notFound()
  }

  return <SteerCarousel pool={pool} vaults={vaults} />
}

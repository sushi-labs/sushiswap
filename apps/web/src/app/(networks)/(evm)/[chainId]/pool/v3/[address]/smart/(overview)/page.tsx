import {
  getV3Pool,
  getVaults,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { SteerCarousel } from 'src/ui/pool/Steer/SteerCarousel'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { isAddress } from 'viem'

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
    return notFound()
  }

  return <SteerCarousel pool={pool} vaults={vaults} />
}

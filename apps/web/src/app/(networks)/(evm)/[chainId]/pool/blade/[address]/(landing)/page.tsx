import { type BladePool, getBladePool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolPageBlade } from 'src/ui/pool/PoolPageBlade'
import type { EvmChainId } from 'sushi'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params

  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => await getBladePool({ chainId, address }, { retries: 3 }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as unknown as BladePool

  return <PoolPageBlade pool={pool} />
}

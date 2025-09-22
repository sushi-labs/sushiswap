import { type V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { PoolPageV3 } from './_ui/pool-page-v3'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => await getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V3Pool

  return <PoolPageV3 pool={pool} />
}

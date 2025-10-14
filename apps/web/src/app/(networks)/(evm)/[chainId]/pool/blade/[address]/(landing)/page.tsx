import { type RawV2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import ms from 'ms'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { type EvmChainId, isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { PoolPageBlade } from '~evm/[chainId]/_ui/PoolPageBlade'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params

  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV2ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => await getV2Pool({ chainId, address }, { retries: 3 }),
    ['v2', 'pool', `${chainId}:${address}`],
    {
      revalidate: ms('15m'),
    },
  )()) as RawV2Pool

  return <PoolPageBlade pool={pool} />
}

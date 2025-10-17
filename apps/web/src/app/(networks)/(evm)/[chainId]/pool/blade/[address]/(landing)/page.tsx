import {
  type BladePool,
  getBladePool,
} from '@sushiswap/graph-client/data-api-blade-prod'
import ms from 'ms'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { type EvmChainId, isBladeChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { PoolPageBlade } from '~evm/[chainId]/_ui/PoolPageBlade'

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
      revalidate: ms('15m'),
    },
  )()) as unknown as BladePool

  return <PoolPageBlade pool={pool} />
}

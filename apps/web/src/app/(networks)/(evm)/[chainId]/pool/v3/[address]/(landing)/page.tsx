import { notFound } from 'next/navigation'

import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { getCachedV3Pool } from '../_lib/get-cached-v3-pool'
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

  const pool = (await getCachedV3Pool({ chainId, address }))!

  return <PoolPageV3 pool={pool} />
}

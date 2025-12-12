import { notFound } from 'next/navigation'

import { isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { getCachedV2Pool } from '../_lib/get-cached-v2-pool'
import { PoolPageV2 } from './_ui/pool-page-v2'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params

  const chainId = +_chainId

  if (
    !isSushiSwapV2ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await getCachedV2Pool({ chainId, address }))!

  return <PoolPageV2 pool={pool} />
}

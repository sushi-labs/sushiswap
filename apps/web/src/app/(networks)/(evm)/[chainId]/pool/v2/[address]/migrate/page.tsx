import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { ConcentratedLiquidityProvider } from '../../../../_ui/ConcentratedLiquidityProvider'
import { PoolPositionProvider } from '../_common/ui/PoolPositionProvider'
import { MigrateTab } from './_common/ui/MigrateTab'

export default async function MigrateV2PoolPage(props: {
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

  const pool = (await unstable_cache(
    async () => getV2Pool({ chainId, address }, { retries: 3 }),
    ['v2', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V2Pool

  return (
    <div className="flex flex-col gap-6">
      <PoolPositionProvider pool={pool}>
        <ConcentratedLiquidityProvider>
          <MigrateTab pool={pool} />
        </ConcentratedLiquidityProvider>
      </PoolPositionProvider>
    </div>
  )
}

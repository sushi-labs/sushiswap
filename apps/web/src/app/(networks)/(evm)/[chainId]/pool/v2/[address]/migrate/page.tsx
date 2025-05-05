import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolPositionProvider } from 'src/ui/pool'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { MigrateTab } from 'src/ui/pool/MigrateTab'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function MigrateV2PoolPage(props: {
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
    async () => getV2Pool({ chainId, address }),
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

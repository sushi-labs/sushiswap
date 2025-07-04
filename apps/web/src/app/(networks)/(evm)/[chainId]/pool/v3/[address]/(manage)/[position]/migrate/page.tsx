import { type V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolPositionProvider } from 'src/ui/pool'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { MigrateV3Page } from 'src/ui/pool/MigrateV3Page'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function MigrateV3PoolPage(props: {
  params: Promise<{ chainId: string; address: string; position: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address, position } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getV3Pool({ chainId, address }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V3Pool

  return (
    <div className="flex flex-col gap-6">
      <PoolPositionProvider pool={pool}>
        <ConcentratedLiquidityProvider>
          <MigrateV3Page pool={pool} tokenId={position} />
        </ConcentratedLiquidityProvider>
      </PoolPositionProvider>
    </div>
  )
}

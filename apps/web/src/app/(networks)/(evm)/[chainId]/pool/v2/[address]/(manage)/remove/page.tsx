import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolPositionProvider } from 'src/ui/pool'
import { ManageV2LiquidityCard } from 'src/ui/pool/ManageV2LiquidityCard'
import { PoolPosition } from 'src/ui/pool/PoolPosition'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function ManageV2PoolPage(props: {
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
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V2Pool

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <ManageV2LiquidityCard pool={pool} tab="remove" />
      </div>
      <div className="flex flex-col gap-6">
        <PoolPositionProvider pool={pool}>
          <PoolPosition pool={pool} />
        </PoolPositionProvider>
      </div>
    </div>
  )
}

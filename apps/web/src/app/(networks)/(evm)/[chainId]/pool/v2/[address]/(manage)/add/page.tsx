import { notFound } from 'next/navigation'
import { isEvmAddress, isSushiSwapV2ChainId } from 'sushi/evm'
import { PoolPositionProvider } from '../../_common/ui/pool-position-provider'
import { getCachedV2Pool } from '../../_lib/get-cached-v2-pool'
import { ManageV2LiquidityCard } from '../_common/ui/manage-v2-liquidity-card'
import { PoolPosition } from '../_common/ui/pool-position'

export default async function ManageV2PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV2ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await getCachedV2Pool({ chainId, address }))!

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <ManageV2LiquidityCard pool={pool} tab="add" />
      </div>
      <div className="flex flex-col gap-6">
        <PoolPositionProvider pool={pool}>
          <PoolPosition />
        </PoolPositionProvider>
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import { isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { ConcentratedLiquidityProvider } from '../../../../_ui/concentrated-liquidity-provider'
import { PoolPositionProvider } from '../_common/ui/pool-position-provider'
import { getCachedV2Pool } from '../_lib/get-cached-v2-pool'
import { MigrateTab } from './_common/ui/migrate-tab'

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

  const pool = (await getCachedV2Pool({ chainId, address }))!

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

import { isBladeChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { getCachedBladePool } from 'src/lib/pool/blade'
import { BladePoolPosition } from 'src/ui/pool/blade/BladePoolPosition'
import { BladePoolPositionProvider } from 'src/ui/pool/blade/BladePoolPositionProvider'
import { ManageBladeLiquidityCard } from 'src/ui/pool/blade/ManageBladeLiquidityCard'
import { isAddress } from 'viem'

export default async function ManageBladePoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = await getCachedBladePool(chainId, address)

  return (
    <BladePoolPositionProvider pool={pool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ManageBladeLiquidityCard pool={pool} tab="remove" />
        </div>
        <div className="flex flex-col gap-6">
          <BladePoolPosition pool={pool} />
        </div>
      </div>
    </BladePoolPositionProvider>
  )
}

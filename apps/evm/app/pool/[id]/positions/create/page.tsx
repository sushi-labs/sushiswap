import { LinkInternal } from '@sushiswap/ui'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

import { ConcentratedLiquidityProvider } from '../../../../../ui/pool/ConcentratedLiquidityProvider'
import { NewPosition } from '../../../../../ui/pool/NewPosition'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  return (
    <div className="flex flex-col gap-4 mt-4">
      <LinkInternal href={`/pool/${params.id}`} className="text-blue hover:underline text-sm">
        ← Back
      </LinkInternal>
      <ConcentratedLiquidityProvider>
        <NewPosition address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </div>
  )
}

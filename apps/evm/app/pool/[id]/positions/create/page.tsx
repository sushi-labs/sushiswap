import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

import { ConcentratedLiquidityProvider } from '../../../../../ui/pool/ConcentratedLiquidityProvider'
import { NewPosition } from '../../../../../ui/pool/NewPosition'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  return (
    <ConcentratedLiquidityProvider>
      <NewPosition address={address} chainId={chainId} />
    </ConcentratedLiquidityProvider>
  )
}

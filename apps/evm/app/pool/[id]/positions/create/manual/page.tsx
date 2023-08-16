import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { CreatePositionManual } from 'ui/pool/CreatePositionManual'

import { ConcentratedLiquidityProvider } from '../../../../../../ui/pool/ConcentratedLiquidityProvider'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  return (
    <ConcentratedLiquidityProvider>
      <CreatePositionManual address={address} chainId={chainId} />
    </ConcentratedLiquidityProvider>
  )
}

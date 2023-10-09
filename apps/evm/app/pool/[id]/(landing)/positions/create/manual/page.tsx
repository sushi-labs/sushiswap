import { Container } from '@sushiswap/ui'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { ConcentratedLiquidityProvider } from 'ui/pool/ConcentratedLiquidityProvider'
import { CreatePositionManual } from 'ui/pool/CreatePositionManual'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <ConcentratedLiquidityProvider>
        <CreatePositionManual address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </Container>
  )
}

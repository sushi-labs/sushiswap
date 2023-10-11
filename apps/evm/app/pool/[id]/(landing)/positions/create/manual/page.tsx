import { Container } from '@sushiswap/ui'
import { SushiSwapV3ChainId, isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { getChainIdAddressFromId, unsanitize } from 'sushi'
import { ConcentratedLiquidityProvider } from 'ui/pool/ConcentratedLiquidityProvider'
import { CreatePositionManual } from 'ui/pool/CreatePositionManual'

export default async function PositionsCreatePage({
  params,
}: { params: { id: string } }) {
  const { chainId, address } = getChainIdAddressFromId(unsanitize(params.id))

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('This page only supports SushiSwap V3 pools')
  }

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <ConcentratedLiquidityProvider>
        <CreatePositionManual address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </Container>
  )
}

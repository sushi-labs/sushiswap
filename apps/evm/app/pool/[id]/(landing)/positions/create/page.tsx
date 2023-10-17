import {LinkInternal} from '@sushiswap/ui'
import {isSushiSwapV3ChainId} from '@sushiswap/v3-sdk'

import {getChainIdAddressFromId, unsanitize} from 'sushi/format'
import {ConcentratedLiquidityProvider} from 'ui/pool/ConcentratedLiquidityProvider'
import {NewPosition} from 'ui/pool/NewPosition'

export default async function PositionsCreatePage({
  params,
}: { params: { id: string } }) {
  const { chainId, address } = getChainIdAddressFromId(unsanitize(params.id))

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('This page only supports SushiSwap V3 pools')
  }

  return (
    <div className="flex flex-col gap-4">
      <LinkInternal
        href={`/pool/${params.id}`}
        className="text-blue hover:underline text-sm"
      >
        ← Back
      </LinkInternal>
      <ConcentratedLiquidityProvider>
        <NewPosition address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </div>
  )
}

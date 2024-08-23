import { LinkInternal } from '@sushiswap/ui'
import React from 'react'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { NewPosition } from 'src/ui/pool/NewPosition'
import { ChainKey } from 'sushi'
import { SushiSwapV3ChainId } from 'sushi/config'

export default async function PositionsCreatePage({
  params,
}: { params: { address: string; chainId: string } }) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as SushiSwapV3ChainId

  return (
    <div className="flex flex-col gap-4">
      <LinkInternal
        href={`/${ChainKey[chainId]}/pool/v3/${address}/positions`}
        className="text-blue hover:underline text-sm"
      >
        ← Positions
      </LinkInternal>
      <ConcentratedLiquidityProvider>
        <NewPosition address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </div>
  )
}

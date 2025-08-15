import { notFound } from 'next/navigation'
import React from 'react'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { NewPosition } from 'src/ui/pool/NewPosition'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'

export default async function PositionsCreatePage(props: {
  params: Promise<{ address: string; chainId: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId
  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  return (
    <ConcentratedLiquidityProvider>
      <NewPosition address={address} chainId={chainId} />
    </ConcentratedLiquidityProvider>
  )
}

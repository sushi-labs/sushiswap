import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'
import { PositionHeader } from './_common/ui/position-header'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string; position: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address, position } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await getCachedV3Pool({ chainId, address }))!

  const headersList = await headers()
  const referer = headersList.get('referer')

  return (
    <ConcentratedLiquidityProvider>
      <Container maxWidth="7xl" className="pt-6 px-4">
        <PositionHeader
          backUrl={referer?.includes('/pool') ? referer?.toString() : undefined}
          poolAddress={address}
          pool={pool}
          title={{
            main: 'Manage Position',
            sub: 'Manage your concentrated liquidity position',
          }}
          tokenId={position}
        />
      </Container>
      <section className="flex flex-col flex-1">
        <Container maxWidth="7xl" className="px-4 py-10">
          {children}
        </Container>
      </section>
    </ConcentratedLiquidityProvider>
  )
}

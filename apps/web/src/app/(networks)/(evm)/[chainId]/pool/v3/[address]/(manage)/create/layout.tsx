import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { getEvmChainById, isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { PoolHeader } from '~evm/[chainId]/pool/_ui/pool-header'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await getCachedV3Pool({ chainId, address }))!

  const headersList = await headers()
  const referer = headersList.get('referer')

  return (
    <>
      <Container maxWidth="7xl" className="pt-6 px-4">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : undefined
          }
          address={address}
          pool={pool}
          apy={{ rewards: pool.incentiveApr, fees: pool.feeApr1d }}
          title={{
            main: 'New Position',
            sub: 'Create a new concentrated liquidity position',
          }}
        />
      </Container>
      <section className="flex flex-col flex-1">
        <Container maxWidth="7xl" className="px-4 py-10">
          {children}
        </Container>
      </section>
    </>
  )
}

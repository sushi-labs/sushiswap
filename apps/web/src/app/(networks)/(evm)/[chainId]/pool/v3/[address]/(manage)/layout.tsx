import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import type React from 'react'
import { getEvmChainById, isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { PoolHeaderLayout } from '~evm/[chainId]/pool/_ui/pool-header-layout'
import { getCachedV3Pool } from '../_lib/get-cached-v3-pool'

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

  return (
    <PoolHeaderLayout
      address={address}
      pool={pool}
      backUrl={`/${getEvmChainById(chainId).key}/pool/v3/${address}`}
    >
      <Container maxWidth="5xl" className="px-4">
        {children}
      </Container>
    </PoolHeaderLayout>
  )
}

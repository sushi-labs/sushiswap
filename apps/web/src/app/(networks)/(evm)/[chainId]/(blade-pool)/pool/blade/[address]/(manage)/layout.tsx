import { isBladeChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import type React from 'react'
import { getCachedBladePool } from 'src/lib/pool/blade'
import { BladePoolLiquidityHeader } from 'src/ui/pool/blade/BladePoolLiquidityHeader'
import { getEvmChainById, isEvmAddress } from 'sushi/evm'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isBladeChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = await getCachedBladePool(chainId, address)

  return (
    <>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <BladePoolLiquidityHeader
          backUrl={`/${getEvmChainById(chainId).key}/pool/blade/${address}`}
          address={pool.address}
          pool={pool}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
          <Container maxWidth="5xl" className="px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}

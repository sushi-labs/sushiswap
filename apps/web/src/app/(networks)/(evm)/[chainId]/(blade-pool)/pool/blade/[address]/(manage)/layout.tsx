import { getBladePool, isBladeChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type React from 'react'
import { BladePoolLiquidityHeader } from 'src/ui/pool/blade/BladePoolLiquidityHeader'
import { ChainKey, type EvmChainId } from 'sushi/chain'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = await unstable_cache(
    async () => getBladePool({ chainId, address }),
    ['v2', 'pool', `${chainId}:${address}`],
    {
      revalidate: 15,
    },
  )()

  return (
    <>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <BladePoolLiquidityHeader
          backUrl={`/${ChainKey[chainId]}/pool/blade/${address}`}
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

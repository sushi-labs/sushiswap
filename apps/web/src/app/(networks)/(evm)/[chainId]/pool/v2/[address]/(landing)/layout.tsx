import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { type EvmChainId, isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { PoolHeader } from '~evm/[chainId]/pool/_ui/pool-header'
import { getCachedV2Pool } from '../_lib/get-cached-v2-pool'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV2ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await getCachedV2Pool({ chainId, address }))!

  const headersList = await headers()
  const referer = headersList.get('referer')

  return (
    <>
         <Container maxWidth="7xl" className="pt-6 md:pt-10 px-4">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : undefined
          }
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
          showAddLiquidityButton
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

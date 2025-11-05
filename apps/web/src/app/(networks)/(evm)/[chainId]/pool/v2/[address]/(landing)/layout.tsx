import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { getChainById } from 'sushi'
import { type EvmChainId, isSushiSwapV2ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
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

  return (
    <>
      <Container maxWidth="screen-3xl" className="px-4 pt-10">
        <PoolHeader
          backUrl={`/${getChainById(chainId).key}/explore/pools`}
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
          showAddLiquidityButton
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="h-full md:py-7">{children}</div>
      </section>
    </>
  )
}
